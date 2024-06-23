import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpecialLectureModule } from './special_lecture/specialLecture.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureScheduleUsersEntity } from '../persistence/entity/LectureScheduleUsers.entity';
import { LecturesEntity } from '../persistence/entity/lectures.entity';
import { LectureEnrollmentRequestLogEntity } from '../persistence/entity/LectureEnrollmentRequestLog.entity';
import { LectureSchedulesEntity } from '../persistence/entity/LectureSchedules.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: '123',
      database: 'lecture',
      entities: [
        LecturesEntity,
        LectureSchedulesEntity,
        LectureScheduleUsersEntity,
        LectureEnrollmentRequestLogEntity,
      ],
      synchronize: true,
    }),
    SpecialLectureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
