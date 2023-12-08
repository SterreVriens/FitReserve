import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Enrollment } from "./schemas/enrollment.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "@fit-reserve/backend/features";
import { TrainingService } from "@fit-reserve/backend/features/training";
import { IEnrollment, Level } from "@fit-reserve/shared/api";

@Injectable()
export class EnrollmentService{
    
    TAG = 'EnrollmentService';

    constructor(
        @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
        private userService: UserService,
        private trainingService: TrainingService
        ){
        this.seedDb()
    }

    async seedDb() {
        const currentEnrollment = await this.getAll();
        if (currentEnrollment.length > 0) {
          Logger.log('db already seeded');
          return;
        }
        Logger.log('seeding db');
  
        const currentUsers = await this.userService.getAll(); 
        const currentTrainings = await this.trainingService.getAll();
        
        const enrollment1 = new Enrollment();
        enrollment1.UserId = currentUsers[0]._id;
        enrollment1.TrainingId = currentTrainings[0]._id;
        enrollment1.Level = Level.Beginner;
        const newEnrollment1 = new this.enrollmentModel(enrollment1);
        await newEnrollment1.save();

        const enrollment2 = new Enrollment();
        enrollment2.UserId = currentUsers[1]._id;
        enrollment2.TrainingId = currentTrainings[0]._id;
        enrollment2.Level = Level.Experienced;
        const newEnrollment2 = new this.enrollmentModel(enrollment2);
        await newEnrollment2.save();

        const enrollment3 = new Enrollment();
        enrollment3.UserId = currentUsers[0]._id;
        enrollment3.TrainingId = currentTrainings[1]._id;
        enrollment3.Level = Level.Beginner;
        const newEnrollment3 = new this.enrollmentModel(enrollment3);
        await newEnrollment3.save();

        const enrollment4 = new Enrollment();
        enrollment4.UserId = currentUsers[1]._id;
        enrollment4.TrainingId = currentTrainings[1]._id;
        enrollment4.Level = Level.Experienced;
        const newEnrollment4 = new this.enrollmentModel(enrollment4);
        await newEnrollment4.save();
    
    }

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
                    
                return {
                    ...enrollment.toObject(),
                    Training: training || null,
                };
            }));
        
            return enrollmentsWithTraining || [];
        } catch (error) {
            console.error('Error fetching user enrollments:', error);
            return [];
        }
    }
        

    async getAllFromTraining(id: string): Promise<Enrollment[]> {
        Logger.log(`GetAllFromTraining(${id})`, this.TAG);
    
        try {
            const result = await this.enrollmentModel.find({ TrainingId: id }).exec();
    
            return result || []; // Als resultaat null is, retourneer een lege array
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
    
        const fullEnrollment: IEnrollment = {
            ...enrollment.toObject(),
            User: user || null, // Gebruik null als fallback als user null is
            Training: training || null, // Gebruik null als fallback als training null is
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
    

    async create(enrollment: Enrollment): Promise<Enrollment> {
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