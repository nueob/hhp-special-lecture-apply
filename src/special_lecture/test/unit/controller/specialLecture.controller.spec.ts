import { SpecialLectureService } from '../../../service/SpecialLecture.service';
import { SpecialLectureController } from '../../../controller/SpecialLecture.controller';
import { Lectures } from '../../../domain/Lectures.domain';
import { LectureSchedules } from '../../../domain/LectureSchedules.domain';
import { FindSpecialLectureResponseDTO } from '../../../controller/dto/res/FindSpecialLecture.res.dto';
import { SpecialLectureRepositoryPort } from '../../../service/port/SpecialLecture.repository.port';
import { ApplySpecialLectureResponseDTO } from '../../../controller/dto/res/ApplySpecialLecture.res.dto';
import { LockService } from '../../../service/lock/Lock.service';

describe('SpecialLectureController', () => {
  let specialLectureController: SpecialLectureController;
  let specialLectureService: SpecialLectureService;
  let specialLectureRepositoryPort: SpecialLectureRepositoryPort;
  let lockService: LockService;

  beforeEach(async () => {
    specialLectureService = new SpecialLectureService(
      specialLectureRepositoryPort,
      lockService,
    );
    specialLectureController = new SpecialLectureController(
      specialLectureService,
    );
  });

  describe('/lectures(GET): 특강 선택', () => {
    test('정상요청, API 호출 시 특강 목록을 조회할 수 있습니다.', async () => {
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
      specialLectureService.findAllLectures = jest.fn(() => {
        return Promise.resolve([mockLectureDomain]);
      });
      //when
      const response = await specialLectureController.findAllLectures();
      //then
      expect(response).toStrictEqual([
        new FindSpecialLectureResponseDTO(mockLectureDomain),
      ]);
    });
  });

  describe('/lectures/application/:userId: 특강 신청 완료 여부 조회', () => {
    test('정상 요청, 특강 신청 완료했을 경우 true를 반환합니다.', async () => {
      //given
      const userId = 1;
      const LectureScheduleId = 1;
      specialLectureService.isEnrollmentSuccessful = jest.fn(() =>
        Promise.resolve(true),
      );
      //when
      const response = await specialLectureController.findUserApplication(
        userId,
        LectureScheduleId,
      );
      //then
      expect(response).toBeTruthy();
    });
    test('정상 요청, 특강 신청 실패했을 경우 false를 반환합니다.', async () => {
      //given
      const userId = 1;
      const LectureScheduleId = 1;
      specialLectureService.isEnrollmentSuccessful = jest.fn(() =>
        Promise.resolve(false),
      );
      //when
      const response = await specialLectureController.findUserApplication(
        userId,
        LectureScheduleId,
      );
      //then
      expect(response).toBeFalsy();
    });
  });

  describe('/apply (POST): 특강 신청', () => {
    test('정상 요청, 신청이 완료 되었을 경우 신청 완료 메세지를 반환 받습니다.', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;
      specialLectureService.applySpecialLecture = jest.fn(() =>
        Promise.resolve(true),
      );
      //when
      const response = await specialLectureController.apply({
        userId,
        lectureScheduleId,
      });
      //then
      expect(response).toStrictEqual(new ApplySpecialLectureResponseDTO(true));
    });
    test('정상 요청, 신청이 실패 되었을 경우 신청 실패 메세지를 반환 받습니다.', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;
      specialLectureService.applySpecialLecture = jest.fn(() =>
        Promise.resolve(false),
      );
      //when
      const response = await specialLectureController.apply({
        userId,
        lectureScheduleId,
      });
      //then
      expect(response).toStrictEqual(new ApplySpecialLectureResponseDTO(false));
    });
  });
});
