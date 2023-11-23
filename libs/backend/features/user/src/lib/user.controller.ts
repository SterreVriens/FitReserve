import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Get} from '@nestjs/common';
import { IUser } from '@fit-reserve/shared/api';
import { UpdateUserDto} from '@fit-reserve/backend/dto'
import { User } from './schemas/user.schema';
import { Public } from './decorators/public.decorater';


@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get('')
    @Public()
    getAll():Promise<User[]>{
        return this.userService.getAll();
    }

    @Get(':username')
    @Public()
    getOne(@Param('username') username: string): Promise<User | null> {
        return this.userService.getOne(username);
    }


    @Put(':id')
    update(@Body() data: UpdateUserDto, @Param('id') id: string):IUser{
        return this.userService.update(data,id)
    }

    @Delete(':id')
    delete(@Param('id')id: string): string{
        return this.userService.delete(id)
    }
}
