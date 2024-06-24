import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturesEntity } from './lectures.entity';
import { LectureSchedulesEntity } from './LectureSchedules.entity';
import { LectureEnrollmentRequestLogEntity } from './LectureEnrollmentRequestLog.entity';
import { LectureScheduleUsersEntity } from './LectureScheduleUsers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LecturesEntity,
      LectureSchedulesEntity,
      LectureScheduleUsersEntity,
      LectureEnrollmentRequestLogEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntityModule {}
