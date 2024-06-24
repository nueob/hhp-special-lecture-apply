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
});
