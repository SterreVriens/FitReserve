import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Progress } from './schemas/progres.schema';
import { ProgressService } from './progress.service';
import { Public } from '@fit-reserve/decorators';
import { IProgress } from '@fit-reserve/shared/api';
import { CreateProgressDto } from '@fit-reserve/backend/dto';

@Controller('progress')
export class ProgressController {

    constructor(
        private progressService: ProgressService
    ){}

    @Get('')
    @Public()
    getAll(): Promise<Progress[]> {
        return this.progressService.getAll();
    }

    @Get('user/:id')
    @Public()
    getAllForUser(@Param('id') id: string): Promise<Progress[]> {
        return this.progressService.getAllFromUser(id);
    }

    @Get(':id')
    @Public()
    getOne(@Param('id') id: string): Promise<IProgress | null> {
        return this.progressService.getOne(id);
    }

    @Post('')
    async create(@Body() data: CreateProgressDto): Promise<Progress> {
        return this.progressService.create(data);
    }

    @Get('check/:trainingId/:userId') 
    @Public()
    async checkOne(@Param('trainingId') trainingId: string, @Param('userId') userId: string): Promise<IProgress | null> {
        return this.progressService.checkOne(trainingId, userId);
    }

    @Delete('training/:id')
    deleteByTraining(@Param('id')id: string): Promise<string>{
        return this.progressService.deleteProgressByTrainingId(id)
    }
}
