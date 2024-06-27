import { LectureSchedules } from '../../../../special_lecture/domain/LectureSchedules.domain';
import { Lectures } from '../../../../special_lecture/domain/Lectures.domain';

describe('LecturesDomain', () => {
  describe('isEnrollmentUser : 특강을 수강하는 사용자 인지 판단', () => {
    test('해당 특강을 수강하는 사용자라면 true를 반환', () => {
      //given
      const userId = 1;
      const schedule = new LectureSchedules(null, null, null, null);
      schedule.hasUser = jest.fn(() => true);

      const lectures = new Lectures(null, null, null, null, [schedule]);
      //when
      const response = lectures.isEnrollmentUser(userId);
      //then
      expect(response).toBeTruthy();
    });
    test('해당 특강을 수강하지 않는 사용자라면 false를 반환', () => {
      //given
      const userId = 1;
      const schedule = new LectureSchedules(null, null, null, null);
      schedule.hasUser = jest.fn(() => false);

      const lectures = new Lectures(null, null, null, null, [schedule]);
      //when
      const response = lectures.isEnrollmentUser(userId);
      //then
      expect(response).toBeFalsy();
    });
  });

  describe('isLectureStarted : 수강 시작 날짜가 현재 날짜보다 이전인지 판단', () => {
    test('수강 시작 날짜가 현재 날짜보다 이전일 경우, true 반환', () => {
      //given
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-06-26 01:18:00'));

      const lectureScheduleId = 1;
      const lectureSchedules = new LectureSchedules(
        lectureScheduleId,
        null,
        null,
        null,
      );
      lectureSchedules.isLectureStarted = jest.fn(() => true);
      const lectures = new Lectures(null, null, null, null, [lectureSchedules]);
      //when
      const response = lectures.isLectureStarted(lectureScheduleId);
      //then
      expect(response).toBeTruthy();
    });
    test('수강 시작 날짜가 현재 날짜보다 이후일 경우, false 반환', () => {
      //given
      jest.useFakeTimers();
      jest.setSystemTime(new Date('1998-09-06 13:30:00'));

      const lectureScheduleId = 1;
      const lectureSchedules = new LectureSchedules(
        lectureScheduleId,
        null,
        null,
        null,
      );
      lectureSchedules.isLectureStarted = jest.fn(() => false);

      const lectures = new Lectures(null, null, null, null, [lectureSchedules]);
      //when
      const response = lectures.isLectureStarted(lectureScheduleId);
      //then
      expect(response).toBeFalsy();
    });
  });

  describe('isCapacityFull: 수강 가능한 인원이 찼는 지 판단', () => {
    test('수강 가능 인원을 모두 찬 경우 true 를 반환', () => {
      //given
      const lectureSchedules = [];
      const lectures = new Lectures(null, null, 10, null, lectureSchedules);
      lectureSchedules.length = 10;
      //when
      const response = lectures.isCapacityFull();
      //then
      expect(response).toBeTruthy();
    });
    test('수강 가능 인원이 차지 않은 경우 false 를 반환', () => {
      //given
      const lectureSchedules = [];
      const lectures = new Lectures(null, null, 10, null, lectureSchedules);
      //when
      const response = lectures.isCapacityFull();
      //then
      expect(response).toBeFalsy();
    });
  });
});
