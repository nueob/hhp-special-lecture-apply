import { ApplySpecialLectureCodeEnum } from '../../../enum/ApplySpecialLectureCode.enum';

export class ApplySpecialLectureResponseDTO {
  private readonly _isSuccess: boolean;
  private readonly _message: string;

  constructor(isSuccess: boolean) {
    this._isSuccess = isSuccess;
    this._message = isSuccess
      ? ApplySpecialLectureCodeEnum.IS_SUCCESS.message
      : ApplySpecialLectureCodeEnum.IS_FAIL.message;
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get message(): string {
    return this._message;
  }
}
