export class ApplySpecialLectureCodeEnum {
  static readonly IS_SUCCESS = new ApplySpecialLectureCodeEnum(
    '수강 신청에 성공하였습니다.',
  );
  static readonly IS_FAIL = new ApplySpecialLectureCodeEnum(
    '수강 신청에 실패하였습니다.',
  );

  private _message: string;

  constructor(message: string) {
    this._message = message;
  }

  get message(): string {
    return this._message;
  }
}
