--! Previous: sha1:fe8b1104d37ff45806b608f5acdc63eb68139b78
--! Hash: sha1:6d3befeceefeef39dc5f3755d0a83b9ce45440d6

--
-- set up for authentication
--

-- idempotent reset
DROP TABLE IF EXISTS public.user_session;
ALTER TABLE ONLY public.user DROP COLUMN IF EXISTS email;

-- remove the test user (and all existing data);
DELETE FROM public.point_label;
DELETE FROM public.point;
DELETE FROM public.label;
DELETE FROM public.stream;
DELETE FROM public.replicache_client_view;
DELETE FROM public.replicache_client;
DELETE FROM public.replicache_client_group;
DELETE FROM public.user;

-- add `email` column to `users` table
-- must be unique
-- must be lowercase

ALTER TABLE ONLY public.user
  ADD COLUMN email text NOT NULL,
  ADD CONSTRAINT "user:unique(email)" UNIQUE (email),
  ADD CONSTRAINT "user:check(email)" CHECK (email = lower(email));


--
-- add user_session table
-- this will track authenticated user sessions
--
CREATE TABLE public.user_session (
    id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

ALTER TABLE ONLY public.user_session
  ADD CONSTRAINT "user_session:primaryKey(id)" PRIMARY KEY (id),
  ADD CONSTRAINT "user_session:foreignKey(user_id,user)"
    FOREIGN KEY (user_id)
    REFERENCES public.user (id);
