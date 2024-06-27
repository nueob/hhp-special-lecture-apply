import { LectureScheduleUsers } from './LectureScheduleUsers.domain';

export class LectureSchedules {
  private readonly _id: number;
  private readonly _startAt: Date;
  private readonly _createdAt: Date;
  private readonly _userList: LectureScheduleUsers[];

  constructor(
    id: number,
    startAt: Date,
    createdAt: Date,
    userList: LectureScheduleUsers[],
  ) {
    this._id = id;
    this._startAt = startAt;
    this._createdAt = createdAt;
    this._userList = userList;
  }

  public hasUser(userId: number): boolean {
    return this._userList.some((user) => user.userId === userId);
  }

  public isLectureStarted(): boolean {
    return this._startAt < new Date();
  }

  get id(): number {
    return this._id;
  }

  get startAt(): Date {
    return this._startAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get userList(): LectureScheduleUsers[] {
    return this._userList;
  }
}
