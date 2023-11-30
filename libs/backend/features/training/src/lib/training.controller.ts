import { Body, Controller, Param, Post, } from '@nestjs/common';
import { TrainingService } from './training.service';
//import { ITraining } from '@fit-reserve/shared/api';
import { Get} from '@nestjs/common';
import { Public } from '@fit-reserve/decorators';
import { CreateTrainingDto} from '@fit-reserve/backend/dto'
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
    async create(@Body() data: CreateTrainingDto, userId: string): Promise<Training> {
    
      return this.trainingService.create(data, userId);
    }

    // @Put(':id')
    // @Public()
    // update(@Body() data: UpdateTrainingDto, @Param('id') id: string):ITraining{
    //     return this.trainingService.update(data,id)
    // }

    // @Delete(':id')
    // @Public()
    // delete(@Param('id')id: string): string{
    //     return this.trainingService.delete(id)
    // }
}
