import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { LectureSchedulesEntity } from './LectureSchedules.entity';

@Entity('lecture_schedule_users', { schema: 'lecture' })
@Unique(['userId', 'lectureSchedulesId'])
export class LectureScheduleUsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' }) userId: number;

  @Column('int', { name: 'lecture_schedules_id' }) lectureSchedulesId: number;

  @Column('datetime', { name: 'created_at' }) createdAt: Date;

  @ManyToOne(() => LectureSchedulesEntity, (m) => m.userList, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'lecture_schedules_id',
    referencedColumnName: 'id',
  })
  lectureSchedule?: LectureSchedulesEntity;
}
