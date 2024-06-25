import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SpecialLectureRepositoryPort } from '../service/port/SpecialLecture.repository.port';
import { Lectures } from '../domain/Lectures.domain';
import { LectureScheduleUsers } from '../domain/LectureScheduleUsers.domain';
import { LectureEnrollmentRequestLog } from '../domain/LectureEnrollmentRequestLog.domain';
import { LecturesEntity } from '../../../persistence/entity/lectures.entity';
import { LectureScheduleUsersEntity } from '../../../persistence/entity/LectureScheduleUsers.entity';
import { LectureEnrollmentRequestLogEntity } from '../../../persistence/entity/LectureEnrollmentRequestLog.entity';
import { SpecialLectureMapper } from '../mapper/SpecialLecture.mapper';

@Injectable()
export class SpecialLectureRepositoryAdapter
  implements SpecialLectureRepositoryPort
{
  constructor(
    @InjectRepository(LecturesEntity)
    private readonly lecturesRepository: Repository<LecturesEntity>,
    @InjectRepository(LectureScheduleUsersEntity)
    private readonly lectureScheduleUsersRepository: Repository<LectureScheduleUsersEntity>,
    @InjectRepository(LectureEnrollmentRequestLogEntity)
    private readonly lectureEnrollmentRequestLogRepository: Repository<LectureEnrollmentRequestLogEntity>,
  ) {}

  async applyLecture(
    lectureScheduleUsers: LectureScheduleUsers,
  ): Promise<LectureScheduleUsers> {
    const lectureScheduleUsersEntity =
      this.lectureScheduleUsersRepository.create(
        SpecialLectureMapper.mapToLectureScheduleUsersEntity(
          lectureScheduleUsers,
        ),
      );

    return SpecialLectureMapper.mapToLectureScheduleUsersDomain(
      await this.lectureScheduleUsersRepository.save(
        lectureScheduleUsersEntity,
      ),
    );
  }

  async createHistory(
    lectureEnrollmentRequestLog: LectureEnrollmentRequestLog,
  ): Promise<LectureEnrollmentRequestLog> {
    const lectureEnrollmentRequestLogEntity =
      this.lectureEnrollmentRequestLogRepository.create(
        SpecialLectureMapper.mapToLectureEnrollmentRequestLogEntity(
          lectureEnrollmentRequestLog,
        ),
      );

    return SpecialLectureMapper.mapToLectureEnrollmentRequestLogDomain(
      await this.lectureEnrollmentRequestLogRepository.save(
        lectureEnrollmentRequestLogEntity,
      ),
    );
  }

  checkEnrolledLectureExistence(
    userId: number,
    lectureScheduleId: number,
  ): Promise<boolean> {
    return this.lectureScheduleUsersRepository.exists({
      where: { userId, lectureSchedulesId: lectureScheduleId },
    });
  }

  async findAllLectures(): Promise<Lectures[]> {
    const lectures = await this.lecturesRepository.find({
      relations: { scheduleList: true },
    });

    return lectures.map((lecture) =>
      SpecialLectureMapper.mapToLecturesDomain(lecture),
    );
  }

  async findLecture(lectureSchedulesId: number): Promise<Lectures> {
    return SpecialLectureMapper.mapToLecturesDomain(
      await this.lecturesRepository.findOne({
        relations: { scheduleList: { userList: true } },
        where: { scheduleList: { id: lectureSchedulesId } },
      }),
    );
  }
}
