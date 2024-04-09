import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './schemas/enrollment.schemas';
import { Public } from '@fit-reserve/decorators';
import { IEnrollment } from '@fit-reserve/shared/api';
import { CreateEnrollmentDto } from '@fit-reserve/backend/dto';

@Controller('enrollment')
export class EnrollmentController {

    constructor(
        private enrollmentService: EnrollmentService
    ){}

    @Get('')
    @Public()
    getAll():Promise<Enrollment[]>{
        return this.enrollmentService.getAll();
    }


    @Get(':id')
    @Public()
    getOne(@Param('id') id: string):Promise<IEnrollment | null>{
        return this.enrollmentService.getOne(id);
    }
    
    @Get('user/:id')
    @Public()
    getAllFromUser(@Param('id') id: string):Promise<IEnrollment[]>{
        return this.enrollmentService.getAllFromUser(id);
    }
    @Get('training/:id')
    @Public()
    getAllFromTraining(@Param('id') id: string):Promise<Enrollment[]>{
        return this.enrollmentService.getAllFromTraining(id);
    }
    @Get(':trainingId/:userId')
    @Public()
    checkIfEnrolled(@Param('trainingId') trainingId: string, @Param('userId') userId: string): Promise<IEnrollment|null> {
        return this.enrollmentService.checkIfEnrollmentExists(trainingId, userId);
    }

    

    @Post('')
    async create(@Body() data: CreateEnrollmentDto): Promise<Enrollment|null> {

        
      return this.enrollmentService.create(data);
    }

    @Delete(':id')
    delete(@Param('id')id: string): Promise<string>{
        return this.enrollmentService.delete(id)
    }

    @Delete('training/:id')
    deleteByTraining(@Param('id')id: string): Promise<string>{
        return this.enrollmentService.deleteEnrollmentsByTrainingId(id)
    }
}
