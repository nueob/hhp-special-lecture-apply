import { Injectable } from '@nestjs/common';
import { SpecialLectureRepositoryPort } from '../service/port/SpecialLecture.repository.port';

@Injectable()
export class SpecialLectureRepositoryAdapter
  implements SpecialLectureRepositoryPort {}
