# 🕒 직원 출퇴근 관리 시스템

출퇴근 기록 및 관리자 관리 기능을 제공하는 직원 출퇴근 관리 시스템입니다.  
NestJS 기반 백엔드 프로젝트로, 실무와 유사한 환경을 고려하여 심플하게 설계 및 구현되었습니다.

## 개발 목적

- NestJS, TypeORM, PostgreSQL, Docker 기반의 백엔드 실습
- 요즘 Node.js 실무에선 Nest.js를 많이 사용하는 것 같아 학습 겸 실습
- 실무에서 활용 가능한 **인증/인가, 역할별 권한 처리**, **예외 처리** 경험 축적

---

## 기술 스택

| 구분      | 사용 기술                                             |
| --------- | ----------------------------------------------------- |
| Language  | TypeScript                                            |
| Framework | [NestJS](https://nestjs.com)                          |
| Database  | PostgreSQL + TypeORM                                  |
| Auth      | JWT 인증, Role 기반 권한 관리 (@Roles, Guard)         |
| Infra     | Docker, Docker Compose                                |
| Dev Tools | Postman (API 테스트), dotenv, bcrypt, class-validator |

---

## 시스템 구성

```bash
.
├── src
│   ├── auth           # 회원가입, 로그인, JWT 인증/인가, 역할(Role) 관리
│   ├── user           # 사용자 정보 (ADMIN, EMPLOYEE)
│   ├── attendance     # 출근, 퇴근, 본인 기록 조회 등 출퇴근 기록 관리
│   └── common         # 공통 예외처리, 데코레이터 등
├── docker-compose.yml
├── .env
└── README.md
```

## 주요 기능

- 인증 및 권한

  - 회원가입 / 로그인 (JWT 발급)
  - 관리자 / 직원 구분 (UserRole.ADMIN, UserRole.EMPLOYEE)
  - Role 기반 접근 제어 (@Roles, RolesGuard)

- 출퇴근 기록
  | 기능 | 설명 |
  |-|-|
  | 출근 체크 | 하루 1회만 가능. 중복 출근 시 예외 발생 |
  | 퇴근 체크 | 출근 후 퇴근 가능. 이미 퇴근한 경우 예외 발생 |
  | 내 기록 조회 | 내 출퇴근 기록 조회 가능 |
  | 전체 기록 조회 (ADMIN) | 모든 직원의 출퇴근 기록 조회가능 (관리자만 접근 가능) |

## 실행 방법

#### 1. .env 파일 작성
- ADMIN_EMAIL=admin@test.com
- ADMIN_PASSWORD=admin1234
- TEST_USER_EMAIL=tester@test.com
- TEST_USER_PASSWORD=tester1234
- JWT_SECRET=attendance1234

#### 2. Docker Compose 실행

```bash
docker compose up --build
```

#### 3. Postman으로 API 테스트

| 역할     | 이메일          | 비밀번호   |
| -------- | --------------- | ---------- |
| 관리자   | admin@test.com  | admin1234  |
| 일반직원 | tester@test.com | tester1234 |


## 구현 예정 및 개선 포인트

- [ ] Class validator를 사용한 유효성 감사
- [ ] 서버에서 발생한 Error를 클라이언트에 일관된 포맷으로 응답 처리리
- [ ] Swagger API 문서화
- [ ] 테스트 코드 작성
