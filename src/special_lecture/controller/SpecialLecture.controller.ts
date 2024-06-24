import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
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

  @Get('/application/:userId/:lectureScheduleId')
  findUserApplication(
    @Param('userId') userId: number,
    @Param('lectureScheduleId') lectureScheduleId: number,
  ): boolean {
    return true;
  }

  @Post('/apply')
  apply(
    @Body(ValidationPipe)
    applySpecialLectureRequestDTO: ApplySpecialLecturesRequestDTO,
  ): boolean {
    return true;
  }
}
