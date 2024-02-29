import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { Authservice } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    
    controllers:[AuthController],
    providers:[Authservice]
})
export class AuthModule {}