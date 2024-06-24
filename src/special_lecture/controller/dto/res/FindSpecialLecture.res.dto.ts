import { LectureSchedules } from 'src/special_lecture/domain/LectureSchedules.domain';
import { Lectures } from 'src/special_lecture/domain/Lectures.domain';

export class FindSpecialLectureResponseDTO {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _limitUsersCount: number;
  private readonly _schedulesList: LectureSchedules[];

  constructor(lectures: Lectures) {
    this._id = lectures.id;
    this._name = lectures.name;
    this._limitUsersCount = lectures.limitUsersCount;
    this._schedulesList = lectures.scheduleList;
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

  get schedulesList(): LectureSchedules[] {
    return this._schedulesList;
  }
}
