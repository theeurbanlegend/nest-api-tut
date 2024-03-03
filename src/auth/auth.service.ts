import { ForbiddenException, Injectable } from '@nestjs/common';
import {PrismaService} from '../../src/prisma/prisma.service'
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Authservice {
  constructor(private prisma: PrismaService, private jwt:JwtService, private config:ConfigService) {}

  async signup(dto: AuthDTO) {
    try {
      const hashedPass = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPass,
        },
      });
      return this.signToken(user.id, user.email)
    } catch (err) {
        if(err instanceof PrismaClientKnownRequestError){
            if (err.code==="P2002"){
                throw new ForbiddenException("Credentials Taken!")
            }
        }
    }
  }

  async signin(dto: AuthDTO) {
    const user = await this.prisma.user.findUnique({
        where:{
            email:dto.email
        }
    })
    if(!user) throw new ForbiddenException("Incorrect Credentials!")

    const pwMatches=await argon.verify(user.hashedPass, dto.password)
    if(!pwMatches) throw new ForbiddenException("Incorrect Credentials!")
    return this.signToken(user.id, user.email)
  }

  async signToken(userId:number, email:string){
    const data={
        sub:userId, email
    }

    
    const token= await this.jwt.signAsync(data, {expiresIn:'15m', secret:this.config.get('JWT_SECRET')})
    return {access_token:token}
  }
}
