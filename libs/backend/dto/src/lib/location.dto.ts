import { IsString, IsNotEmpty } from "class-validator";

export class createLocationDto {
    @IsString()
    @IsNotEmpty()
    Name!: string;

    @IsString()
    @IsNotEmpty()
    Description!: string;

    @IsString()
    @IsNotEmpty()
    Address!: string;

    @IsString()
    @IsNotEmpty()
    City!: string;

    @IsString()
    @IsNotEmpty()
    Country!: string;

}