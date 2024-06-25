import { Test, TestingModule } from '@nestjs/testing';
import { EntityModule } from '../../../../persistence/entity/entity.module';
import { SpecialLectureController } from '../../../../src/special_lecture/controller/SpecialLecture.controller';
import { SpecialLectureService } from '../../../../src/special_lecture/service/SpecialLecture.service';
import { SpecialLectureRepositoryPort } from '../../../../src/special_lecture/service/port/SpecialLecture.repository.port';
import { SpecialLectureRepositoryAdapter } from '../../../../src/special_lecture/repository/SpecialLecture.repository.adapter';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { LecturesEntity } from '../../../../persistence/entity/lectures.entity';
import { LectureSchedulesEntity } from '../../../../persistence/entity/LectureSchedules.entity';
import { LectureScheduleUsersEntity } from '../../../../persistence/entity/LectureScheduleUsers.entity';
import { LectureEnrollmentRequestLogEntity } from '../../../../persistence/entity/LectureEnrollmentRequestLog.entity';
import { Repository } from 'typeorm';

describe('PointServiceImpl', () => {
  let specialLectureService: SpecialLectureService;
  let specialLectureRepositoryPort: SpecialLectureRepositoryPort;

  let lecturesRepository: Repository<LecturesEntity>;
  let lectureSchedulesRepository: Repository<LectureSchedulesEntity>;
  let lectureScheduleUsersRepository: Repository<LectureScheduleUsersEntity>;
  let lectureEnrollmentRequestLogRepository: Repository<LectureEnrollmentRequestLogEntity>;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EntityModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            LecturesEntity,
            LectureSchedulesEntity,
            LectureScheduleUsersEntity,
            LectureEnrollmentRequestLogEntity,
          ],
          synchronize: true,
        }),
      ],
      controllers: [SpecialLectureController],
      providers: [
        SpecialLectureService,
        {
          provide: SpecialLectureRepositoryPort,
          useClass: SpecialLectureRepositoryAdapter,
        },
      ],
    }).compile();

    specialLectureService = module.get<SpecialLectureService>(
      SpecialLectureService,
    );
    specialLectureRepositoryPort = module.get<SpecialLectureRepositoryPort>(
      SpecialLectureRepositoryPort,
    );

    lecturesRepository = module.get<Repository<LecturesEntity>>(
      getRepositoryToken(LecturesEntity),
    );
    lectureSchedulesRepository = module.get<Repository<LectureSchedulesEntity>>(
      getRepositoryToken(LectureSchedulesEntity),
    );
    lectureScheduleUsersRepository = module.get<
      Repository<LectureScheduleUsersEntity>
    >(getRepositoryToken(LectureScheduleUsersEntity));
    lectureEnrollmentRequestLogRepository = module.get<
      Repository<LectureEnrollmentRequestLogEntity>
    >(getRepositoryToken(LectureEnrollmentRequestLogEntity));
  });

  describe('findAllLectures: 특강 목록을 조회', () => {
    afterAll(async () => {
      await Promise.all([
        lecturesRepository.clear(),
        lectureSchedulesRepository.clear(),
      ]);
    });

    test('특강 목록 리스트를 반환한다.', async () => {
      //given
      const lectureEntity = new LecturesEntity();
      lectureEntity.id = 1;
      lectureEntity.name = '가짜 특강 강의';
      lectureEntity.limitUsersCount = 30;
      lectureEntity.createdAt = new Date();

      const lectureSchedulesEntity = new LectureSchedulesEntity();
      lectureSchedulesEntity.id = 1;
      lectureSchedulesEntity.lecturesId = 1;
      lectureSchedulesEntity.startAt = new Date('2024-06-28 10:00:00');
      lectureSchedulesEntity.createdAt = new Date();

      await Promise.all([
        lecturesRepository.insert(lectureEntity),
        lectureSchedulesRepository.insert(lectureSchedulesEntity),
      ]);

      const lectures = await specialLectureRepositoryPort.findAllLectures();
      //when
      const response = await specialLectureService.findAllLectures();
      //then
      expect(response).toStrictEqual(lectures);
    });
  });
});
