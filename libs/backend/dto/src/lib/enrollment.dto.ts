import {
    IsNotEmpty,
    IsString,
    IsEnum,
  } from 'class-validator';
  
  import {
    ICreateEnrollment,
    Id,
    Level,
  } from '@fit-reserve/shared/api';
  
  export class CreateEnrollmentDto implements ICreateEnrollment {
    _id!: Id;
  
    @IsString()
    @IsNotEmpty()
    TrainingId!: string;
  
    @IsString()
    @IsNotEmpty()
    UserId!: string;
  
    @IsEnum(Level)
    @IsNotEmpty()
    Level!: Level;
  }
  

  