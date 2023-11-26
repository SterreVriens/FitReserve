import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { TrainingService } from './training.service';
import { ITraining } from '@fit-reserve/shared/api';
import { Get} from '@nestjs/common';
import { Public } from '@fit-reserve/decorators';
import { CreateTrainingDto, UpdateTrainingDto} from '@fit-reserve/backend/dto'

@Controller('training')
export class TrainingController {
    constructor(private trainingService: TrainingService){}

    @Get('')
    @Public()
    getAll(): ITraining[]{
        return this.trainingService.getAll();
    }

    @Get(':id')
    @Public()
    getOne(@Param('id') id: string): ITraining {
        return this.trainingService.getOne(id);
    }

    @Post('')
    @Public()
    create(@Body() data: CreateTrainingDto): ITraining {
        return this.trainingService.create(data);
    }

    @Put(':id')
    @Public()
    update(@Body() data: UpdateTrainingDto, @Param('id') id: string):ITraining{
        return this.trainingService.update(data,id)
    }

    @Delete(':id')
    @Public()
    delete(@Param('id')id: string): string{
        return this.trainingService.delete(id)
    }
}
