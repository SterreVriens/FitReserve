import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { TrainingService } from './training.service';
import { ITraining } from '@fit-reserve/shared/api';
import { Get} from '@nestjs/common';
import { Public } from '@fit-reserve/decorators';
import { CreateTrainingDto, UpdateTrainingDto} from '@fit-reserve/backend/dto'
import { Training } from './schemas/training.schema';

@Controller('training')
export class TrainingController {
    constructor(private trainingService: TrainingService){}

    @Get('')
    @Public()
    getAll():Promise<Training[]>{
        return this.trainingService.getAll();
    }

    @Get(':id')
    @Public()
    getOne(@Param('id') id: string): Promise<Training | null> {
        return this.trainingService.getOne(id);
    }
    @Post('')
    @Public()
    async create(@Body() data: CreateTrainingDto): Promise<ITraining> {
      // Assuming you have some way of getting the username (e.g., from the request)
      const username = 'username'; // Replace with your actual username retrieval logic
      return this.trainingService.create(data, username);
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
