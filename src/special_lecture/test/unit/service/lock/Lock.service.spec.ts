import { InternalServerErrorException } from '@nestjs/common';
import { LockStatusEnum } from '../../../../enum/LockStatus.enum';
import { LockService } from '../../../../service/lock/Lock.service';
import { DataSource } from 'typeorm';

describe('LockService ', () => {
  let lockService: LockService;
  let dataSource: DataSource;

  beforeEach(() => {
    dataSource = {
      query: jest.fn(),
    } as unknown as DataSource;
    lockService = new LockService(dataSource);
  });

  describe('acquireLock', () => {
    test('락을 성공적으로 걸었을 때 true를 반환', async () => {
      //given
      dataSource.query = jest
        .fn()
        .mockResolvedValue([{ lockStatus: LockStatusEnum.IS_SUCCESS }]);
      lockService = new LockService(dataSource);
      const lockName = 'test';
      const timeout = 1;
      //when
      const response = await lockService.acquireLock(lockName, timeout);
      //then
      expect(response).toBeTruthy();
    });
    test('락을 성공적으로 걸지 못했을 때 false를 반환', async () => {
      //given
      dataSource.query = jest
        .fn()
        .mockResolvedValue([{ lockStatus: LockStatusEnum.IS_FAIL }]);
      lockService = new LockService(dataSource);
      const lockName = 'test';
      const timeout = 1;
      //when
      const response = await lockService.acquireLock(lockName, timeout);
      //then
      expect(response).toBeFalsy();
    });
  });

  describe('releaseLock', () => {
    test('락을 성공적으로 해제 하지 못했을 때 internal serve error', async () => {
      //given
      dataSource.query = jest
        .fn()
        .mockResolvedValue([{ lockStatus: LockStatusEnum.IS_FAIL }]);
      lockService = new LockService(dataSource);
      const lockName = 'test';
      //when
      //then
      await expect(lockService.releaseLock(lockName)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });
});
