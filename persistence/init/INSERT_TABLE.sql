CREATE TABLE lectures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  limit_users_count INT,
  created_at TIMESTAMP
);

CREATE TABLE lecture_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lectures_id INT,
  start_at TIMESTAMP,
  created_at TIMESTAMP
);

CREATE TABLE lecture_schedule_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lecture_schedules_id INT UNIQUE,
  user_id INT UNIQUE,
  created_at TIMESTAMP,
  CONSTRAINT unique_lecture_user_pair UNIQUE (lecture_schedules_id, user_id)
);

CREATE TABLE lecture_enrollment_request_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  lecture_schedules_id INT,
  is_success INT,
  created_at TIMESTAMP
);

INSERT INTO lectures (name, limit_users_count, created_at) 
VALUES ('헌우코치님의 TDD & 클린 아키텍처', 30, now()),
('허재코치님의 서버 구축', 30, now()),
('종협코치님의 대용량 트래픽 & 데이터 처리', 30, now()),
('석범코치님의 장애 대응', 30, now());

INSERT INTO lecture_schedules (lectures_id, start_at, created_at)
VALUES (1, '2024-04-20 13:00:00', now()),
(1, '2024-05-20 13:00:00', now()),
(1, '2024-12-24 13:00:00', now()),
(2, '2024-04-20 13:00:00', now()),
(2, '2024-05-20 13:00:00', now()),
(2, '2024-12-24 13:00:00', now()),
(3, '2024-04-20 13:00:00', now()),
(3, '2024-05-20 13:00:00', now()),
(3, '2024-12-24 13:00:00', now()),
(4, '2024-04-20 13:00:00', now()),
(4, '2024-05-20 13:00:00', now()),
(4, '2024-12-24 13:00:00', now());
