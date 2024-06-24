import { LectureEnrollmentRequestLog } from 'src/special_lecture/domain/LectureEnrollmentRequestLog.domain';
import { LectureScheduleUsers } from 'src/special_lecture/domain/LectureScheduleUsers.domain';
import { Lectures } from 'src/special_lecture/domain/Lectures.domain';

export abstract class SpecialLectureRepositoryPort {
  abstract applyLecture(
    lectureScheduleUsers: LectureScheduleUsers,
  ): Promise<LectureScheduleUsers>;
  abstract createHistory(
    lectureEnrollmentRequestLog: LectureEnrollmentRequestLog,
  ): Promise<LectureEnrollmentRequestLog>;
  abstract checkEnrolledLectureExistence(
    userId: number,
    lectureScheduleId: number,
  ): Promise<boolean>;
  abstract findAllLectures(): Promise<Lectures[]>;
  abstract findLecture(lectureSchedulesId: number): Promise<Lectures>;
}
