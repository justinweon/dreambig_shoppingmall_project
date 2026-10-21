# 회원가입 연락처와 기본 배송지

2026-10-21 `dreambig-shoppingmall-dev`에 `migrations/20261021110000_signup_profile_contact.sql`을 SQL Editor로 적용했다. 이 폴더는 기존 DB에 더하는 증분 변경이며 DB 전체를 초기화하는 baseline은 아니다. CLI 마이그레이션 이력 테이블에는 별도로 등록하지 않았다.

`public.profiles`에 `phone`, `zip_code`, `address`, `address_detail`을 모두 nullable text, 기본값 없음으로 추가했다. 기존 프로필 값은 변경하지 않는다. 우편번호는 문자열이므로 앞자리 0을 보존한다.

`public.create_signup_profile()`의 이메일 가입 INSERT만 교체했다. 닉네임 변수 `candidate`, 이름 계산 `profile_name`, 카카오 닉네임 생성/충돌 처리, 함수의 SECURITY DEFINER와 빈 search_path를 유지한다. 이메일 가입의 네 새 값은 `raw_user_meta_data`의 같은 키를 읽어 `nullif(btrim(...), '')`로 저장한다. 카카오 가입은 새 필드 없이 기존 경로로 생성되므로 모두 null이다.

스크립트는 트랜잭션으로 적용되며 예상한 이메일 INSERT가 정확히 하나가 아니면 중단한다. 기존 함수의 전체 정의에서 해당 문장만 교체해 다른 분기를 보존한다. 이미 적용된 상태에서는 재실행해도 새 변경을 만들지 않는다. RLS나 GRANT는 변경하지 않았다. 새 필드는 기존 본인 프로필 SELECT 권한으로 읽을 수 있다. 프로필의 연락처/배송지 수정 권한을 추가한 작업은 아니다.

## 프론트 전달 계약

Supabase Auth를 직접 사용할 때는 아래 키를 `options.data`로 보낸다. `api.auth.signUp`을 사용하면 같은 필드를 그대로 인자로 전달한다.

```ts
await api.auth.signUp({
    email,
    password,
    nickname,
    name,
    phone: '01012345678',
    zip_code: '01234',
    address,
    address_detail,
});
```

래퍼는 연락처/배송지의 앞뒤 공백을 정리하고 빈 값은 null로 전달한다. `phone`은 숫자만 허용한다. DB 컬럼 자체에는 이번 요청 외의 새 형식 CHECK를 추가하지 않았다. `ProfileRow`와 `auth.getMyProfile()` 조회 결과에 네 필드를 포함했다. `/signup` 페이지와 기존 `signUpAction`/가입 폼은 프론트 담당 작업으로 남긴다.

주문서는 `auth.getMyProfile()`의 기본 배송지를 복사해 입력 상태의 초깃값으로 사용할 수 있다. 사용자가 주문서에서 바꾼 값은 주문별 배송지로 다뤄야 하며, 이번 변경은 주문 배송지 컬럼이나 주문 생성 RPC를 추가하지 않는다. 현재 주문 API에 배송지를 전달하는 계약은 아직 없다.

## 검증

- 실제 DB에서 네 컬럼의 text 타입, nullable, 본인 프로필 SELECT 권한을 확인했다.
- `tests/signup_profile_contact.sql`로 이메일 가입의 연락처 저장, 공백/생략/null 처리, 우편번호 0 보존, 카카오 경로와 user 역할을 검증했다.
- 사전에는 마이그레이션과 가입 테스트를 한 트랜잭션에서 롤백했고, 적용 후 가입 테스트를 다시 수행했다. 모든 테스트 계정/프로필은 롤백했다. Auth 테이블 직접 SQL 테스트이므로 이메일 발송이나 실제 카카오 OAuth 로그인은 수행하지 않았다.
- 기존/변경 후 카카오 분기 텍스트를 공백 정규화 후 비교해 동일함을 확인했다. SECURITY DEFINER와 search_path도 유지됐다.
- 마이그레이션 재실행을 검증했다.
- API 회귀 테스트 17개, API 타입 검사, 변경 범위 ESLint 검사 통과.

검증 SQL은 테스트 트랜잭션 끝의 `rollback`을 유지해 실행한다. 실패한 트랜잭션이 남은 연결에서는 먼저 `rollback`한 뒤 다시 실행한다.
