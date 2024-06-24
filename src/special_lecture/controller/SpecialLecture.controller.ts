import { Controller, Get } from '@nestjs/common';
import { SpecialLectureService } from '../service/SpecialLecture.service';

@Controller('/lecture')
export class SpecialLectureController {
  constructor(private readonly specialLectureService: SpecialLectureService) {}

  @Get()
  getHello(): string {
    return this.specialLectureService.getHello();
  }
}
