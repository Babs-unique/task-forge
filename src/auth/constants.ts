import { ConfigService } from "@nestjs/config";
interface jwt {
    secret: string;
}

export const jwtConstants: jwt = {
    secret: 'your-secret-key'
};