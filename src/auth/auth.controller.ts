import { Body, Controller, Post, Req } from "@nestjs/common";
import { Authservice } from "./auth.service";
import { AuthDTO } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService:Authservice){}

    @Post('signin')
    signin(@Body() dto:AuthDTO){

        return this.authService.signin(dto)
    }

    @Post('signup')
    signup(@Body() dto:AuthDTO){
       return this.authService.signup(dto)
    }

}