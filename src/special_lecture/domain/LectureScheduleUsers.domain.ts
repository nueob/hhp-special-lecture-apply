export class LectureScheduleUsers {
  private readonly _id: number;
  private readonly _userId: number;
  private readonly _lectureSchedulesId: number;
  private readonly _createdAt: Date;

  constructor(
    id: number,
    userId: number,
    lectureSchedulesId: number,
    createdAt: Date,
  ) {
    this._id = id;
    this._userId = userId;
    this._lectureSchedulesId = lectureSchedulesId;
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

  get createdAt(): Date {
    return this._createdAt;
  }
}
