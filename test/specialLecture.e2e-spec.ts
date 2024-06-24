import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SpecialLectureModule } from '../src/special_lecture/specialLecture.module';
import { EntityModule } from '../persistence/entity/entity.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('SpecialLectureController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'user',
          password: '123',
          database: 'lecture',
          entities: ['../persistence/entity/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        EntityModule,
        SpecialLectureModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('특강 선택을 위해 목록 조회를 한다.', () => {
    test('/lectures (GET)', async () => {
      //given
      //when
      const response = await request(app.getHttpServer()).get('/lectures');
      //then
      expect(response.status).toBe(200);
    });
  });

  describe('/lectures/apply (POST): 특강 신청을 한다', () => {
    test('정상 요청', async () => {
      //given
      const body = {
        userId: 1,
        lectureScheduleId: 1,
      };
      //when
      const response = await request(app.getHttpServer())
        .post('/lectures/apply')
        .send(body);
      //then
      expect(response.status).toBe(201);
    });
    test('userId가 없을 경우 ERROR를 던진다', async () => {
      //given
      const body = {
        lectureScheduleId: 1,
      };
      //when
      const response = await request(app.getHttpServer())
        .post('/lectures/apply')
        .send(body);
      //then
      expect(response.status).toBe(400);
    });
    test('lectureScheduleId가 없을 경우 ERROR를 던진다', async () => {
      //given
      const body = {
        userId: 1,
      };
      //when
      const response = await request(app.getHttpServer())
        .post('/lectures/apply')
        .send(body);
      //then
      expect(response.status).toBe(400);
    });
    test('userId의 타입이 number 아닐 경우 ERROR를 던진다', async () => {
      //given
      const body = {
        userId: 'string',
        lectureScheduleId: 1,
      };
      //when
      const response = await request(app.getHttpServer())
        .post('/lectures/apply')
        .send(body);
      //then
      expect(response.status).toBe(400);
    });
    test('lectureScheduleId 타입이 number 아닐 경우 ERROR를 던진다', async () => {
      //given
      const body = {
        userId: 1,
        lectureScheduleId: 'string',
      };
      //when
      const response = await request(app.getHttpServer())
        .post('/lectures/apply')
        .send(body);
      //then
      expect(response.status).toBe(400);
    });
  });
});
