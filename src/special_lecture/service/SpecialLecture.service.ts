import { Injectable } from '@nestjs/common';
import { SpecialLectureRepositoryPort } from './port/SpecialLecture.repository.port';

@Injectable()
export class SpecialLectureService {
  constructor(
    private readonly specialLectureRepositoryPort: SpecialLectureRepositoryPort,
  ) {}

  getHello() {
    return 'heelo';
  }
}
