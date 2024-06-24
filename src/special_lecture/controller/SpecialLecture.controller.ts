import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { SpecialLectureService } from '../service/SpecialLecture.service';
import { FindSpecialLectureResponseDTO } from './dto/res/FindSpecialLecture.res.dto';
import { ApplySpecialLecturesRequestDTO } from './dto/req/ApplySpecialLectures.req.dto';

@Controller('/lectures')
export class SpecialLectureController {
  constructor(private readonly specialLectureService: SpecialLectureService) {}

  @Get()
  find(): FindSpecialLectureResponseDTO {
    return new FindSpecialLectureResponseDTO();
  }

  @Post('/apply')
  apply(
    @Body(ValidationPipe)
    applySpecialLectureRequestDTO: ApplySpecialLecturesRequestDTO,
  ): boolean {
    return true;
  }
}
