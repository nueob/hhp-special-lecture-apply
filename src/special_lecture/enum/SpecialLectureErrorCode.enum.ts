export class SpecialLectureErrorCodeEnum {
  static readonly NO_EXIST_LECTURES = new SpecialLectureErrorCodeEnum(
    '존재하지 않는 특강 입니다.',
  );
  static readonly DUPLICATE_ENROLLMENT_ERROR = new SpecialLectureErrorCodeEnum(
    '이미 신청 완료 된 강의 입니다.',
  );
  static readonly LECTURE_START_TIME_PAST_ERROR =
    new SpecialLectureErrorCodeEnum('이미 진행 중인 강의 입니다.');
  static readonly EXCEEDS_MAXIMUM_APPLY_ERROR = new SpecialLectureErrorCodeEnum(
    '수용 가능한 인원을 초과하였습니다.',
  );

  private _message: string;

  constructor(message: string) {
    this._message = message;
  }

  get message(): string {
    return this._message;
  }
}
