import { UserService } from "@fit-reserve/backend/features";
import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Progress } from "./schemas/progres.schema";
import { TrainingService } from "@fit-reserve/backend/features/training";
import { IProgress } from "@fit-reserve/shared/api";
import { EnrollmentService } from "@fit-reserve/backend/features/enrollment";


@Injectable()
export class ProgressService{
    TAG = 'ProgressService';

    constructor(
      @InjectModel(Progress.name) private progressModel: Model<Progress>,
      private userService: UserService,
      private trainingService: TrainingService,
      private enrollmentService: EnrollmentService
      ){}

    async getAll() :Promise<Progress[]>{
        Logger.log("GetAll", this.TAG)
        return this.progressModel.find().exec();
    }

    async getAllFromUser(id: string) :Promise<Progress[]>{
        Logger.log(`GetAllFromUser(${id})`, this.TAG);
    
        try {
            const result = await this.progressModel.find({ UserId: id }).exec();
    
            return result || []; // Als resultaat null is, retourneer een lege array
        } catch (error) {
            console.error('Error fetching user enrollments:', error);
            return [];
        }
    }

    async getOne(id: string): Promise<IProgress | null> {
        Logger.log(`GetOne(${id})`, this.TAG);
        const progress = await this.progressModel.findById(id).exec();
    
        if (!progress) {
            throw new NotFoundException(`progress with ID ${id} not found`);
        }
    
        const user = await this.userService.getOne(progress.UserId);
        const training = await this.trainingService.getOne(progress.TrainingId);
    
        const fullProgress: IProgress = {
            ...progress.toObject(),
            User: user || null, // Gebruik null als fallback als user null is
            Training: training || null, // Gebruik null als fallback als training null is
        };
    
        return fullProgress;
    }

    async checkOne(trainingId: string, userId: string): Promise<IProgress | null> {
        Logger.log(`CheckOne`, this.TAG);
        const progress = await this.progressModel.findOne({ TrainingId: trainingId, UserId: userId }).exec();
      
        if (!progress) {
          throw new NotFoundException(`Progress not found`);
        }
      
        const training = await this.trainingService.getOne(progress.TrainingId);
      
        const fullProgress: IProgress = {
          ...progress.toObject(),
          Training: training || null,
        };
      
        return fullProgress;
      }
      

    private async isUserEnrolled(userId: string, trainingId: string): Promise<boolean> {
        const enrollments = await this.enrollmentService.getAllFromUser(userId);
        let isEnrolled = false;
        for (const enrollment of enrollments) {
            if (enrollment.TrainingId == trainingId) {
                isEnrolled = true;
                break;  // Exit the loop once a match is found
            }
        }
        return isEnrolled;
    }
    

    
      
    
    async create(progress: Progress): Promise<Progress> {
        Logger.log('create', this.TAG);
    
        // Check if the user is enrolled in the specified training
        Logger.log(progress.UserId)
        const isEnrolled = await this.isUserEnrolled(progress.UserId, progress.TrainingId);
    
        if (!isEnrolled) {
            // Return a conflict response if the user is not enrolled
            throw new ConflictException(`User ID ${progress.UserId} is not enrolled in Training ID ${progress.TrainingId}`);
        }
    
        // Check if a progress entry already exists for the user and training
        const existingProgress = await this.progressModel.findOne({
            UserId: progress.UserId,
            TrainingId: progress.TrainingId,
        }).exec();
    
        if (existingProgress) {
            // Return a conflict response if a progress entry already exists
            throw new ConflictException(`Progress entry already exists for User ID ${progress.UserId} and Training ID ${progress.TrainingId}`);
        }
    
        const newProgress: Progress = {
            ...progress,
        };
    
        const progressModel = new this.progressModel(newProgress);
        await progressModel.save();
    
        return newProgress;
    }
    
    async deleteProgressByTrainingId(trainingId: string): Promise<string> {
        Logger.log(`Delete progress by TrainingId - ${trainingId}`, this.TAG);
    
        try {
          // Find the progress entries with the specified TrainingId
          const progressToDelete = await this.progressModel.find({ TrainingId: trainingId }).exec();
    
          // Delete each progress entry
          await Promise.all(progressToDelete.map(async (progress) => {
            await this.progressModel.findByIdAndDelete(progress._id).exec();
          }));
    
          Logger.log('Progress entries deleted successfully', this.TAG);
          return `Progress entries with TrainingId ${trainingId} deleted successfully`;
        } catch (error) {
          Logger.error(`Error deleting progress entries with TrainingId ${trainingId}`, error, this.TAG);
          throw new Error('An error occurred while deleting the progress entries');
        }
    }
    

}