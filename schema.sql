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

-- Establecer el esquema por defecto
SET search_path TO public;

-- 🔹 1️⃣ Crear primero las tablas base sin dependencias

-- Tabla de Groups (Grupos) ✅
CREATE TABLE public.groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de Users (Profesores y Admins) ✅
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'professor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de Subjects (Materias) ✅
CREATE TABLE public.subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 🔹 2️⃣ Ahora crear las tablas que dependen de las anteriores

-- Tabla de Students (Alumnos) ✅
CREATE TABLE public.students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    matricula VARCHAR(50) NOT NULL UNIQUE,
    group_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE
);

-- Tabla de Assignments (Relación entre Users, Groups y Subjects) ✅
CREATE TABLE public.assignments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE
);

-- Tabla de Attendances (Asistencias) ✅
CREATE TABLE public.attendances (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Tabla de Grades (Calificaciones) ✅
CREATE TABLE public.grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    professor_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    partial INTEGER NOT NULL CHECK (partial BETWEEN 1 AND 3),
    activity_1 NUMERIC(5,2),
    activity_2 NUMERIC(5,2),
    attendance NUMERIC(5,2),
    project NUMERIC(5,2),
    exam NUMERIC(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES public.users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE
);

-- 🔹 3️⃣ Crear la función y triggers para actualizar `updated_at`

-- Crear función update_timestamp()
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar updated_at automáticamente
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_students
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_groups
BEFORE UPDATE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_subjects
BEFORE UPDATE ON public.subjects
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_assignments
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_attendances
BEFORE UPDATE ON public.attendances
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_timestamp_grades
BEFORE UPDATE ON public.grades
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
