import { User } from "@fit-reserve/backend/features";
import { Enrollment } from "@fit-reserve/backend/features/enrollment";
import { Progress } from "@fit-reserve/backend/features/progress";
import { Training } from "@fit-reserve/backend/features/training";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class DataSeederService {
    private readonly logger = new Logger(DataSeederService.name);
    
    constructor(
        @InjectModel(Progress.name) 
        private progressModel: Model<Progress>,
        @InjectModel(Training.name)
        private trainingModel: Model<Training>,
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel(Enrollment.name)
        private enrollmentModel: Model<Enrollment>
    ) {
        this.seedData();
    }

    async seedData(): Promise<void> {
        this.logger.log('Seeding data...');

        const progresses = await this.progressModel.find().exec();
        const trainings  = await this.trainingModel.find().exec();
        const users = await this.userModel.find().exec();
        const enrollments = await this.enrollmentModel.find().exec();

        if(
            progresses.length >= 6 &&
            trainings.length >= 5 &&
            users.length >= 5 &&
            enrollments.length >= 5
        ) {
            this.logger.log(`Data already seeded, skipping...`);
            return;
        }

        
    }
}