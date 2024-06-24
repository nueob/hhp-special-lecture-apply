import { Lectures } from '../../../domain/Lectures.domain';
import { SpecialLectureService } from '../../../service/SpecialLecture.service';
import { SpecialLectureRepositoryPort } from '../../../service/port/SpecialLecture.repository.port';
import { LectureSchedules } from '../../../domain/LectureSchedules.domain';
import { StubSpecialLectureRepository } from './stub/StubSpecialLecture.repository.stub';
import { SpecialLectureErrorCodeEnum } from '../../../enum/SpecialLectureErrorCode.enum';

describe('SpecialLectureService', () => {
  let specialLectureService: SpecialLectureService;
  let specialLectureRepositoryPort: SpecialLectureRepositoryPort;

  describe('findAll: 모든 특강 목록을 반환합니다.', () => {
    test('저장된 특강 목록을 반환합니다.', async () => {
      //given
      const mockLecture = {
        id: 1,
        name: '가짜 특강',
        limitUsersCount: 20,
        createdAt: new Date(),
        scheduleList: [
          {
            id: 1,
            startAt: new Date('2024-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 2,
            startAt: new Date('2025-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 3,
            startAt: new Date('2026-06-24 13:00:00'),
            createdAt: new Date(),
          },
        ],
      };
      const mockLectureDomain = new Lectures(
        mockLecture.id,
        mockLecture.name,
        mockLecture.limitUsersCount,
        mockLecture.createdAt,
        mockLecture.scheduleList.map(
          (schedule) =>
            new LectureSchedules(
              schedule.id,
              schedule.startAt,
              schedule.createdAt,
              null,
            ),
        ),
      );
      specialLectureRepositoryPort = new StubSpecialLectureRepository(
        mockLectureDomain,
        null,
      );
      specialLectureService = new SpecialLectureService(
        specialLectureRepositoryPort,
      );
      //when
      const response = await specialLectureService.findAllLectures();
      //then
      expect(response).toStrictEqual([mockLectureDomain]);
    });
  });

  describe('isEnrollmentSuccessful: 특강 신청 완료 여부를 반환합니다.', () => {
    test('특강이 신청되었을 경우 true 반환', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;
      specialLectureRepositoryPort = new StubSpecialLectureRepository(
        null,
        true,
      );
      specialLectureService = new SpecialLectureService(
        specialLectureRepositoryPort,
      );
      //when
      const response = await specialLectureService.isEnrollmentSuccessful(
        userId,
        lectureScheduleId,
      );
      //then
      expect(response).toBeTruthy();
    });
    test('신청된 특강이 아닐 경우 false 반환', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;
      specialLectureRepositoryPort = new StubSpecialLectureRepository(
        null,
        false,
      );
      specialLectureService = new SpecialLectureService(
        specialLectureRepositoryPort,
      );
      //when
      const response = await specialLectureService.isEnrollmentSuccessful(
        userId,
        lectureScheduleId,
      );
      //then
      expect(response).toBeFalsy();
    });
  });

  describe('applySpecialLecture : 특강을 신청합니다', () => {
    test('정상 요청', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;

      const mockLecture = {
        id: 1,
        name: '가짜 특강',
        limitUsersCount: 20,
        createdAt: new Date(),
        scheduleList: [
          {
            id: lectureScheduleId,
            startAt: new Date('2024-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 2,
            startAt: new Date('2025-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 3,
            startAt: new Date('2026-06-24 13:00:00'),
            createdAt: new Date(),
          },
        ],
      };
      const mockLectureDomain = new Lectures(
        mockLecture.id,
        mockLecture.name,
        mockLecture.limitUsersCount,
        mockLecture.createdAt,
        mockLecture.scheduleList.map(
          (schedule) =>
            new LectureSchedules(
              schedule.id,
              schedule.startAt,
              schedule.createdAt,
              null,
            ),
        ),
      );
      mockLectureDomain.isEnrollmentUser = jest.fn(() => false);
      mockLectureDomain.isLectureStarted = jest.fn(() => false);
      mockLectureDomain.isCapacityFull = jest.fn(() => false);
      specialLectureRepositoryPort = new StubSpecialLectureRepository(
        mockLectureDomain,
        null,
      );

      specialLectureRepositoryPort.applyLecture = jest.fn();
      specialLectureRepositoryPort.createHistory = jest.fn();
      specialLectureService = new SpecialLectureService(
        specialLectureRepositoryPort,
      );
      //when
      const response = await specialLectureService.applySpecialLecture(
        userId,
        lectureScheduleId,
      );
      //then
      expect(response).toBeTruthy();
      expect(specialLectureRepositoryPort.applyLecture).toHaveBeenCalled();
      expect(specialLectureRepositoryPort.createHistory).toHaveBeenCalled();
    });
    test('존재하지 않은 강의 일 경우 error', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;

      specialLectureRepositoryPort = new StubSpecialLectureRepository(
        null,
        null,
      );

      specialLectureService = new SpecialLectureService(
        specialLectureRepositoryPort,
      );
      //when
      //then
      await expect(
        specialLectureService.applySpecialLecture(userId, lectureScheduleId),
      ).rejects.toThrow(
        new Error(SpecialLectureErrorCodeEnum.NO_EXIST_LECTURES.message),
      );
    });
    test('이미 등록한 강의 일 경우 error', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;

      const mockLecture = {
        id: 1,
        name: '가짜 특강',
        limitUsersCount: 20,
        createdAt: new Date(),
        scheduleList: [
          {
            id: lectureScheduleId,
            startAt: new Date('2024-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 2,
            startAt: new Date('2025-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 3,
            startAt: new Date('2026-06-24 13:00:00'),
            createdAt: new Date(),
          },
        ],
      };
      const mockLectureDomain = new Lectures(
        mockLecture.id,
        mockLecture.name,
        mockLecture.limitUsersCount,
        mockLecture.createdAt,
        mockLecture.scheduleList.map(
          (schedule) =>
            new LectureSchedules(
              schedule.id,
              schedule.startAt,
              schedule.createdAt,
              null,
            ),
        ),
      );
      mockLectureDomain.isEnrollmentUser = jest.fn(() => true);
      specialLectureRepositoryPort = new StubSpecialLectureRepository(
        mockLectureDomain,
        null,
      );

      specialLectureService = new SpecialLectureService(
        specialLectureRepositoryPort,
      );
      //when
      //then
      await expect(
        specialLectureService.applySpecialLecture(userId, lectureScheduleId),
      ).rejects.toThrow(
        new Error(
          SpecialLectureErrorCodeEnum.DUPLICATE_ENROLLMENT_ERROR.message,
        ),
      );
    });
    test('특강 시작 날짜가 지났을 경우 error', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;

      const mockLecture = {
        id: 1,
        name: '가짜 특강',
        limitUsersCount: 20,
        createdAt: new Date(),
        scheduleList: [
          {
            id: lectureScheduleId,
            startAt: new Date('2024-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 2,
            startAt: new Date('2025-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 3,
            startAt: new Date('2026-06-24 13:00:00'),
            createdAt: new Date(),
          },
        ],
      };
      const mockLectureDomain = new Lectures(
        mockLecture.id,
        mockLecture.name,
        mockLecture.limitUsersCount,
        mockLecture.createdAt,
        mockLecture.scheduleList.map(
          (schedule) =>
            new LectureSchedules(
              schedule.id,
              schedule.startAt,
              schedule.createdAt,
              null,
            ),
        ),
      );
      mockLectureDomain.isEnrollmentUser = jest.fn(() => false);
      mockLectureDomain.isLectureStarted = jest.fn(() => true);
      specialLectureRepositoryPort = new StubSpecialLectureRepository(
        mockLectureDomain,
        null,
      );
      specialLectureRepositoryPort.createHistory = jest.fn();

      specialLectureService = new SpecialLectureService(
        specialLectureRepositoryPort,
      );
      //when
      //then
      await expect(
        specialLectureService.applySpecialLecture(userId, lectureScheduleId),
      ).rejects.toThrow(
        new Error(
          SpecialLectureErrorCodeEnum.LECTURE_START_TIME_PAST_ERROR.message,
        ),
      );
      expect(specialLectureRepositoryPort.createHistory).toHaveBeenCalled();
    });
    test('수용 가능 인원을 초과할 경우 error', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;

      const mockLecture = {
        id: 1,
        name: '가짜 특강',
        limitUsersCount: 20,
        createdAt: new Date(),
        scheduleList: [
          {
            id: lectureScheduleId,
            startAt: new Date('2024-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 2,
            startAt: new Date('2025-06-24 13:00:00'),
            createdAt: new Date(),
          },
          {
            id: 3,
            startAt: new Date('2026-06-24 13:00:00'),
            createdAt: new Date(),
          },
        ],
      };
      const mockLectureDomain = new Lectures(
        mockLecture.id,
        mockLecture.name,
        mockLecture.limitUsersCount,
        mockLecture.createdAt,
        mockLecture.scheduleList.map(
          (schedule) =>
            new LectureSchedules(
              schedule.id,
              schedule.startAt,
              schedule.createdAt,
              null,
            ),
        ),
      );
      mockLectureDomain.isEnrollmentUser = jest.fn(() => false);
      mockLectureDomain.isLectureStarted = jest.fn(() => false);
      mockLectureDomain.isCapacityFull = jest.fn(() => true);
      specialLectureRepositoryPort = new StubSpecialLectureRepository(
        mockLectureDomain,
        null,
      );
      specialLectureRepositoryPort.createHistory = jest.fn();

      specialLectureService = new SpecialLectureService(
        specialLectureRepositoryPort,
      );
      //when
      //then
      await expect(
        specialLectureService.applySpecialLecture(userId, lectureScheduleId),
      ).rejects.toThrow(
        new Error(
          SpecialLectureErrorCodeEnum.EXCEEDS_MAXIMUM_APPLY_ERROR.message,
        ),
      );
      expect(specialLectureRepositoryPort.createHistory).toHaveBeenCalled();
    });
  });
});
