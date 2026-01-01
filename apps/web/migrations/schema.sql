--
-- PostgreSQL database dump
--

\restrict xxx


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: label; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.label (
    id text NOT NULL,
    user_id text NOT NULL,
    stream_id text NOT NULL,
    name text NOT NULL,
    icon text,
    color text,
    parent_id text,
    created_at bigint NOT NULL,
    updated_at bigint NOT NULL
);


--
-- Name: point; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.point (
    id text NOT NULL,
    user_id text NOT NULL,
    stream_id text NOT NULL,
    label_id_list text[] NOT NULL,
    value text NOT NULL,
    started_at bigint NOT NULL,
    created_at bigint NOT NULL,
    updated_at bigint NOT NULL
);


--
-- Name: stream; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stream (
    id text NOT NULL,
    user_id text NOT NULL,
    name text NOT NULL,
    index integer NOT NULL,
    parent_id text,
    created_at bigint NOT NULL,
    updated_at bigint NOT NULL
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id text NOT NULL,
    time_zone text NOT NULL,
    strava_client_id text,
    strava_client_secret text,
    strava_session jsonb,
    created_at bigint NOT NULL,
    updated_at bigint NOT NULL
);


--
-- Name: label label:primaryKey(id); Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT "label:primaryKey(id)" PRIMARY KEY (id);


--
-- Name: label label:unique(id,userId); Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT "label:unique(id,userId)" UNIQUE (id, user_id);


--
-- Name: point point:primaryKey(id); Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point
    ADD CONSTRAINT "point:primaryKey(id)" PRIMARY KEY (id);


--
-- Name: stream stream:primaryKey(id); Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream
    ADD CONSTRAINT "stream:primaryKey(id)" PRIMARY KEY (id);


--
-- Name: stream stream:unique(id,userId); Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream
    ADD CONSTRAINT "stream:unique(id,userId)" UNIQUE (id, user_id);


--
-- Name: user user:primaryKey(id); Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "user:primaryKey(id)" PRIMARY KEY (id);


--
-- Name: label label:foreignKey(parentId); Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT "label:foreignKey(parentId)" FOREIGN KEY (parent_id, user_id) REFERENCES public.label(id, user_id);


--
-- Name: label label:foreignKey(streamId); Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT "label:foreignKey(streamId)" FOREIGN KEY (stream_id, user_id) REFERENCES public.stream(id, user_id);


--
-- Name: label label:foreignKey(userId); Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT "label:foreignKey(userId)" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: point point:foreignKey(streamId); Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point
    ADD CONSTRAINT "point:foreignKey(streamId)" FOREIGN KEY (stream_id, user_id) REFERENCES public.stream(id, user_id);


--
-- Name: point point:foreignKey(userId); Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point
    ADD CONSTRAINT "point:foreignKey(userId)" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: stream stream:foreignKey(parentId); Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream
    ADD CONSTRAINT "stream:foreignKey(parentId)" FOREIGN KEY (parent_id, user_id) REFERENCES public.stream(id, user_id);


--
-- Name: stream stream:foreignKey(userId); Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stream
    ADD CONSTRAINT "stream:foreignKey(userId)" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

\unrestrict xxx

