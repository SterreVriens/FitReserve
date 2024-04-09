import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Enrollment } from "./schemas/enrollment.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "@fit-reserve/backend/features";
import { TrainingService } from "@fit-reserve/backend/features/training";
import { IEnrollment } from "@fit-reserve/shared/api";
import { RecommendationService } from "@fit-reserve/backend/features/recommendation";
import { LocationService } from "@fit-reserve/backend/features/location";

@Injectable()
export class EnrollmentService{
    
    TAG = 'EnrollmentService';

    constructor(
        @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
        private userService: UserService,
        private locationService: LocationService,
        private trainingService: TrainingService,
        private readonly recommendationsService: RecommendationService,
        ){}

    async getAll() :Promise<Enrollment[]>{
        Logger.log("GetAll", this.TAG)
        return this.enrollmentModel.find().exec();
        }

    async getAllFromUser(id: string): Promise<IEnrollment[]> {
        Logger.log(`GetAllFromUser(${id})`, this.TAG);
        
        try {
            const enrollments = await this.enrollmentModel.find({ UserId: id }).exec();

            // Haal de trainingen op voor elke inschrijving
            const enrollmentsWithTraining: IEnrollment[] = await Promise.all(enrollments.map(async (enrollment) => {
                const training = await this.trainingService.getOne(enrollment.TrainingId);
                const location = training ? await this.locationService.getOne(training.LocationId) : null;

                return {
                    ...enrollment.toObject(),
                    Training: training || null,
                    Location: location || null,
                };
            }));
        
            return enrollmentsWithTraining || [];
        } catch (error) {
            console.error('Error fetching user enrollments:', error);
            return [];
        }
    }
        

    //haal de training en users op die bij de ernollment horen
    async getAllFromTraining(id: string): Promise<Enrollment[]> {
        Logger.log(`GetAllFromTraining(${id})`, this.TAG);
    
        try {
            const enrollments = await this.enrollmentModel.find({ TrainingId: id }).exec();
            //zoek de users die bij het userid passen
            const enrollmentsWithUser: Enrollment[] = await Promise.all(enrollments.map(async (enrollment) => {
                const user = await this.userService.getOne(enrollment.UserId);
                return {
                    ...enrollment.toObject(),
                    User: user || null,
                };
            }));

            return enrollmentsWithUser || []; // Als resultaat null is, retourneer een lege array
        } catch (error) {
            console.error('Error fetching training enrollments:', error);
            return [];
        }
    }
    
    async getOne(id: string): Promise<IEnrollment | null> {
        Logger.log(`GetOne(${id})`, this.TAG);
        const enrollment = await this.enrollmentModel.findById(id).exec();

        if (!enrollment) {
            throw new NotFoundException(`Enrollment with ID ${id} not found`);
        }

        const user = await this.userService.getOne(enrollment.UserId);
        const training = await this.trainingService.getOne(enrollment.TrainingId);
        const location = training ? await this.locationService.getOne(training.LocationId) : null;

        const fullEnrollment: IEnrollment = {
            ...enrollment.toObject(),
            User: user || null, // Use null as fallback if user is null
            Training: training || null, // Use null as fallback if training is null
            Location: location || null, // Use null as fallback if location is null
        };
    
        return fullEnrollment;
    }
    
    async checkAvailability(trainingId: string): Promise<boolean> {
        const training = await this.trainingService.getOne(trainingId);
        if (!training) {
            throw new NotFoundException(`Training with ID ${trainingId} not found`);
        }

        const enrolledCount = await this.enrollmentModel.countDocuments({ TrainingId: trainingId }).exec();
        return enrolledCount < training.Places;
    }

    async checkIfEnrollmentExists(trainingId: string,userId: string): Promise<IEnrollment | null> {
        Logger.log('checkIfEnrollmentExists', this.TAG);
        const existingEnrollment = await this.enrollmentModel.findOne({  TrainingId: trainingId,UserId: userId }).exec();
        return existingEnrollment;
    }
    

    async create(enrollment: Enrollment): Promise<Enrollment|null> {
        Logger.log('create', this.TAG);

        const isAvailable = await this.checkAvailability(enrollment.TrainingId);
        if (!isAvailable) {
            throw new ConflictException(`No available places for training with ID ${enrollment.TrainingId}`);
        }

        const enrollmentExists = await this.checkIfEnrollmentExists(enrollment.UserId, enrollment.TrainingId);
        if (enrollmentExists) {
            throw new ConflictException(`User with ID ${enrollment.UserId} is already enrolled in training with ID ${enrollment.TrainingId}`);
        }

        const newEnrollment: Enrollment = {
            ...enrollment,
        }

        const enrollmentModel = new this.enrollmentModel(newEnrollment);
        await enrollmentModel.save();

        const neo4jR = await this.recommendationsService.createOrUpdateEnrollment(enrollmentModel);

        if (!neo4jR) {
        await this.enrollmentModel.findByIdAndDelete(enrollmentModel._id).exec();
            return null;
        }

        return newEnrollment;
    }

    async delete(id: string): Promise<string> {
        Logger.log(`Delete(${id})`, this.TAG);

        // Controleer of de enrollment bestaat
        const enrollment = await this.enrollmentModel.findById(id).exec();
        if (!enrollment) {
            throw new NotFoundException(`Enrollment with ID ${id} not found`);
        }

        // Verwijder de enrollment
        await this.enrollmentModel.findByIdAndDelete(id).exec();

        const n4jResult = this.recommendationsService.deleteEnrollment(id);

        if (!n4jResult) {
        throw new Error('Could not delete hour scheme');
        }
        return(`Enrollment with id ${id} is sucessfully deleted`);
    }
        
    async deleteEnrollmentsByTrainingId(trainingId: string): Promise<string> {
        Logger.log(`Delete enrollments by TrainingId - ${trainingId}`, this.TAG);
    
        try {
          // Find the enrollments with the specified TrainingId
          const enrollmentsToDelete = await this.enrollmentModel.find({ TrainingId: trainingId }).exec();
    
          // Delete each enrollment
          await Promise.all(enrollmentsToDelete.map(async (enrollment) => {
            await this.enrollmentModel.findByIdAndDelete(enrollment._id).exec();
          }));
    
          Logger.log('Enrollments deleted successfully', this.TAG);
          return `Enrollments with TrainingId ${trainingId} deleted successfully`;
        } catch (error) {
          Logger.error(`Error deleting enrollments with TrainingId ${trainingId}`, error, this.TAG);
          throw new Error('An error occurred while deleting the enrollments');
        }
      }
}