import {
    
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

import {
    ICreateTraining,
    IUpdateTraining
} from '@fit-reserve/shared/api';


export class CreateTrainingDto implements ICreateTraining {
    @IsString()
    @IsNotEmpty()
    SessionName!: string;
  
    @IsString()
    @IsNotEmpty()
    Description!: string;
  
    @IsNotEmpty()
    Date!: Date;

    @IsNumber()
    @IsNotEmpty()
    Duration!: number;
  
    @IsString()
    @IsNotEmpty()
    Location!: string;
  
    @IsNumber()
    @IsNotEmpty()
    Places!: number;
  
    @IsNotEmpty()
    UserId!: string; 
}
export class UpdateTrainingDto implements IUpdateTraining {
    @IsString()
    @IsNotEmpty()
    SessionName!: string ;

    @IsString()
    @IsNotEmpty()
    Description!: string;
}


