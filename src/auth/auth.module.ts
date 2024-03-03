import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { Authservice } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strtegy";
@Module({
    imports:[JwtModule.register({})],
    controllers:[AuthController],
    providers:[Authservice, JwtStrategy]
})
export class AuthModule {}