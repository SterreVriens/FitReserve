import { Body, Controller, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { Get} from '@nestjs/common';
import { Location } from './schemas/location.schemas'; 
import { Trainer } from './schemas/roles.decorator';
import { ICreateLocation } from '@fit-reserve/shared/api';


@Controller('location')
export class LocationController {
    constructor(private locationService: LocationService){}

    @Trainer()
    @Get('')
    async getAll(): Promise<Location[]> { 
        return this.locationService.getAll();
    }

    
    @Post('')
    async create(@Body() data: ICreateLocation): Promise<Location|null> {
        return this.locationService.create(data);
    }
}
