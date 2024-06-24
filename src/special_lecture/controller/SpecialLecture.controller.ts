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
import { ApplySpecialLectureResponseDTO } from './dto/res/ApplySpecialLecture.res.dto';

@Controller('/lectures')
export class SpecialLectureController {
  constructor(private readonly specialLectureService: SpecialLectureService) {}

  @Get()
  async findAllLectures(): Promise<FindSpecialLectureResponseDTO[]> {
    const specialLectureList =
      await this.specialLectureService.findAllLectures();
    return specialLectureList.map(
      (lecture) => new FindSpecialLectureResponseDTO(lecture),
    );
  }

  @Get('/application/:userId/:lectureScheduleId')
  async findUserApplication(
    @Param('userId') userId: number,
    @Param('lectureScheduleId') lectureScheduleId: number,
  ): Promise<boolean> {
    const isEnrollmentSuccessful =
      await this.specialLectureService.isEnrollmentSuccessful(
        userId,
        lectureScheduleId,
      );

    return isEnrollmentSuccessful;
  }

  @Post('/apply')
  async apply(
    @Body(ValidationPipe)
    applySpecialLectureRequestDTO: ApplySpecialLecturesRequestDTO,
  ): Promise<ApplySpecialLectureResponseDTO> {
    return new ApplySpecialLectureResponseDTO(
      await this.specialLectureService.applySpecialLecture(
        applySpecialLectureRequestDTO.userId,
        applySpecialLectureRequestDTO.lectureScheduleId,
      ),
    );
  }
}
