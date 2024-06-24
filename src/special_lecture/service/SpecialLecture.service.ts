import { Injectable } from '@nestjs/common';
import { SpecialLectureRepositoryPort } from './port/SpecialLecture.repository.port';
import { Lectures } from '../domain/Lectures.domain';
import { SpecialLectureErrorCodeEnum } from '../enum/SpecialLectureErrorCode.enum';
import { LectureEnrollmentRequestLog } from '../domain/LectureEnrollmentRequestLog.domain';
import { LectureScheduleUsers } from '../domain/LectureScheduleUsers.domain';

@Injectable()
export class SpecialLectureService {
  constructor(
    private readonly specialLectureRepositoryPort: SpecialLectureRepositoryPort,
  ) {}

  findAllLectures(): Promise<Lectures[]> {
    return this.specialLectureRepositoryPort.findAllLectures();
  }

  isEnrollmentSuccessful(
    userId: number,
    lectureScheduleId: number,
  ): Promise<boolean> {
    return this.specialLectureRepositoryPort.checkEnrolledLectureExistence(
      userId,
      lectureScheduleId,
    );
  }

  /**
   * 1. 특강이 존재하는 지 확인한다
   *  1-1. 없는 특강일 경우 error
   *
   * 2. 이미 수강 신청된 강의 인지 확인한다.
   *  2-1. 수강신청된 강의일 경우 error
   *
   * 3. 특강의 시작날짜가 지났는 지 체크한다.
   *  3-1. 시작날짜가 지났을 경우 error
   *  3-2. 실패 히스토리를 남긴다.
   *
   * 4. 강의의 수용가능한 인원을 파악한다.
   *  4-1. 이미 꽉찬 강의라면 error
   *  4-2. 실패 히스토리를 남긴다.
   *
   * 5. 수강 신청 + 수강 신청 히스토리를 남긴다.
   */
  async applySpecialLecture(
    userId: number,
    lectureScheduleId: number,
  ): Promise<boolean> {
    const lectures =
      await this.specialLectureRepositoryPort.findLecture(lectureScheduleId);
    if (!lectures) {
      throw new Error(SpecialLectureErrorCodeEnum.NO_EXIST_LECTURES.message);
    }
    if (lectures.isEnrollmentUser(userId)) {
      throw new Error(
        SpecialLectureErrorCodeEnum.DUPLICATE_ENROLLMENT_ERROR.message,
      );
    }
    if (lectures.isLectureStarted(lectureScheduleId)) {
      this.specialLectureRepositoryPort.createHistory(
        new LectureEnrollmentRequestLog(
          null,
          userId,
          lectureScheduleId,
          false,
          new Date(),
        ),
      );

      throw new Error(
        SpecialLectureErrorCodeEnum.LECTURE_START_TIME_PAST_ERROR.message,
      );
    }
    if (lectures.isCapacityFull()) {
      this.specialLectureRepositoryPort.createHistory(
        new LectureEnrollmentRequestLog(
          null,
          userId,
          lectureScheduleId,
          false,
          new Date(),
        ),
      );

      throw new Error(
        SpecialLectureErrorCodeEnum.EXCEEDS_MAXIMUM_APPLY_ERROR.message,
      );
    }

    await Promise.all([
      this.specialLectureRepositoryPort.applyLecture(
        new LectureScheduleUsers(null, userId, lectureScheduleId, new Date()),
      ),
      this.specialLectureRepositoryPort.createHistory(
        new LectureEnrollmentRequestLog(
          null,
          userId,
          lectureScheduleId,
          true,
          new Date(),
        ),
      ),
    ]);

    return Promise.resolve(true);
  }
}
