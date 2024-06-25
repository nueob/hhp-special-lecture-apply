import { LectureScheduleUsersEntity } from '../../../persistence/entity/LectureScheduleUsers.entity';
import { LectureScheduleUsers } from '../domain/LectureScheduleUsers.domain';
import { LectureEnrollmentRequestLog } from '../domain/LectureEnrollmentRequestLog.domain';
import { LectureEnrollmentRequestLogEntity } from '../../../persistence/entity/LectureEnrollmentRequestLog.entity';
import { LecturesEntity } from '../../../persistence/entity/lectures.entity';
import { Lectures } from '../domain/Lectures.domain';
import { LectureSchedulesEntity } from '../../../persistence/entity/LectureSchedules.entity';
import { LectureSchedules } from '../domain/LectureSchedules.domain';

export class SpecialLectureMapper {
  static mapToLectureScheduleUsersEntity(
    lectureScheduleUsers: LectureScheduleUsers,
  ): LectureScheduleUsersEntity {
    const lectureScheduleUsersEntity = new LectureScheduleUsersEntity();
    lectureScheduleUsersEntity.userId = lectureScheduleUsers.userId;
    lectureScheduleUsersEntity.lectureSchedulesId =
      lectureScheduleUsers.lectureSchedulesId;
    lectureScheduleUsersEntity.createdAt = lectureScheduleUsers.createdAt;

    return lectureScheduleUsersEntity;
  }

  static mapToLectureScheduleUsersDomain(
    lectureScheduleUsers: LectureScheduleUsersEntity,
  ): LectureScheduleUsers {
    return new LectureScheduleUsers(
      lectureScheduleUsers.id,
      lectureScheduleUsers.userId,
      lectureScheduleUsers.lectureSchedulesId,
      lectureScheduleUsers.createdAt,
    );
  }

  static mapToLectureEnrollmentRequestLogEntity(
    domain: LectureEnrollmentRequestLog,
  ): LectureEnrollmentRequestLogEntity {
    const lectureEnrollmentRequestLogEntity =
      new LectureEnrollmentRequestLogEntity();
    lectureEnrollmentRequestLogEntity.userId = domain?.userId;
    lectureEnrollmentRequestLogEntity.lectureSchedulesId =
      domain?.lectureSchedulesId;
    lectureEnrollmentRequestLogEntity.isSuccess = domain?.isSuccess;
    lectureEnrollmentRequestLogEntity.createdAt = domain?.createdAt;

    return lectureEnrollmentRequestLogEntity;
  }

  static mapToLectureEnrollmentRequestLogDomain(
    entity: LectureEnrollmentRequestLogEntity,
  ): LectureEnrollmentRequestLog {
    return new LectureEnrollmentRequestLog(
      entity.id,
      entity.userId,
      entity.lectureSchedulesId,
      entity.isSuccess,
      entity.createdAt,
    );
  }

  static mapToLecturesDomain(entity: LecturesEntity): Lectures {
    return new Lectures(
      entity.id,
      entity.name,
      entity.limitUsersCount,
      entity.createdAt,
      entity.scheduleList.map((schedule) =>
        this.mapToLectureSchedulesDomain(schedule),
      ),
    );
  }

  static mapToLectureSchedulesDomain(
    entity: LectureSchedulesEntity,
  ): LectureSchedules {
    return new LectureSchedules(
      entity.id,
      entity.startAt,
      entity.createdAt,
      entity.userList?.map((user) =>
        this.mapToLectureScheduleUsersDomain(user),
      ),
    );
  }
}
