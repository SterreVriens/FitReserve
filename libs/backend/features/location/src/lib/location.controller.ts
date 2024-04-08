import { Controller } from '@nestjs/common';
import { LocationService } from './location.service';
import { Get} from '@nestjs/common';
import { Location } from './schemas/location.schemas'; 


@Controller('location')
export class LocationController {
    constructor(private locationService: LocationService){}

    @Get('')
    async getAll(): Promise<Location[]> { 
        return this.locationService.getAll();
    }
}
