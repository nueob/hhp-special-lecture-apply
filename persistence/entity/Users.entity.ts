import { Column, Entity, OneToMany } from 'typeorm';
import { LectureEnrollmentRequestLogEntity } from './LectureEnrollmentRequestLog.entity';
import { LectureScheduleUsersEntity } from './LectureScheduleUsers.entity';

@Entity('lecture_schedules', { schema: 'lecture' })
export class UsersEntity {
  @Column('int', {
    primary: true,
    name: 'id',
  })
  id: number;

  @Column('varchar', { name: 'name', length: 45 }) name: string;

  @OneToMany(() => LectureScheduleUsersEntity, (m) => m.user, {
    createForeignKeyConstraints: false,
  })
  lectureScheduleList?: LectureScheduleUsersEntity[];

  @OneToMany(() => LectureEnrollmentRequestLogEntity, (m) => m.user, {
    createForeignKeyConstraints: false,
  })
  lectureEnrollmentRequestLogList?: LectureEnrollmentRequestLogEntity[];
}
