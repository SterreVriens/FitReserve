import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Get} from '@nestjs/common';
import { IUser } from '@fit-reserve/shared/api';
import { CreateUserDto, UpdateUserDto} from '@fit-reserve/backend/dto'


@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get('')
    getAll(): IUser[]{
        return this.userService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): IUser {
        return this.userService.getOne(id);
    }

    @Post('')
    create(@Body() data: CreateUserDto): IUser {
        return this.userService.create(data);
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
