import { User, UserService } from "@fit-reserve/backend/features";
import { Enrollment } from "@fit-reserve/backend/features/enrollment";
import { Progress } from "@fit-reserve/backend/features/progress";
import { Training, TrainingService } from "@fit-reserve/backend/features/training";
import { Level, Role } from "@fit-reserve/shared/api";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { RecommendationService } from "@fit-reserve/backend/features/recommendation";

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
        private enrollmentModel: Model<Enrollment>,
        private userService: UserService,
        private trainingService: TrainingService,
        private rcmndService: RecommendationService
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
        else{
            this.logger.log('Data incompleet, seeding data...')

            this.userModel.deleteMany({}).exec();

            const seedUser1 = new User();
            seedUser1.UserName = 'mustrumridcully';
            seedUser1.Password = await this.generateHashedPassword('Hallo123');
            seedUser1.Date = new Date();
            seedUser1.Role = Role.Trainee;
            const newSeedUser1 = new this.userModel(seedUser1);
            await newSeedUser1.save();
            await this.rcmndService.createOrUpdateUser(newSeedUser1)
        
            const seedUser2 = new User();
            seedUser2.UserName = 'rincewind';
            seedUser2.Password = await this.generateHashedPassword('Hallo123');
            seedUser2.Date = new Date();
            seedUser2.Role= Role.Trainee
            const newSeedUser2 = new this.userModel(seedUser2);
            await newSeedUser2.save();
            await this.rcmndService.createOrUpdateUser(newSeedUser2)

            const seedUser3 = new User();
            seedUser3.UserName = 'John Doe';
            seedUser3.Password = await this.generateHashedPassword('Hallo123');
            seedUser3.Date = new Date();
            seedUser3.Role= Role.Trainee
            const newSeedUser3 = new this.userModel(seedUser3);
            await newSeedUser3.save();
            await this.rcmndService.createOrUpdateUser(newSeedUser3)

            const seedUser4 = new User();
            seedUser4.UserName = 'Sterre';
            seedUser4.Password = await this.generateHashedPassword('Hallo123');
            seedUser4.Date = new Date();
            seedUser4.Role= Role.Trainee
            const newSeedUser4 = new this.userModel(seedUser4);
            await newSeedUser4.save();
            await this.rcmndService.createOrUpdateUser(newSeedUser4)

            const seedUser5 = new User();
            seedUser5.UserName = 'TrainerBob';
            seedUser5.Password = await this.generateHashedPassword('Hallo123');
            seedUser5.Date = new Date();
            seedUser5.Role= Role.Trainer
            const newSeedUser5 = new this.userModel(seedUser5);
            await newSeedUser5.save();
            await this.rcmndService.createOrUpdateUser(newSeedUser5)

            this.trainingModel.deleteMany({}).exec();

            const currentUsers = await this.userService.getAll(); 
      
            const training1= new Training();
            training1.SessionName= 'Krachttraining';
            training1.Date= new Date('2023-11-15T10:00:00');
            training1.Duration= 1.5;
            training1.Description= 'Een intensieve krachttrainingssessie met focus op verschillende spiergroepen en gewichten.';
            training1.Location= 'Gym XYZ';
            training1.Places= 2;
            training1.UserId= currentUsers[4]._id; // Associate user1 with training1
            const newTraining = new this.trainingModel(training1);
            await newTraining.save();
            await this.rcmndService.createOrUpdateTraining(newTraining)
        
            const training3 = new Training();
            training3.SessionName = 'Krachttraining';
            training3.Date = new Date('2023-11-15T10:00:00');
            training3.Duration = 1.5;
            training3.Description = 'Een intensieve krachttrainingssessie met focus op verschillende spiergroepen en gewichten.';
            training3.Location = 'Gym XYZ';
            training3.Places = 20;
            training3.UserId =currentUsers[4]._id; // Associate user1 with training1
            const newTraining3 = new this.trainingModel(training3);
            await newTraining3.save();
            await this.rcmndService.createOrUpdateTraining(newTraining3)

            const training2 = new Training();
            training2.SessionName = 'Yoga';
            training2.Date = new Date('2023-11-16T18:30:00');
            training2.Duration = 1.0;
            training2.Description = 'Een ontspannende yogasessie om flexibiliteit, balans en innerlijke rust te bevorderen.';
            training2.Location = 'Yoga Studio ABC';
            training2.Places = 15;
            training2.UserId = currentUsers[4]._id; // Associate user2 with training2
            const newTraining2 = new this.trainingModel(training2);
            await newTraining2.save();
            await this.rcmndService.createOrUpdateTraining(newTraining2)

            const training4 = new Training();
            training4.SessionName = 'Weight lifting';
            training4.Date = new Date('2023-12-16T18:30:00');
            training4.Duration = 1.0;
            training4.Description = 'Weight lifting, ook wel bekend als krachttraining of gewichtheffen, is een vorm van lichaamsbeweging waarbij weerstand wordt gebruikt om spieren te versterken, de algehele fysieke conditie te verbeteren en vaak ook specifieke fitnessdoelen te bereiken. Deze vorm van training kan variëren van het tillen van halters en dumbbells tot het gebruik van machines met gewichten.';
            training4.Location = 'Gym XYZ';
            training4.Places = 15;
            training4.UserId = currentUsers[4]._id; // Associate user2 with training2
            const newTraining4 = new this.trainingModel(training4);
            await newTraining4.save();
            await this.rcmndService.createOrUpdateTraining(newTraining4)

            const training5 = new Training();
            training5.SessionName = 'Gymnastics';
            training5.Date = new Date('2023-11-19T20:30:00');
            training5.Duration = 1.0;
            training5.Description = 'Gymnastics, of gymnastiek, is een fysieke discipline die zich richt op het uitvoeren van gestileerde oefeningen en bewegingen die vaak vereisen dat het lichaam kracht, flexibiliteit, coördinatie, balans en lenigheid combineert. Gymnastiek kan zowel als sport op zichzelf worden beoefend als een aanvullende training voor andere sporten. '
            training5.Places = 15;
            training5.Location = 'Gym XYZ';
            training5.UserId = currentUsers[4]._id; // Associate user2 with training2
            const newTraining5 = new this.trainingModel(training5);
            await newTraining5.save();
            await this.rcmndService.createOrUpdateTraining(newTraining5)

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
            progress2.UserId = currentUsers[2]._id;
            progress2.TrainingId = currentTrainings[1]._id;
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

            const progress4 = new Progress();
            progress4.Weight = 0;
            progress4.Reps = 16;
            progress4.Duration = 1;
            progress4.Date = new Date();
            progress4.UserId = currentUsers[3]._id;
            progress4.TrainingId = currentTrainings[3]._id;
            const newProgress4 = new this.progressModel(progress4);
            await newProgress4.save();

            const progress5 = new Progress();
            progress5.Weight = 70;
            progress5.Reps = 4;
            progress5.Duration = 0;
            progress5.Date = new Date();
            progress5.UserId = currentUsers[3]._id;
            progress5.TrainingId = currentTrainings[1]._id;
            const newProgress5 = new this.progressModel(progress5);
            await newProgress5.save();

            const enrollment1 = new Enrollment();
            enrollment1.UserId = currentUsers[3]._id;
            enrollment1.TrainingId = currentTrainings[0]._id;
            enrollment1.Level = Level.Beginner;
            const newEnrollment1 = new this.enrollmentModel(enrollment1);
            await newEnrollment1.save();
            await this.rcmndService.createOrUpdateEnrollment(newEnrollment1)

            const enrollment2 = new Enrollment();
            enrollment2.UserId = currentUsers[2]._id;
            enrollment2.TrainingId = currentTrainings[1]._id;
            enrollment2.Level = Level.Experienced;
            const newEnrollment2 = new this.enrollmentModel(enrollment2);
            await newEnrollment2.save();
            await this.rcmndService.createOrUpdateEnrollment(newEnrollment2)

            const enrollment3 = new Enrollment();
            enrollment3.UserId = currentUsers[2]._id;
            enrollment3.TrainingId = currentTrainings[1]._id;
            enrollment3.Level = Level.Beginner;
            const newEnrollment3 = new this.enrollmentModel(enrollment3);
            await newEnrollment3.save();
            await this.rcmndService.createOrUpdateEnrollment(newEnrollment3)

            const enrollment4 = new Enrollment();
            enrollment4.UserId = currentUsers[3]._id;
            enrollment4.TrainingId = currentTrainings[3]._id;
            enrollment4.Level = Level.Experienced;
            const newEnrollment4 = new this.enrollmentModel(enrollment4);
            await newEnrollment4.save();
            await this.rcmndService.createOrUpdateEnrollment(newEnrollment4)

            const enrollment5 = new Enrollment();
            enrollment5.UserId = currentUsers[3]._id;
            enrollment5.TrainingId = currentTrainings[1]._id;
            enrollment5.Level = Level.Experienced;
            const newEnrollment5 = new this.enrollmentModel(enrollment5);
            await newEnrollment5.save();
            await this.rcmndService.createOrUpdateEnrollment(newEnrollment5)

        }

    }

    async generateHashedPassword(plainTextPassword: string | null): Promise<string> {
        if (plainTextPassword === null || plainTextPassword === undefined) {
            throw new Error('Plain text password cannot be null or undefined.');
        }
    
        const saltOrRounds = 10;
        return await bcrypt.hash(plainTextPassword, saltOrRounds);
    }
}