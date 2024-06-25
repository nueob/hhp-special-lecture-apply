import { LectureScheduleUsers } from '../../../../special_lecture/domain/LectureScheduleUsers.domain';
import { LectureSchedules } from '../../../../special_lecture/domain/LectureSchedules.domain';

describe('LectureSchedulesDomain', () => {
  describe('hasUser : 특강을 수강하는 사용자 인지 판단', () => {
    test('해당 특강을 수강하는 사용자라면 true를 반환', () => {
      //given
      const userId = 1;
      const schedule = new LectureSchedules(null, null, null, [
        new LectureScheduleUsers(1, userId, 2, new Date()),
      ]);
      //when
      const response = schedule.hasUser(userId);
      //then
      expect(response).toBeTruthy();
    });
    test('해당 특강을 수강하지 않는 사용자라면 false를 반환', () => {
      //given
      const userId = 1;
      const schedule = new LectureSchedules(null, null, null, [
        new LectureScheduleUsers(1, 2, 2, new Date()),
      ]);
      //when
      const response = schedule.hasUser(userId);
      //then
      expect(response).toBeFalsy();
    });
  });
  describe('isLectureStarted : 지난 특강인지 판단', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-06-26 00:00:00'));
    });

    test('지난 특강이라면 true를 반환', () => {
      //given
      const schedule = new LectureSchedules(
        null,
        new Date('1998-09-06 13:30:00'),
        null,
        [],
      );
      //when
      const response = schedule.isLectureStarted();
      //then
      expect(response).toBeTruthy();
    });
    test('지난 특강이 아니라면 false를 반환', () => {
      //given
      const schedule = new LectureSchedules(
        null,
        new Date('2024-06-27 00:00:00'),
        null,
        [],
      );
      //when
      const response = schedule.isLectureStarted();
      //then
      expect(response).toBeFalsy();
    });
  });
});
