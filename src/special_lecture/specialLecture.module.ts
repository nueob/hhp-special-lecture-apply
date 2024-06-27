import { Module } from '@nestjs/common';
import { SpecialLectureController } from './controller/SpecialLecture.controller';
import { SpecialLectureRepositoryAdapter } from './repository/SpecialLecture.repository.adapter';
import { SpecialLectureService } from './service/SpecialLecture.service';
import { SpecialLectureRepositoryPort } from './service/port/SpecialLecture.repository.port';
import { EntityModule } from '../../persistence/entity/entity.module';
// import { LockService } from './service/lock/Lock.service';

@Module({
  imports: [EntityModule],
  controllers: [SpecialLectureController],
  providers: [
    // LockService,
    SpecialLectureService,
    SpecialLectureRepositoryAdapter,
    {
      provide: SpecialLectureRepositoryPort,
      useClass: SpecialLectureRepositoryAdapter,
    },
  ],
})
export class SpecialLectureModule {}
