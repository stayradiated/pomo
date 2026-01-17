--! Previous: sha1:6d3befeceefeef39dc5f3755d0a83b9ce45440d6
--! Hash: sha1:2782857bd76fb0454f16b6954085e83cb39d43f9

--
-- add a table to track users verifying their email
--

-- idempotent reset
DROP TABLE IF EXISTS public.email_verification;

CREATE TABLE public.email_verification (
  id text NOT NULL,
  email text NOT NULL,
  token_hash text NOT NULL,
  expires_at bigint NOT NULL,
  retry_count integer NOT NULL,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL
);

ALTER TABLE ONLY public.email_verification
  ADD CONSTRAINT "email_verification:primaryKey(id)" PRIMARY KEY (id),
  ADD CONSTRAINT "email_verification:check(email)" CHECK (email = lower(email)),
  ADD CONSTRAINT "email_verification:check(retry_count)" CHECK ((retry_count >= 0));
