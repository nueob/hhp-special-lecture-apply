import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LectureEnrollmentRequestLogEntity } from './LectureEnrollmentRequestLog.entity';
import { LectureScheduleUsersEntity } from './LectureScheduleUsers.entity';
import { LecturesEntity } from './lectures.entity';

@Entity('lecture_schedules', { schema: 'lecture' })
export class LectureSchedulesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'lectures_id' }) lecturesId: number;

  @Column('datetime', { name: 'start_at' }) startAt: Date;

  @Column('datetime', { name: 'created_at' }) createdAt: Date;

  @ManyToOne(() => LecturesEntity, (m) => m.scheduleList, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'lectures_id',
    referencedColumnName: 'id',
  })
  lecture?: LecturesEntity;

  @OneToMany(() => LectureScheduleUsersEntity, (m) => m.lectureSchedule, {
    createForeignKeyConstraints: false,
  })
  userList?: LectureScheduleUsersEntity[];

  @OneToMany(
    () => LectureEnrollmentRequestLogEntity,
    (m) => m.lectureSchedule,
    {
      createForeignKeyConstraints: false,
    },
  )
  lectureEnrollmentRequestLogList?: LectureEnrollmentRequestLogEntity[];
}
