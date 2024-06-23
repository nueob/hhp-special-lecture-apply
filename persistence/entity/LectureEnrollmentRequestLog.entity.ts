import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LectureSchedulesEntity } from './LectureSchedules.entity';

@Entity('lecture_enrollment_request_log', { schema: 'lecture' })
export class LectureEnrollmentRequestLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' }) userId: number;

  @Column('int', { name: 'lecture_schedules_id' }) lectureSchedulesId: number;

  @Column('int', { name: 'is_success' }) isSuccess: boolean;

  @Column('datetime', { name: 'created_at' }) createdAt: Date;

  @ManyToOne(
    () => LectureSchedulesEntity,
    (m) => m.lectureEnrollmentRequestLogList,
    {
      createForeignKeyConstraints: false,
    },
  )
  @JoinColumn({
    name: 'lecture_schedules_id',
    referencedColumnName: 'id',
  })
  lectureSchedule?: LectureSchedulesEntity;
}
