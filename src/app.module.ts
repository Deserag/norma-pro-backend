import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthModule,
} from './modules';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user';
import { ClientModule } from './modules/client';
import { PrismaModule } from './modules/prisma';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ClientModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}