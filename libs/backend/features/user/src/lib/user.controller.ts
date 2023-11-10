import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Get} from '@nestjs/common';
import { IUser } from '@fit-reserve/shared/api';


@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get('')
    getAll(): IUser[]{
        return this.userService.getAll();
    }
}
