import { IsString, IsEmail, MinLength } from 'class-validator';

export class userDtos {
    @IsString()
    name?: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}

export class loginDtos {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}