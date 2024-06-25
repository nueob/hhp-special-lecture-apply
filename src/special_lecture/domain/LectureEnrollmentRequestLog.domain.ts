export class LectureEnrollmentRequestLog {
  private readonly _id: number;
  private readonly _userId: number;
  private readonly _lectureSchedulesId: number;
  private readonly _isSuccess: boolean;
  private readonly _createdAt: Date;

  constructor(
    id: number,
    userId: number,
    lectureSchedulesId: number,
    isSuccess: boolean,
    createdAt: Date,
  ) {
    this._id = id;
    this._userId = userId;
    this._lectureSchedulesId = lectureSchedulesId;
    this._isSuccess = isSuccess;
    this._createdAt = createdAt;
  }

  get id(): number {
    return this._id;
  }

  get userId(): number {
    return this._userId;
  }

  get lectureSchedulesId(): number {
    return this._lectureSchedulesId;
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
