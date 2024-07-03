import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Basic, BasicSchema } from './basic.schema';
import { ConfigModule } from '@nestjs/config';
import { UuidModule } from 'nestjs-uuid';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot("mongodb://localhost:27017"),
    MongooseModule.forFeature([{ name: Basic.name, schema: BasicSchema }]),
    UuidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
