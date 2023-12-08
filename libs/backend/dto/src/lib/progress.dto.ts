import { ICreateProgress, Id } from "@fit-reserve/shared/api";
import {  IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProgressDto implements ICreateProgress {
    _id!: Id;
  
    @IsString()
    @IsNotEmpty()
    TrainingId!: string;
  
    @IsString()
    @IsNotEmpty()
    UserId!: string;
  
    @IsNumber()
    @IsNotEmpty()
    Weight!: number;

    @IsNumber()
    @IsNotEmpty()
    Reps!: number;

    @IsNumber()
    @IsNotEmpty()
    Duration!: number;

    
  }
  