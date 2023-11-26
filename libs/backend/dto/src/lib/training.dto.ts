import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

import {
    ICreateTraining,
    IUpdateTraining,
    Id,
} from '@fit-reserve/shared/api';

export class CreateTrainingDto implements ICreateTraining {

    id!: Id;
    @IsString()
    @IsNotEmpty()
    SessionName!: string;
    @IsString()
    @IsNotEmpty()
    Description!: string;
    @IsNotEmpty()
    Date!: Date;

}
export class UpdateTrainingDto implements IUpdateTraining {
    @IsString()
    @IsNotEmpty()
    SessionName!: string ;

    @IsString()
    @IsNotEmpty()
    Description!: string;
}


