import { SpecialLectureService } from '../../../service/SpecialLecture.service';
import { SpecialLectureController } from '../../../controller/SpecialLecture.controller';
import { Lectures } from '../../../domain/Lectures.domain';
import { LectureSchedules } from '../../../domain/LectureSchedules.domain';
import { FindSpecialLectureResponseDTO } from '../../../controller/dto/res/FindSpecialLecture.res.dto';
import { SpecialLectureRepositoryPort } from 'src/special_lecture/service/port/SpecialLecture.repository.port';

describe('SpecialLectureController', () => {
  let specialLectureController: SpecialLectureController;
  let specialLectureService: SpecialLectureService;
  let specialLectureRepositoryPort: SpecialLectureRepositoryPort;

  beforeEach(async () => {
    specialLectureService = new SpecialLectureService(
      specialLectureRepositoryPort,
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
});
