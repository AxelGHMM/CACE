-- PostgreSQL database dump

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

SET default_tablespace = '';
SET default_table_access_method = heap;

-- Tabla attendances
CREATE TABLE public.attendances (
    id SERIAL PRIMARY KEY,
    student_id integer NOT NULL,
    professor_id integer NOT NULL,
    date date NOT NULL,
    status character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT attendances_status_check CHECK (((status)::text = ANY ((ARRAY['present'::character varying, 'absent'::character varying, 'late'::character varying])::text[])))
);

-- Tabla grades
CREATE TABLE public.grades (
    id SERIAL PRIMARY KEY,
    student_id integer NOT NULL,
    professor_id integer NOT NULL,
    attendance numeric(5,2),
    activities numeric(5,2),
    project numeric(5,2),
    exam numeric(5,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Tabla professor_student
CREATE TABLE public.professor_student (
    id SERIAL PRIMARY KEY,
    professor_id integer NOT NULL,
    student_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Tabla students
CREATE TABLE public.students (
    id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL,
    email character varying(100),
    matricula character varying(50) NOT NULL,
    "group" character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Tabla users
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'professor'::character varying])::text[])))
);

-- Datos iniciales en las tablas
COPY public.professor_student (id, professor_id, student_id, created_at) FROM stdin;
1	1	1	2025-01-20 00:38:00.688585
\.

COPY public.students (id, name, email, matricula, "group", created_at, updated_at) FROM stdin;
1	John Doe	\N	MAT12345	A1	2025-01-20 00:37:53.647803	2025-01-20 00:37:53.647803
3	Jane Smith	janesmith@example.com	MAT67890	A2	2025-01-20 01:15:44.073798	2025-01-20 01:15:44.073798
\.

COPY public.users (id, name, email, password, role, created_at, updated_at) FROM stdin;
1	Admin User	admin@example.com	encryptedpassword	admin	2025-01-20 00:37:49.399456	2025-01-20 00:37:49.399456
3	Professor John	john@example.com	encryptedpassword	professor	2025-01-20 01:15:31.282663	2025-01-20 01:15:31.282663
\.

-- Sequences
SELECT pg_catalog.setval('public.attendances_id_seq', 2, true);
SELECT pg_catalog.setval('public.grades_id_seq', 1, true);
SELECT pg_catalog.setval('public.professor_student_id_seq', 1, true);
SELECT pg_catalog.setval('public.students_id_seq', 3, true);
SELECT pg_catalog.setval('public.users_id_seq', 3, true);
