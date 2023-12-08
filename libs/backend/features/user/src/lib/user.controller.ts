/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Delete, NotFoundException, Param, Put, Req } from '@nestjs/common';
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

    @Get(':_id')
    @Public()
    getOne(@Param('_id') _id: string): Promise<User | null> {
        return this.userService.getOne(_id);
    }


    @Put(':id')
        async update(@Body() data: UpdateUserDto, @Param('id') id: string, @Req() req: any): Promise<IUser> {
        return this.userService.update(data, id, req.user.sub);
    }


    @Delete(':_id')
    async delete(@Param('_id') _id: string): Promise<string> {
    try {
        await this.userService.delete(_id);
        return "User deleted sucesfully";
    } catch (error) {
        // Handel de fout af, bijv. retourneer een 404 als de gebruiker niet gevonden is.
        throw new NotFoundException(error);
    }
}
}
