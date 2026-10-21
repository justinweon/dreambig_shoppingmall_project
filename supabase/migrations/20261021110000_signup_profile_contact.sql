-- 대상: dreambig-shoppingmall-dev. 기존 카카오 분기/함수 권한을 보존한다.
begin;

alter table public.profiles
    add column if not exists phone text,
    add column if not exists zip_code text,
    add column if not exists address text,
    add column if not exists address_detail text;

do $migration$
declare
    definition text := replace(pg_get_functiondef('public.create_signup_profile()'::regprocedure), E'\r\n', E'\n');
    old_pattern text := $old$insert[[:space:]]+into[[:space:]]+public[.]profiles[[:space:]]*[(][[:space:]]*id,[[:space:]]*nickname,[[:space:]]*name,[[:space:]]*role[)][[:space:]]+values[[:space:]]*[(]new[.]id,[[:space:]]*candidate,[[:space:]]*profile_name,[[:space:]]*'user'[)];$old$;
    new_insert text := $new$insert into public.profiles (
      id, nickname, name, role, phone, zip_code, address, address_detail
    ) values (
      new.id, candidate, profile_name, 'user',
      nullif(btrim(new.raw_user_meta_data ->> 'phone'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'zip_code'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'address'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'address_detail'), '')
    );$new$;
begin
    if (select count(*) from information_schema.columns
        where table_schema = 'public' and table_name = 'profiles'
          and column_name in ('phone', 'zip_code', 'address', 'address_detail')
          and data_type = 'text' and is_nullable = 'YES' and column_default is null) <> 4 then
        raise exception 'PROFILE_CONTACT_SCHEMA_MISMATCH';
    end if;
    -- 적용 완료 상태에서는 아무것도 바꾸지 않는다.
    if position(regexp_replace(new_insert, '[[:space:]]+', '', 'g')
                in regexp_replace(definition, '[[:space:]]+', '', 'g')) > 0 then return; end if;
    -- 예상한 이메일 INSERT 하나만 교체한다. 함수가 달라졌으면 덮어쓰지 않는다.
    if (select count(*) from regexp_matches(definition, old_pattern, 'g')) <> 1 then
        raise exception 'SIGNUP_EMAIL_INSERT_CHANGED';
    end if;
    -- pg_get_functiondef의 CREATE OR REPLACE로 보안 옵션, search_path, ACL을 보존한다.
    execute regexp_replace(definition, old_pattern, new_insert);
end;
$migration$;

commit;
