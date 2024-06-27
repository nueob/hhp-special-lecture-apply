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
import { SpecialLectureErrorCodeEnum } from '../../../special_lecture/enum/SpecialLectureErrorCode.enum';

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

  describe('isEnrollmentSuccessful: 수강 신청 완료 여부 조회', () => {
    afterAll(async () => {
      await lectureScheduleUsersRepository.clear();
    });

    test('수강신청이 완료되었을 경우 true를 반환한다.', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;
      const lectureSchduleUsersEntity = new LectureScheduleUsersEntity();
      lectureSchduleUsersEntity.id = 1;
      lectureSchduleUsersEntity.lectureSchedulesId = lectureScheduleId;
      lectureSchduleUsersEntity.userId = userId;
      lectureSchduleUsersEntity.createdAt = new Date();

      await lectureScheduleUsersRepository.insert(lectureSchduleUsersEntity);
      //when
      const response = await specialLectureService.isEnrollmentSuccessful(
        userId,
        lectureScheduleId,
      );
      //then
      expect(response).toBeTruthy();
    });

    test('수강신청이 된 특강이 없을 경우 false를 반환한다.', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;
      //when
      const response = await specialLectureService.isEnrollmentSuccessful(
        userId,
        lectureScheduleId,
      );
      //then
      expect(response).toBeFalsy();
    });
  });

  describe('applySpecialLecture: 수강 신청', () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('1998-09-06 13:30:00'));

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
    });

    afterEach(async () => {
      await Promise.all([
        lecturesRepository.clear(),
        lectureSchedulesRepository.clear(),
        lectureScheduleUsersRepository.clear(),
        lectureEnrollmentRequestLogRepository.clear(),
      ]);
    });

    test('정상 요청일 경우, true를 반환한다.', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;
      //when
      const response = await specialLectureService.applySpecialLecture(
        userId,
        lectureScheduleId,
      );
      // 저장이 되었는 지 확인
      const [existsUser, existsHistory] = await Promise.all([
        lectureScheduleUsersRepository.exists({
          where: { userId, lectureSchedulesId: lectureScheduleId },
        }),
        lectureEnrollmentRequestLogRepository.exists({
          where: {
            userId,
            lectureSchedulesId: lectureScheduleId,
            isSuccess: true,
          },
        }),
      ]);
      //then
      expect(response).toBeTruthy();
      expect(existsUser).toBeTruthy();
      expect(existsHistory).toBeTruthy();
    });

    test('특강이 없을 경우, error를 반환한다.', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 2;
      //when
      //then
      await expect(
        specialLectureService.applySpecialLecture(userId, lectureScheduleId),
      ).rejects.toThrow(
        new Error(SpecialLectureErrorCodeEnum.NO_EXIST_LECTURES.message),
      );
    });

    test('이미 등록된 사용자일 경우, error를 반환한다.', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 1;

      const lectureScheduleUsers = new LectureScheduleUsersEntity();
      lectureScheduleUsers.id = 1;
      lectureScheduleUsers.userId = userId;
      lectureScheduleUsers.lectureSchedulesId = lectureScheduleId;
      lectureScheduleUsers.createdAt = new Date();

      await lectureScheduleUsersRepository.save(lectureScheduleUsers);
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

    test('지난 특강일 경우, error를 반환한다.', async () => {
      //given
      const userId = 1;
      const lectureScheduleId = 2;

      const lectureSchedules = new LectureSchedulesEntity();
      lectureSchedules.id = 2;
      lectureSchedules.lecturesId = 1;
      lectureSchedules.startAt = new Date('1998-09-05 11:00:00');
      lectureSchedules.createdAt = new Date();
      await lectureSchedulesRepository.save(lectureSchedules);
      //when
      //then
      await expect(
        specialLectureService.applySpecialLecture(userId, lectureScheduleId),
      ).rejects.toThrow(
        new Error(
          SpecialLectureErrorCodeEnum.LECTURE_START_TIME_PAST_ERROR.message,
        ),
      );

      expect(
        lectureEnrollmentRequestLogRepository.exists({
          where: {
            userId,
            lectureSchedulesId: lectureScheduleId,
            isSuccess: false,
          },
        }),
      ).toBeTruthy();
    });

    test('수용 가능 인원이 찼을 경우, error를 반환한다.', async () => {
      //given
      const lectureEntity = new LecturesEntity();
      lectureEntity.id = 2;
      lectureEntity.name = '가짜 특강 강의';
      lectureEntity.limitUsersCount = 1;
      lectureEntity.createdAt = new Date();

      const lectureSchedulesEntity = new LectureSchedulesEntity();
      lectureSchedulesEntity.id = 2;
      lectureSchedulesEntity.lecturesId = 2;
      lectureSchedulesEntity.startAt = new Date('2024-06-28 10:00:00');
      lectureSchedulesEntity.createdAt = new Date();

      const lectureScheduleUsers = new LectureScheduleUsersEntity();
      lectureScheduleUsers.id = 1;
      lectureScheduleUsers.userId = 1;
      lectureScheduleUsers.lectureSchedulesId = 2;
      lectureScheduleUsers.createdAt = new Date();

      await Promise.all([
        lecturesRepository.insert(lectureEntity),
        lectureSchedulesRepository.insert(lectureSchedulesEntity),
        lectureScheduleUsersRepository.save(lectureScheduleUsers),
      ]);

      const userId = 2;
      const lectureScheduleId = 2;
      //when
      //then
      await expect(
        specialLectureService.applySpecialLecture(userId, lectureScheduleId),
      ).rejects.toThrow(
        SpecialLectureErrorCodeEnum.EXCEEDS_MAXIMUM_APPLY_ERROR.message,
      );

      expect(
        lectureEnrollmentRequestLogRepository.exists({
          where: {
            userId,
            lectureSchedulesId: lectureScheduleId,
            isSuccess: false,
          },
        }),
      ).toBeTruthy();
    });
  });

  describe('applySpecialLecture: 동시성 테스트', () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('1998-09-06 13:30:00'));

      const lectureEntity = new LecturesEntity();
      lectureEntity.id = 1;
      lectureEntity.name = '가짜 특강 강의';
      lectureEntity.limitUsersCount = 5;
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
    });

    afterEach(async () => {
      await Promise.all([
        lecturesRepository.clear(),
        lectureSchedulesRepository.clear(),
        lectureScheduleUsersRepository.clear(),
        lectureEnrollmentRequestLogRepository.clear(),
      ]);
    });

    test('여러명이 동시에 수강 신청할 경우 순차적으로 실행된다.', async () => {
      //given
      const lectureScheduleId = 1;
      const user1Id = 1;
      const user2Id = 2;
      const user3Id = 3;
      //when
      await Promise.all([
        specialLectureService.applySpecialLecture(user1Id, lectureScheduleId),
        specialLectureService.applySpecialLecture(user2Id, lectureScheduleId),
        specialLectureService.applySpecialLecture(user3Id, lectureScheduleId),
      ]);
      // 저장이 되었는 지 확인
      const [appliedUser] = await Promise.all([
        lectureScheduleUsersRepository.count({
          where: { lectureSchedulesId: lectureScheduleId },
        }),
      ]);
      //then
      expect(appliedUser).toBe(3);
    });

    test('수용 가능한 인원보다 더 많은 인원이 신청했을 경우, 수용 가능한 인원만큼 신청된다.', async () => {
      //given
      const lectureScheduleId = 1;
      const user1Id = 1;
      const user2Id = 2;
      const user3Id = 3;
      const user4Id = 3;
      const user5Id = 3;
      //when
      await Promise.all([
        specialLectureService.applySpecialLecture(user1Id, lectureScheduleId),
        specialLectureService.applySpecialLecture(user2Id, lectureScheduleId),
        specialLectureService.applySpecialLecture(user3Id, lectureScheduleId),
        specialLectureService.applySpecialLecture(user4Id, lectureScheduleId),
        specialLectureService.applySpecialLecture(user5Id, lectureScheduleId),
      ]);
      // 저장이 되었는 지 확인
      const [appliedUser] = await Promise.all([
        lectureScheduleUsersRepository.count({
          where: { lectureSchedulesId: lectureScheduleId },
        }),
      ]);
      //then
      expect(appliedUser).toBe(5);
    });
  });
});
