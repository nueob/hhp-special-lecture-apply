import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class ApplySpecialLecturesRequestDTO {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  lectureScheduleId: number;
}
