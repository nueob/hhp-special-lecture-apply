import { LectureScheduleUsers } from 'src/special_lecture/domain/LectureScheduleUsers.domain';
import { Lectures } from '../../../../domain/Lectures.domain';
import { SpecialLectureRepositoryPort } from '../../../../service/port/SpecialLecture.repository.port';
import { LectureEnrollmentRequestLog } from 'src/special_lecture/domain/LectureEnrollmentRequestLog.domain';

export class StubSpecialLectureRepository
  implements SpecialLectureRepositoryPort
{
  private readonly _lectures: Lectures;
  private readonly _isEnrollmentSuccessful: boolean;

  constructor(lectures: Lectures, isEnrollmentSuccessful: boolean) {
    this._lectures = lectures;
    this._isEnrollmentSuccessful = isEnrollmentSuccessful;
  }

  applyLecture(
    lectureScheduleUsers: LectureScheduleUsers,
  ): Promise<LectureScheduleUsers> {
    return Promise.resolve(lectureScheduleUsers);
  }

  createHistory(
    lectureEnrollmentRequestLog: LectureEnrollmentRequestLog,
  ): Promise<LectureEnrollmentRequestLog> {
    return Promise.resolve(lectureEnrollmentRequestLog);
  }

  checkEnrolledLectureExistence(): Promise<boolean> {
    return Promise.resolve(this._isEnrollmentSuccessful);
  }

  findAllLectures(): Promise<Lectures[]> {
    return Promise.resolve([this._lectures]);
  }

  findLecture(lectureSchedulesId: number): Promise<Lectures> {
    return Promise.resolve(this._lectures);
  }
}
