import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpecialLectureModule } from './special_lecture/special_lecture.module';

@Module({
  imports: [SpecialLectureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
