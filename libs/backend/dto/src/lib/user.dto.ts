
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';
import {
    ICreateUser,
    IUpdateUser,
    Id,
    Role,
    
} from '@fit-reserve/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateUserDto implements ICreateUser {
    @IsString()
    @IsNotEmpty()
    _id!: Id ;

    @IsString()
    @IsNotEmpty()
    UserName!: string;

    @IsString()
    @IsNotEmpty()
    Password!: string;

    @IsString()
    @IsNotEmpty()
    Role!: Role;
}

export class UpdateUserDto implements IUpdateUser {

    @IsString()
    @IsNotEmpty()
    UserName!: string;


}
