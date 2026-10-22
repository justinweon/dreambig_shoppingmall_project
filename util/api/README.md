# DreamBig Supabase API

팀원이 Supabase 쿼리를 화면마다 작성하지 않도록 담당 분야별 함수를 제공한다. 2026-10-21 `dreambig-shoppingmall-dev`의 public 테이블, CHECK/NULL/default 제약, 카트/주문/결제 RPC 본문과 RLS 정책 목록을 대시보드에서 확인했다. `types.ts`는 그 구조를 대조해 작성한 타입이며 CLI 자동 생성 파일은 아니다.

## 한 번 가져와서 분야별로 호출하기

브라우저에서 사용하는 API:

```ts
import { supabase } from '@/shared/lib/supabase';
import { createDreambigApi } from '@/util/api';

const api = createDreambigApi(supabase);
const products = await api.products.listProducts();
const detail = await api.products.getProductPageData(101);
const home = await api.products.getHomeData();
```

서버 컴포넌트, Server Action 또는 Route Handler에서는 요청마다 로그인 클라이언트를 만든다:

```ts
import { createServerClient } from '@/shared/lib/supabase';
import { createDreambigServerApi } from '@/util/api/server';

const api = createDreambigServerApi(createServerClient());
const duplicate = await api.auth.checkNicknameDuplicate('세종');
const dashboard = await api.admin.getDashboardSummary();
```

서버 API는 일반 API 전체와 `auth.checkNicknameDuplicate`, `admin`, `payments`를 함께 제공한다. `server.ts`에는 `server-only` 경계가 있어 브라우저에서 import하면 빌드 오류가 난다. 팩토리 자체에 `'use server'`를 붙이지 않는다. 화면에 공개할 Server Action은 별도로 만들고 필요한 결과만 반환한다.

## 담당별 함수

함수는 동작 접두사 `get`, `list`, `check`, `create`, `update`, `delete`, `upsert`, `confirm`을 사용한다. `My`는 현재 로그인한 사용자의 데이터라는 뜻이다. `Duplicate`는 `true`일 때 이미 존재한다는 뜻이다.

| 담당 | 호출 | 반환/동작 |
| --- | --- | --- |
| 로그인 | `auth.signIn(email, password)` | Supabase user/session |
| 회원가입 | `auth.signUp({ email, password, nickname, name? })` | user/session. 이메일 확인 설정에 따라 session은 null일 수 있음 |
| 로그아웃 | `auth.signOut()` | 현재 세션 로그아웃 |
| 공통 헤더 | `auth.getCurrentUser()` | 검증된 user 또는 로그인 세션이 없으면 null |
| 마이페이지 | `auth.getMyProfile()` | 본인 프로필 또는 null |
| 마이페이지 | `auth.updateMyProfile({ nickname, name })` | 변경된 프로필. role 변경은 제공하지 않음 |
| 회원가입, 서버 | `auth.checkNicknameDuplicate(nickname)` | 전체 닉네임의 정확한 일치 여부, boolean |
| 상품 목록 | `products.listProducts({ page?, pageSize?, category? })` | 표시 순서의 상품 배열 |
| 상품 상세 | `products.getProduct(productId)` | 상품 또는 null |
| 상품 상세 | `products.getProductDetail(productId)` | 상세 설정 또는 null |
| 상품 상세 | `products.listReviews(productId, page?, pageSize?)` | 표시 순서의 리뷰 배열 |
| 상품 상세 | `products.getProductPageData(productId, reviewPage?, reviewPageSize?)` | `{ product, detail, reviews }`, 상품이 없으면 null |
| 메인 | `products.getHomeData()` | `{ banners, carouselItems, products }`, 참조 상품을 함께 조회 |
| 메인 | `products.listBanners()`, `products.listCarouselItems()` | 각 표시 데이터 배열 |
| 장바구니 | `cart.listMyCartItems()` | 본인의 상품 ID/수량 배열 |
| 장바구니 | `cart.addMyCartItem(productId, quantity = 1)` | 추가 후 카트 항목. 같은 상품의 수량을 DB에서 원자적으로 합산 |
| 장바구니 | `cart.updateMyCartItem(productId, quantity)` | 변경 후 카트 항목. quantity는 최종 수량 |
| 장바구니 | `cart.deleteMyCartItem(productId)` | 삭제된 product_id 배열. 없으면 빈 배열 |
| 결제 준비 | `orders.createOrder(requestId, items)` | DB가 금액을 확정한 주문 |
| 주문 내역 | `orders.listMyOrders(page?, pageSize?)` | 본인 주문, 최신순 |
| 주문 상세 | `orders.getMyOrder(orderId)` | 본인 주문 또는 null |
| 주문 상세 | `orders.listMyOrderItems(orderId)` | 본인 주문의 상품 스냅샷 배열, 없으면 빈 배열 |
| 결제 내역 | `orders.getMyPayment(orderId)` | 본인 결제 또는 null, payment_key 제외 |
| 게시판 | `notices.listPosts(board)` | board(`notice`/`free`)의 전체 글, 최신순 |
| 게시판 | `notices.getPost(postId)` | 글 또는 null |
| 게시판 | `notices.createPost({ board, title, content })` | 작성된 글. 작성자/닉네임은 로그인 사용자로 채움. 공지는 관리자만 DB 정책 통과 |
| 게시판 | `notices.updatePost(postId, { title, content })` | 수정된 글. 본인 글 또는 관리자만, 아니면 오류 |
| 게시판 | `notices.deletePost(postId)` | 삭제된 id 배열. 권한이 없으면 빈 배열 |
| 게시판 | `notices.increaseViews(postId)` | 조회수 1 증가. 비로그인도 가능 |
| 게시판 | `notices.listComments(postId)` | 댓글과 답글(parent_id 있음)을 작성순으로 |
| 게시판 | `notices.countComments(postIds)` | `{ [postId]: 댓글+답글 수 }`, 없는 글은 키 없음 |
| 게시판 | `notices.createComment(postId, text, parentId?)` | 작성된 댓글. parentId가 있으면 답글 |
| 게시판 | `notices.deleteComment(commentId)` | 삭제된 id 배열. 답글도 함께 삭제 |
| 결제, 서버 | `payments.confirmTossPayment({ orderId, paymentKey, amount })` | Toss 승인 및 검증 후 DB 반영 결과, payment_key 제외 |
| 관리자, 서버 | `admin.getDashboardSummary()` | 상품 수, 회원 수, 결제 대기 주문 수, 결제 완료 주문 수 |
| 관리자, 서버 | `admin.listProfiles(page?, pageSize?)` | 회원 프로필 목록 |
| 관리자, 서버 | `admin.listOrders({ page?, pageSize?, status? })` | 전체 주문. status는 pending_payment 또는 paid |
| 관리자, 서버 | `admin.getOrder(orderId)` | `{ order, items }` 또는 null |
| 관리자, 서버 | `admin.listPayments(page?, pageSize?)` | 전체 결제 내역, payment_key 제외 |
| 관리자, 서버 | `admin.checkProductIdDuplicate(productId)` | 상품 ID 존재 여부 |
| 관리자, 서버 | `admin.createProduct(product)` | ProductRow 필드 전체로 등록, 등록 결과 반환 |
| 관리자, 서버 | `admin.updateProduct(productId, changes)` | ID를 제외한 일부 상품 필드 수정, 결과 반환 |
| 관리자, 서버 | `admin.upsertProductDetail(detail)` | product_id 기준 상세 설정 등록/교체, 결과 반환 |

