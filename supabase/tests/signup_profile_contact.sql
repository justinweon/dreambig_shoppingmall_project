-- 직접 SQL INSERT로 트리거를 검사한다. 메일을 보내지 않으며 모든 테스트 행은 롤백한다.
begin;
do $test$
declare
    email_id uuid := gen_random_uuid();
    blank_id uuid := gen_random_uuid();
    kakao_id uuid := gen_random_uuid();
    profile public.profiles;
begin
    insert into auth.users (id, email, raw_app_meta_data, raw_user_meta_data)
    values (email_id, email_id::text || '@example.invalid', '{"provider":"email"}',
      jsonb_build_object('nickname', 'test_' || email_id::text, 'name', ' 샘플 ',
        'phone', ' 01012345678 ', 'zip_code', ' 01234 ',
        'address', ' 테스트 기본 주소 ', 'address_detail', ' 101동 1001호 ', 'role', 'admin'));
    select * into strict profile from public.profiles where id = email_id;
    if profile.phone is distinct from '01012345678'
       or profile.zip_code is distinct from '01234'
       or profile.address is distinct from '테스트 기본 주소'
       or profile.address_detail is distinct from '101동 1001호'
       or profile.name is distinct from '샘플' or profile.role <> 'user' then
        raise exception 'EMAIL_CONTACT_ASSERTION_FAILED';
    end if;

    insert into auth.users (id, email, raw_app_meta_data, raw_user_meta_data)
    values (blank_id, blank_id::text || '@example.invalid', '{"provider":"email"}',
      jsonb_build_object('nickname', 'test_' || blank_id::text, 'phone', '  ',
        'zip_code', null, 'address', ''));
    select * into strict profile from public.profiles where id = blank_id;
    if profile.phone is not null or profile.zip_code is not null
       or profile.address is not null or profile.address_detail is not null then
        raise exception 'EMPTY_CONTACT_ASSERTION_FAILED';
    end if;

    insert into auth.users (id, email, raw_app_meta_data, raw_user_meta_data)
    values (kakao_id, kakao_id::text || '@example.invalid', '{"provider":"kakao"}',
      '{"name":"카카오 샘플","phone":"01012345678","zip_code":"01234","address":"주소","address_detail":"상세","role":"admin"}');
    select * into strict profile from public.profiles where id = kakao_id;
    if profile.nickname not like '사용자_%' or profile.name is distinct from '카카오 샘플'
       or profile.role <> 'user' or profile.phone is not null or profile.zip_code is not null
       or profile.address is not null or profile.address_detail is not null then
        raise exception 'KAKAO_BRANCH_ASSERTION_FAILED';
    end if;
end;
$test$;
rollback;
select 'PASS: email fields, nullable blanks, unchanged Kakao branch; all test rows rolled back' as result;
