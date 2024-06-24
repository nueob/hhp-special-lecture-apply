import { Injectable } from '@nestjs/common';
import { SpecialLectureRepositoryPort } from './port/SpecialLecture.repository.port';
import { Lectures } from '../domain/Lectures.domain';

@Injectable()
export class SpecialLectureService {
  constructor(
    private readonly specialLectureRepositoryPort: SpecialLectureRepositoryPort,
  ) {}

  findAllLectures(): Promise<Lectures[]> {
    return Promise.resolve([new Lectures()]);
  }

  isEnrollmentSuccessful(
    userId: number,
    lectureScheduleId: number,
  ): Promise<boolean> {
    return Promise.resolve(true);
  }
}
