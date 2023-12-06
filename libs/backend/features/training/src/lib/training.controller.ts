import { Body, Controller, Delete, Param, Post, Put, } from '@nestjs/common';
import { TrainingService } from './training.service';
//import { ITraining } from '@fit-reserve/shared/api';
import { Get} from '@nestjs/common';
import { Public } from '@fit-reserve/decorators';
import { CreateTrainingDto, UpdateTrainingDto} from '@fit-reserve/backend/dto'
import { Training } from './schemas/training.schema';
import { ITraining } from '@fit-reserve/shared/api';

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
    @Get('/full/:id')
    @Public()
    getOneWithUser(@Param('id') id: string): Promise<ITraining | null> {
        return this.trainingService.getOneWithUser(id);
    }
    @Post('')
    @Public()
    async create(@Body() data: CreateTrainingDto): Promise<ITraining> {
      console.log("Training create - create controller");
        
      return this.trainingService.create(data);
    }

    @Put(':id')
    @Public()
    async update(@Body() data: UpdateTrainingDto, @Param('id') id: string): Promise<Training> {
    return this.trainingService.update(data, id);
    }


    @Delete(':id')
    @Public()
    delete(@Param('id')id: string): Promise<string>{
        return this.trainingService.delete(id)
    }
}
