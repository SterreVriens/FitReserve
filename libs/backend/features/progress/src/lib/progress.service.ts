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
      ){
      this.seedDb()
    }

    async seedDb() {
        const currentProgress = await this.getAll();
        if (currentProgress.length > 0) {
          Logger.log('db already seeded');
          return;
        }
        Logger.log('seeding db');
  
        const currentUsers = await this.userService.getAll(); 
        const currentTrainings = await this.trainingService.getAll();
        
        const progress1 = new Progress();
        progress1.Weight = 25;
        progress1.Reps = 3;
        progress1.Duration = 0;
        progress1.Date = new Date();
        progress1.UserId = currentUsers[3]._id;
        progress1.TrainingId = currentTrainings[0]._id;
        const newProgress1 = new this.progressModel(progress1);
        await newProgress1.save();

        const progress2 = new Progress();
        progress2.Weight = 30;
        progress2.Reps = 5;
        progress2.Duration = 0;
        progress2.Date = new Date();
        progress2.UserId = currentUsers[3]._id;
        progress2.TrainingId = currentTrainings[2]._id;
        const newProgress2 = new this.progressModel(progress2);
        await newProgress2.save();


        const progress3 = new Progress();
        progress3.Weight = 20;
        progress3.Reps = 4;
        progress3.Duration = 0;
        progress3.Date = new Date();
        progress3.UserId = currentUsers[2]._id;
        progress3.TrainingId = currentTrainings[1]._id;
        const newProgress3 = new this.progressModel(progress3);
        await newProgress3.save();

    
    }

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
    
    

}