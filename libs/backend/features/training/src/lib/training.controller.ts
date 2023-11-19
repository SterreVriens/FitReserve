import { Controller, Param } from '@nestjs/common';
import { TrainingService } from './training.service';
import { ITraining } from '@fit-reserve/shared/api';
import { Get} from '@nestjs/common';

@Controller('training')
export class TrainingController {
    constructor(private trainingService: TrainingService){}

    @Get('')
    getAll(): ITraining[]{
        return this.trainingService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): ITraining {
        return this.trainingService.getOne(id);
    }
}
