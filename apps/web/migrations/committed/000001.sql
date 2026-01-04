--! Previous: -
--! Hash: sha1:fe8b1104d37ff45806b608f5acdc63eb68139b78

--
-- idempotent reset
--

drop table if exists public.replicache_client_view;
drop table if exists public.replicache_client;
drop table if exists public.replicache_client_group;
drop view if exists public.point_with_label_list;
drop table if exists public.point_label;
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
  parent_id text,
  sort_order integer not null,

  created_at bigint not null,
  updated_at bigint not null
);

alter table public.stream
  add constraint "stream:primaryKey(id)"
    primary key (id),
  add constraint "stream:unique(id,user_id)"
    unique (id, user_id),
  add constraint "stream:foreignKey(user_id)"
    foreign key (user_id) references public.user (id),
  add constraint "stream:foreignKey(parent_id)"
    foreign key (parent_id, user_id) references public.stream (id, user_id);

--
-- create point table
--

create table public.point (
  id text,
  user_id text not null,
  stream_id text not null,
  description text not null,
  started_at bigint not null,

  created_at bigint not null,
  updated_at bigint not null
);

alter table public.point
  add constraint "point:primaryKey(id)"
    primary key (id),
  add constraint "point:unique(stream_id,started_at)"
    unique (stream_id, started_at),
  add constraint "point:foreignKey(user_id)"
    foreign key (user_id) references public.user (id),
  add constraint "point:foreignKey(stream_id)"
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
  add constraint "label:unique(id,user_id)"
    unique (id, user_id),
  add constraint "label:foreignKey(user_id)"
    foreign key (user_id) references public.user (id),
  add constraint "label:foreignKey(stream_id)"
    foreign key (stream_id, user_id) references public.stream (id, user_id),
  add constraint "label:foreignKey(parent_id)"
    foreign key (parent_id, user_id) references public.label (id, user_id);

--
-- create point_label table
--

create table public.point_label (
  point_id text not null,
  label_id text not null,
  user_id text not null,
  sort_order integer not null,

  created_at bigint not null,
  updated_at bigint not null
);

alter table public.point_label
  add constraint "point_label:primaryKey(point_id,label_id)"
    primary key (point_id, label_id),
  add constraint "point_label:unique(point_id,label_id,user_id)"
    unique (point_id, label_id, user_id),
  add constraint "point_label:foreignKey(point_id)"
    foreign key (point_id) references public.point (id),
  add constraint "point_label:foreignKey(label_id)"
    foreign key (label_id) references public.label (id);

--
-- create point_with_label_list view
--

create view public.point_with_label_list as
  select
    p.id,
    p.user_id,
    p.stream_id,
    p.description,
    p.started_at,
    p.created_at,
    p.updated_at,
    coalesce(
      array_agg(pl.label_id order by pl.sort_order asc, pl.label_id asc)
        filter (where (pl.label_id is not null)),
      array[]::text[]
    ) as label_id_list
  from (
    public.point p
    left join public.point_label pl on ((p.id = pl.point_id))
  )
  group by p.id;

--
-- create replicache_client_group table
--

create table public.replicache_client_group (
  id text not null,
  user_id text not null,
  cvr_version integer not null,

  created_at bigint not null,
  updated_at bigint not null
);

alter table public.replicache_client_group
  add constraint "replicache_client_group:primaryKey(id)"
    primary key (id),
  add constraint "replicache_client_group:foreignKey(user_id)"
    foreign key (user_id) references public.user (id);

--
-- create replicache_client table
--

create table public.replicache_client (
  id text not null,
  replicache_client_group_id text not null,
  last_mutation_id integer not null,

  created_at bigint not null,
  updated_at bigint not null
);

alter table public.replicache_client
  add constraint "replicache_client:primaryKey(id)"
    primary key (id),
  add constraint "replicache_client:foreignKey(replicache_client_group_id)"
    foreign key (replicache_client_group_id) references public.replicache_client_group (id);

--
-- create replicache_client_view table
--

create table public.replicache_client_view (
  id text not null,
  record jsonb not null,

  created_at bigint not null
);

alter table public.replicache_client_view
  add constraint "replicache_client_view:primaryKey(id)"
    primary key (id);

--
-- insert test user
--

INSERT INTO public.user (
  id,
  time_zone,
  strava_client_id,
  strava_client_secret,
  strava_session,
  created_at,
  updated_at
) VALUES (
  'test',
  'Pacific/Auckland',
  null,
  null,
  null,
  (extract(epoch from now()) * 1000)::bigint,
  (extract(epoch from now()) * 1000)::bigint
);
