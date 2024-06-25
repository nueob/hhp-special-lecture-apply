import { LectureSchedules } from './LectureSchedules.domain';

export class Lectures {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _limitUsersCount: number;
  private readonly _createdAt: Date;
  private readonly _scheduleList: LectureSchedules[];

  constructor(
    id?: number,
    name?: string,
    limitUsersCount?: number,
    createdAt?: Date,
    scheduleList?: LectureSchedules[],
  ) {
    this._id = id;
    this._name = name;
    this._limitUsersCount = limitUsersCount;
    this._createdAt = createdAt;
    this._scheduleList = scheduleList;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get limitUsersCount(): number {
    return this._limitUsersCount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get scheduleList(): LectureSchedules[] {
    return this._scheduleList;
  }
}