기본 페이지는 1, 페이지 크기는 20이며 최대 100이다. 목록은 배열만 반환하고 전체 건수는 포함하지 않는다. 관리자 집계는 `count: exact`를 사용한다. 배너/캐러셀은 작은 노출 목록을 전제로 하며 Supabase 프로젝트의 조회 행 상한이 적용된다. 상세 묶음의 리뷰는 요청한 한 페이지이고, 여러 쿼리의 조합은 단일 DB 트랜잭션 스냅샷이 아니다.

## 주문과 결제 담당자 예시

```ts
// 새 구매를 시작할 때 한 번 생성해 구매 상태에 보관한다.
const requestId = crypto.randomUUID();
const items = [{ productId: 101, quantity: 2 }];
const order = await api.orders.createOrder(requestId, items);

// 같은 구매의 응답 유실/재시도: requestId와 items를 그대로 재사용한다.
// 다른 구매일 때만 새 requestId를 만든다.
// 결제창의 orderId, amount에는 order.id, order.amount_minor를 전달한다.
```

가격과 주문 상태를 클라이언트에서 입력받아 orders에 직접 insert/update하지 않는다. `create_order`가 실제 상품 가격으로 KRW 금액과 주문 항목 스냅샷을 저장한다. 상품 ID 중복은 오류이며 입력은 최대 100개다. 같은 requestId로 다른 상품/수량을 재전송하면 DB가 `REQUEST_CONFLICT`를 반환한다. 주문 생성은 카트를 비우지 않는다.

결제 성공 URL을 받은 뒤 서버에서 호출한다:

```ts
const api = createDreambigServerApi(createServerClient());
const payment = await api.payments.confirmTossPayment({
    orderId, paymentKey, amount,
});
```

