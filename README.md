[자세한 개발 과정 : 노션 문서](https://confirmed-soil-684.notion.site/9ae28618476c4f5ba7909297f4977d25)
<br/>

## 프로젝트

### 프로젝트 개요

- 보스 레이드 유저는 레이드에 참여할 수 있다.
- 같은 레이드를 다시 참가할 수 있다.
- 180초의 제한시간 내에 레이드를 끝내야 한다.
- 레이드가 끝나면 레벨에 따라 점수를 획득한다.
- 획득한 점수는 기록되며 랭킹에 오른다.
- 랭킹은 검색할 수 있다.

### 프로젝트 구동

- 제작 환경: macOS
- IDE: Visual Studio Code 2022
- 설치: Redis / TypeScript / ts-node /mySQL
- 기타 외부 모듈: npm 으로 설치
    
    ```jsx
    $npm i 
    ```
    
- 명령어
    
    ```jsx
    //서버 시작
    $npm start
    
    //테스트: dev dependencies 설치 필요
    $npm test
    $npm run coverage
    
    //개발 버젼 서버 시작: dev dependencies 설치 필요
    $npm run dev
    ```
    
- 환경변수
    - dotenv: .env / .env.test
    - .env.sample 에 필요한 데이터를 남겼음

### 프로젝트 구조

- 3계층 레이어: controller-service-dataAccessLayer
    - controller 는 req 와 res 오브젝트를 다룸. 데이터의 입출력을 담당.
    - 비즈니스 로직은 service 에 구현
    - model 은 database 와 입출력을 담당함.
- 기타
    - 설정 및 시크릿은 dotenv 를 사용하여 관리
    - 스스로 제작한 모듈은 middlewares
    - 시작 프로세스를 테스트 가능한 모듈로 분리함. (app.ts / server.ts / mongo.ts)
<br/>

## 개발조건

### 목표

- REST API 명세서 규칙을 준수하여 구현해주세요.
- req 와 res 는 명세서 대로 작성함

### 기술스택

- 필수사항: 없음. 스케쥴러 필요할 듯
- 선택사항:  Redis / axios(node-fetch)
- 특이사항: 없음
- 버젼관리: git / github / ~~github action(실패)~~
- 사용 기술 스택: nodeJs / express / TypeScript / typeORM / mySQL / Joi / Jest / Redis
- 그 외 외부 모듈: cors / morgan / dotenv / nodemon / ts-node / supertest

<br/>

## 요구사항 분석

### 테이블

| ID | 요구사항 | 세부내용 | 설명 |
| --- | --- | --- | --- |
| 1 | 유저생성 | userId | 중복되지 않아야 |
|  |  | userId | 생성된 id 를 응답으로 보내야함 | 
| 2 | 유저조회 | totalScore | 보스레이드 점수 합계 | 
|  |  | bossRaidHistory | 보스레이드 참여기록 |
| 3 | 보스레이드 상태조회(현재상태 응답) | canEnter | *입장 조건 |
|  |  | enteredUserId | 현재 진행중인 유저가 있다면 해당 유저 id 조회 |
| 4 | 보스레이드 시작 | isEntered | *true |
|  |  | isEntered | *false |
| 5 | 보스레이드 종료 | raidRecordId | *score 반영. |
|  |  | 유효성 검사 | *유효성 검사 |
| 6 | 보스레이드 랭킹 조회 | totalScore  | 내림차순 정렬 |
| 7 | 캐싱(읽기)** | bossRaid ranking  | bossRaid ranking 조회를 redis 로 캐싱. |

### *

1. 입장조건: 
    1. 한번에 한명씩 레이드:
        1. 보스레이드 기록 없음: 레이드 시작
        2. 보스레이드 기록 존재: 
            1. 마지막으로 시작한 유저가 보스레이드를 종료
            2. 마지막으로 시작한 유저가 레이드 제한시간 경과 ⇒ 강제종료
2. 보스레이드 시작:
    1. raidRecordId 생성: 중복 없음
        1. 응답: isEntered 값
3. 보스레이드 종료:
    1. raidRecord: 
        1. 유효성 검사:
            1. 저장된 userId 와 raidRecordId 일치성 검사 ⇒ 예외처리
            2. 레이드 제한시간 지켰는지 검증
        2. 레벨 별 score 계산:
            1. 유저 점수 합계
            2. raidRecord 에 점수를 남기지 않는다.
        3. userId

### **

### 캐싱 작업 순서

- Redis 서버 구동(로컬)
- warming up 작업: 스케쥴러 필요(cron, node-cron 정상 작동안됨. 원인 알 수 없음)
- 랭킹 조회 작업: 1차 redis 2차 mysql
    - 라우터에 미들웨어로 작동함
    - 캐시에 있다면 미들웨어에서 바로 redis 를 거쳐 res 보낸다.
    - 캐시에 없다면 미들웨어에서 next() 실행. service 에서 처리함. 그리고 redis 업데이트.

### 분석

- 유저생성: post 요청으로 끝.
- 유저: 로그인 없음. 패스워드없음. 인증 절차 없음. 인가 절차는 존재
- **캐싱 전략(읽기): Look Aside
    - warming up(스케쥴러): 24시간
    - 랭킹 조회는 1차 redis 에서 읽기
    - 만약 redis 에 데이터가 없다면 DB 에 요청
    - 응답이 끝나면 DB 에서 redis 로 업데이트
    - ~~redis 초 가 지나면 기한만료됨. 기한 만료시 DB 에 업데이트 요청함: 중복 되는 과정이라 제거함~~
- 포인트계산
    - 가용 포인트: 3일 * 10시간 / 2 = 15point
    - 과제분석 / 문서화 / 개발 프로세스 : 4point
    - 테스트 / 주석 : 3point
    - 기능 구현: 8point
<br/>

## 모델링

### 데이터 흐름

- 레이드 조회: 현재 레이드 상태를 알려준다. res 로 canEnter 값과 enteredUserId 를 전송한다. 만약 canEnter 값이 false 라면 enteredUserId 값은 null 이어야 한다.
- 레이드를 시작: userId / level 데이터가 req 로 전송된다. 두 데이터는 raidRecord 에 기록된다. 레이드를 시작하면서 raidRecord row 가 생성되고 res 로 raidRecordId 와 isEntered 값을 전송한다. isEntered 가 true 일때 레이드 시작한다. false 라면 레이드 시작 못하므로 raidRecordId 는 null 값이어야 한다. isEntered 의 판단 기준은 요구사항 분석에 있다.
- 레이드를 종료: 레이드를 완료하면 userId 와 raidRecordId 가 req 로 전송된다. 두 데이터로 유효성 검사를 진행한다. 검사 통과했다면 raidRecord 에 score 를 기록한다. score 를 알기위해 웹 캐시 서버에 요청을 보내야 한다. Redis 를 이용해서 캐시 데이터를 가져올 수도 있다. score 를 기록했다면 user totalScore 와 ranking 데이터를 업데이트 해야 한다. 업데이트 된 데이터를 mysql 과 Redis 에 입력한다. 만약 레이드를 완료하지 못하고 제한시간이 지났다면 isClear 항목을 false 로 한다. 실패했으므로 점수는 0이다.
- ranking 조회: userId 가 요청 body 값으로 전송된다. 랭커 전체 리스트와 유저의 랭킹을 각각 res 로 전송한다.

### 모델

- user
    
    
    | ID | column | type | required | default | etc |
    | --- | --- | --- | --- | --- | --- |
    | 1 | userId | int | y |  | 자동 업데이트 |
    | 2 | totalScore | int | y | 0 | 보스레이드 종료시 업데이트 |
    | 4 | created_at | timestamp |  | timestamp | 자동생성 |
    | 5 | updated_at | timestamp |  | timestamp | 자동생성 |

- raidRecord
    
    
    | ID | column | type | required | default | etc |
    | --- | --- | --- | --- | --- | --- |
    | 1 | raidRecordId | int | y |  | 자동생성 |
    | 2 | userId | int | y |  | fk |
    | 4 | score | number | y | 0 | score  |
    | 5 | level | number | y | 1 | req 당시 레벨 입력. 기본 레벨은 1이다. |
    | 6 | isClear | boolean | y | false | false 는 레이드 실패를 의미. 점수 없음 |
    | 7 | enterTime | timestamp |  | timestamp | 레이드 시작시 생성 |
    | 8 | endTime | timestamp |  | null | 레이드 종료시 생성 |
- bossRaidHistory: table join 으로 생성 ⇒ JSON ()
    
    ```jsx
    bossRaidHistory: [
    { raidRecordId:number, score:number, enterTime:string, endTime:string },
    //..
    ]
    =>userId 로 검색, 충분
    ```
    
- ranking: Redis 에 캐싱. 캐싱 데이터는 mySQL 쿼리로 생성함
    
    ```jsx
    interface RankingInfo {
    ranking: number; // 랭킹 1위의 ranking 값은 0입니다.
    userId: number;
    totalScore: number;
    }
    ```
    
    ```jsx
    //Redis key-value
    
    topRankerInfoList: RankingInfo[] =>totalScore 순으로 정렬한 자료를 redis 업데이트 스케쥴러 필요? 고민해 봐야
    myRankingInfo: RankingInfo
    ```
    

### ERD

<img width="500" alt="ERD 스크린샷" src="https://user-images.githubusercontent.com/88824305/201941292-fafc5b34-1746-4a91-bce0-3e07bbe783af.jpg">

---

## 개발 프로세스

[노션 개발 프로세스 보드 테이터 베이스](https://www.notion.so/9b1fdca2cdfa47aba51e77ff478e8696?v=32cc3314e56b4fc39586831a5b3096bc)

---

## API 명세

[노션 API 명세 데이터 베이스](https://www.notion.so/4e9a038d7d8d47308d39cda262af5f9f?v=2bd323f68b174f188486f3fae4309707)

---

## 테스트케이스

### 테스트 목표

- [x]  단위 테스트
- [x]  통합 테스트
- [ ]  ~~git hub action 도입: 자동화 통합 작업 : 실패~~

### 테스트케이스 테이블

| ID | 종류 | 분류 | 테스트항목 | 결과 |
| --- | --- | --- | --- | --- |
| 1 | 통합 | 유저등록 | 201 | p |
| 2 | 통합 | 유저조회 | 200 | p |
| 3 | 통합 | 유저조회 | 401 | p |
| 4 | 통합 | 보스레이드 상태 조회 | 200 | p |
| 5 | 통합 | 보스레이드 시작 | 201 | p |
| 6 | 통합 | 보스레이드 시작 | 500 | p |
| 7 | 통합 | 보스레이드 종료 | 201 | p |
| 8 | 통합 | 보스레이드 종료 | 403 | p |
| 9 | 통합 | 보스레이드 랭킹 조회 | 200 | p |
| 10 | 단위 | 서버 테스트 | 200 | p |
| 11 | 단위 | 데이터베이스 시작 | init | p |

### 결과

- 데드라인까지 시간이 촉박하여 계획의 일부만 작성함.
- 분기 처리와 캐싱의 작업량이 많아서 커버리지가 낮게 나왔음
    
    <img width="500" alt="테스트 커버리지 스크린샷" src="https://user-images.githubusercontent.com/88824305/201942845-49e9075d-2c17-44f1-b8d5-efc1e0347f7d.jpg">


