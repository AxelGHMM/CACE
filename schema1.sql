-- PostgreSQL database dump

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

-- Tabla de Users (Profesores y Admins)
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'professor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla de Students
CREATE TABLE public.students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    matricula VARCHAR(50) NOT NULL UNIQUE,
    group_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla de Groups
CREATE TABLE public.groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Subjects (Materias)
CREATE TABLE public.subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Assignments (Relación entre users, groups y subjects)
CREATE TABLE public.assignments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id),
    group_id INTEGER NOT NULL REFERENCES public.groups(id),
    subject_id INTEGER NOT NULL REFERENCES public.subjects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Attendances (Asistencias)
CREATE TABLE public.attendances (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES public.students(id),
    user_id INTEGER NOT NULL REFERENCES public.users(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Tabla de Grades (Calificaciones para cada parcial)
CREATE TABLE public.grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES public.students(id),
    subject_id INTEGER NOT NULL REFERENCES public.subjects(id),
    user_id INTEGER NOT NULL REFERENCES public.users(id),
    partial1_attendance NUMERIC(5, 2),
    partial1_activities NUMERIC(5, 2),
    partial1_project NUMERIC(5, 2),
    partial1_exam NUMERIC(5, 2),
    partial2_attendance NUMERIC(5, 2),
    partial2_activities NUMERIC(5, 2),
    partial2_project NUMERIC(5, 2),
    partial2_exam NUMERIC(5, 2),
    partial3_attendance NUMERIC(5, 2),
    partial3_activities NUMERIC(5, 2),
    partial3_project NUMERIC(5, 2),
    partial3_exam NUMERIC(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