이 함수는 로그인 사용자의 주문을 확인하고 입력 금액을 DB 금액과 비교한다. 이후 Toss의 서버 승인 API를 호출하고 응답의 주문번호, 결제 키, 금액, 통화, DONE 상태, 승인 시각을 검증한 뒤 `apply_toss_payment`로 반영한다. [Toss 승인 API 문서](https://docs.tosspayments.com/reference)를 기준으로 구현했다. 결제창 SDK, 성공/실패 페이지, Route Handler는 이 작업에 포함하지 않았다.

같은 주문의 재시도에는 같은 입력을 사용한다. Toss 승인 뒤 DB 반영이 실패하면 다시 호출해 DB 반영을 재시도할 수 있다. `ALREADY_PROCESSED_PAYMENT` 응답은 Toss 조회 결과를 검증해 처리한다. 외부 결제와 DB 사이에 분산 트랜잭션은 없으므로 승인 오류/타임아웃을 곧바로 결제 실패 확정으로 표시하지 않는다. 현재 DB는 즉시 완료되는 KRW 결제를 저장하며 가상계좌 입금 대기, 취소/환불/배송 상태 변경은 제공하지 않는다.

## 환경과 권한

로컬 `.env.local`에 필요한 환경 변수를 설정한다. 이 작업에서는 키를 조회하거나 저장하지 않았다.

| 환경 변수 | 사용 범위 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 기존 Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 기존 브라우저/로그인 클라이언트 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 중복 확인, 관리자 조회/수정, 결제 RPC |
| `TOSS_SECRET_KEY` | 서버 전용 Toss 승인/조회 |

서비스 키와 Toss 키에는 `NEXT_PUBLIC_` 접두사를 붙이지 않는다. 관리자 API는 매 호출마다 로그인 클라이언트의 `auth.getUser()`로 요청자를 검증하고, 서버 DB 조회로 `profiles.role === 'admin'`을 확인한다. 일반 사용자용 RLS 정책을 넓히거나 관리자 역할을 자동 부여하지 않는다. 관리자 전체 조회는 기존 본인 조회 정책과 구분해 서버 서비스 클라이언트를 사용한다.

닉네임 중복 확인은 비로그인 회원가입 화면도 사용할 수 있지만, 외부에 공개하는 액션/엔드포인트에서는 요청 빈도를 제한해야 한다. 값은 trim 후 DB의 case-sensitive 일치 기준으로 비교한다. 사전 확인과 실제 가입 사이에 다른 가입이 발생할 수 있으므로 최종 판정은 DB UNIQUE 제약이다. 이메일 사전 중복 조회는 현재 public 스키마/RPC에 계약이 없어 제공하지 않는다. Supabase Auth가 중복 가입 정보를 숨길 수 있으므로 signUp의 성공 응답만으로 새 계정 생성 완료를 단정하지 않는다.

## 반환 타입과 오류 처리

DB 조회는 `types.ts`의 snake_case Row를 반환한다. 기존 `util/types/product.ts`의 표시용 `Product`와 다르며 정적 화면은 자동으로 DB로 전환되지 않는다. 특히 `price_minor`, `amount_minor`, `unit_price_minor`는 최소 화폐 단위다. KRW/JPY는 1원/1엔, USD는 센트이므로 기존 표시 가격에 그대로 대입하지 않는다. JSON 필드는 `Json`으로 유지하므로 화면 타입에 연결할 때 실제 구조를 검증한다.

단건 조회가 없으면 null, 목록은 빈 배열이다. 본인 프로필/카트 수정 대상이 없으면 `.single()` 오류를 반환한다. Supabase 오류는 `DreambigApiError`에 code/message를 보존하며 네트워크 예외는 일반 Error일 수 있다. DB 예외의 code는 SQLSTATE이고 `REQUEST_CONFLICT` 같은 이름은 message에 들어간다. 사용자에게 보여줄 문구는 호출부가 결정한다.

```ts
import { DreambigApiError } from '@/util/api';

try {
    await api.orders.createOrder(requestId, items);
} catch (error) {
    if (error instanceof DreambigApiError && error.code === 'AUTH_REQUIRED') {
        // 로그인 화면으로 연결한다.
    }
    // 그 외 오류도 화면 상태에 반영한다.
}
```

## 검증

`npm run test:api`, `npm run typecheck:api`로 API 테스트와 타입을 검사한다. 변경 범위 ESLint도 통과했다. 테스트 15개는 실제 Supabase 클라이언트의 HTTP 요청을 모의 응답에 연결해 사용자 필터, 관리자 역할 재확인, RPC 인자, 중복 주문 입력, 페이지 범위, 빈 결과, Toss 응답 검증과 재시도를 확인한다. 서버 전용 모듈의 일반 환경 import 차단도 확인했다.

실제 DB에서는 스키마와 RPC/정책을 읽었으며 주문 생성, 상품 수정, 실결제는 실행하지 않았다. 실제 키를 넣은 환경의 통합 검증은 별도다. 전체 프로젝트 타입 검사는 기존 `app/product/page.tsx`와 `components/common/Header.tsx`의 ProductList props 오류, `app/register/page.tsx`의 SignupForm import 대소문자 오류로 실패한다. 변경 전 main `605d791`의 소스를 별도 임시 폴더에서 검사해 같은 세 오류를 재현했다. 전체 빌드도 마지막 import 오류에서 중단되며 이 세 UI 파일은 수정하지 않았다.
