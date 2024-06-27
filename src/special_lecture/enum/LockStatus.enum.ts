export class LockStatusEnum {
  static readonly IS_SUCCESS = new LockStatusEnum(1, '락을 획득하는 것을 성공');
  static readonly IS_FAIL = new LockStatusEnum(
    2,
    '타임아웃이 발생하거나 락을 획득하지 못함.',
  );

  private _status: number;
  private _description: string;

  constructor(status: number, description: string) {
    this._status = status;
    this._description = description;
  }

  get static(): number {
    return this._status;
  }

  get description(): string {
    return this._description;
  }
}
