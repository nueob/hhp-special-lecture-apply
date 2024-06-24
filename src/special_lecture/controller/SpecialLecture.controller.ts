import { Controller, Get } from '@nestjs/common';
import { SpecialLectureService } from '../service/SpecialLecture.service';
import { FindSpecialLectureResponseDTO } from './dto/res/FindSpecialLecture.res.dto';

@Controller('/lectures')
export class SpecialLectureController {
  constructor(private readonly specialLectureService: SpecialLectureService) {}

  @Get()
  find(): FindSpecialLectureResponseDTO {
    return new FindSpecialLectureResponseDTO();
  }
}
