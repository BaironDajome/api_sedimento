import { IsEmail, IsString, MinLength} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto{
    
    @ApiProperty()
    @IsEmail()
    email:string;

    @ApiProperty()
    @Transform(({value}) =>value.trim())
    @IsString()
    @MinLength(6)
    password:string;

    @ApiProperty()
    @Transform(({value}) =>value.trim())
    @IsString()
    @MinLength(3)
    name:string;
}