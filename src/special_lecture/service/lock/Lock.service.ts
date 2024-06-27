// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { LockStatusEnum } from '../../enum/LockStatus.enum';
// import { DataSource } from 'typeorm';

// @Injectable()
// export class LockService {
//   constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

//   async acquireLock(lockName: string, timeout: number): Promise<boolean> {
//     const [{ lockStatus }] = await this.dataSource.query(
//       `SELECT GET_LOCK(?, ?) as lockStatus`,
//       [lockName, timeout],
//     );

//     return lockStatus === LockStatusEnum.IS_SUCCESS;
//   }

//   async releaseLock(lockName: string): Promise<void> {
//     const [{ lockStatus }] = await this.dataSource.query(
//       `SELECT RELEASE_LOCK(?) as lockStatus`,
//       [lockName],
//     );

//     if (lockStatus !== LockStatusEnum.IS_SUCCESS) {
//       throw new InternalServerErrorException();
//     }
//   }
// }
