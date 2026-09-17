import { IsString, IsNotEmpty} from 'class-validator';

export class projectDtos {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}