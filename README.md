# blog-backend


## 단위테스트
1. User
    - [S] 계정생성 (/api/auth/register)
    - [S] 이메일 중복여부확인 (api/auth/exists/email/)
    - [S] 아이디 중복여부확인 (api/auth/exists/username/)
    - 계정정보 수정
    - 회원탈퇴
    - 비밀번호 변경

2. 로그인
    - 토큰 생성.
        - 일반 토큰과 JWT와의 차이는 ?
3. 로그아웃
    - 토큰만료처리

4. Post
    - [S] 생성 (POST, /api/posts)
    - [S] 개별조회 (GET, /api/posts/id)
    - [S] 리스트조회 (GET, /api/posts)
    - 수정



1. 타입스크립트 전환
    - 디버깅
    - 테스트 로직
    - 어떤 부분에 typescript를 적용할 수 있을지?
2. 테스트로직 작성
3. JWT
4. SRR
5. Build Process 
    - Webpack
6. mongoose 정리.


## todo
- 서버개발을 할때 자동으로 재시작시켜주는 기능
    - nodeMon
- body parser
- mongoose
- 설계를 어떻게 할것인가??
    - 로그인 기능
    - 사이드 바.
- jwt secretkey가 있는데 왜 디코드가 되는지?
- post 로직 확인하기..

## mongodb on max with blew
- https://velog.io/@rohkorea86/MongoDB%EC%84%A4%EC%B9%98-%EB%A7%A5MAC%EC%97%90%EC%84%9C-%EB%AA%BD%EA%B3%A0%EB%94%94%EB%B9%84-%EC%84%A4%EC%B9%98
- https://ondemand.tistory.com/245





mongod --config /usr/local/etc/mongod.conf