--! Previous: -
--! Hash: sha1:c69209e9429c23d806e6922ba97f58700c07d10c

--
-- idempotent reset
--

drop table if exists public.label;
drop table if exists public.point;
drop table if exists public.stream;
drop table if exists public.user;

--
-- create user table
--

create table public.user (
  id text,
  time_zone text not null,

  strava_client_id text,
  strava_client_secret text,
  strava_session jsonb,

  created_at bigint not null,
  updated_at bigint not null
);

alter table public.user
  add constraint "user:primaryKey(id)"
    primary key (id);

--
-- create stream table
--

create table public.stream (
  id text,
  user_id text not null,

  name text not null,
  index integer not null,
  parent_id text,

  created_at bigint not null,
  updated_at bigint not null
);

alter table public.stream
  add constraint "stream:primaryKey(id)"
    primary key (id),
  add constraint "stream:unique(id,userId)"
    unique (id, user_id),
  add constraint "stream:foreignKey(userId)"
    foreign key (user_id) references public.user (id),
  add constraint "stream:foreignKey(parentId)"
    foreign key (parent_id, user_id) references public.stream (id, user_id);

--
-- create point table
--

create table public.point (
  id text,
  user_id text not null,
  stream_id text not null,
  label_id_list text[] not null,
  value text not null,
  started_at bigint not null,

  created_at bigint not null,
  updated_at bigint not null
);

alter table public.point
  add constraint "point:primaryKey(id)"
    primary key (id),
  add constraint "point:foreignKey(userId)"
    foreign key (user_id) references public.user (id),
  add constraint "point:foreignKey(streamId)"
    foreign key (stream_id, user_id) references public.stream (id, user_id);

--
-- create label table
--

create table public.label (
  id text,
  user_id text not null,
  stream_id text not null,
  name text not null,
  icon text,
  color text,
  parent_id text,

  created_at bigint not null,
  updated_at bigint not null
);

alter table public.label
  add constraint "label:primaryKey(id)"
    primary key (id),
  add constraint "label:unique(id,userId)"
    unique (id, user_id),
  add constraint "label:foreignKey(userId)"
    foreign key (user_id) references public.user (id),
  add constraint "label:foreignKey(streamId)"
    foreign key (stream_id, user_id) references public.stream (id, user_id),
  add constraint "label:foreignKey(parentId)"
    foreign key (parent_id, user_id) references public.label (id, user_id);
