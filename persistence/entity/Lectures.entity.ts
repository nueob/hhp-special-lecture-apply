import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LectureSchedulesEntity } from './LectureSchedules.entity';

@Entity('lectures', { schema: 'lecture' })
export class LecturesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name', length: 255 }) name: string;

  @Column('int', { name: 'limit_users_count' }) limitUsersCount: number;

  @Column('datetime', { name: 'created_at' }) createdAt: Date;

  @OneToMany(() => LectureSchedulesEntity, (m) => m.lecture, {
    createForeignKeyConstraints: false,
  })
  scheduleList?: LectureSchedulesEntity[];
}
