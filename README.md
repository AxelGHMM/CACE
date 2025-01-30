# CACE (Control de Asistencias y Calificaciones Express) WIP

## Descripción General
Este proyecto es una aplicación web que busca dar mejor control sobre asistencias y calificaciones para los usuarios que la utilicen.


## Tecnologías Utilizadas

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, JWT
- **Base de datos:** PostgreSQL
- **Gestor de contenedores:** Docker
- **Middleware:** Cors, dotenv



## Estructura del Proyecto

```plaintext
.
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   └── app.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── context
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── schema.sql
└── .env
```



## Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/AxelGHMM/CACE
cd CACE
```

### 2. Configurar las variables de entorno
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Configuración del backend
BACKEND_PORT=5000
JWT_SECRET=<LLAVE_SECRETA>

# Configuración de PostgreSQL
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mydb
DB_PORT=5432

# Configuración del frontend
VITE_API_BASE_URL=http://<IP_DEL_BACKEND>:5000/api
```

Reemplaza `<LLAVE_SECRETA>` y `<IP_DEL_BACKEND>` con tus valores.

### 3. Instalar dependencias
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd frontend
npm install
```

### 4. Iniciar los contenedores Docker
Asegúrate de tener Docker instalado y ejecuta:
```bash
docker-compose up --build
```
Esto iniciará los servicios:
- PostgreSQL en el puerto `5432`
- Backend en el puerto `5000`
- Frontend en el puerto `3000`

## Diseño de la Base de Datos

El archivo `schema.sql` contiene la estructura de la base de datos. La tabla `users` es la principal y contiene los siguientes campos funcionales por el momento:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

El archivo `schema.sql` debe estar ubicado en la raíz del proyecto para que Docker Compose lo use al iniciar el contenedor de PostgreSQL.




## Uso de la Aplicación

### 1. Registro de Usuarios
Envía una petición POST a `/api/users/register` con el siguiente JSON:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

### 2. Inicio de Sesión
Envía una petición POST a `/api/users/login` con:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Recibirás un token JWT si las credenciales son correctas.

### 3. Acceso a Rutas Protegidas
Incluye el token JWT en el encabezado `Authorization`:
```
Authorization: Bearer <TOKEN>
```
Esto es necesario para acceder a rutas protegidas como `/api/dashboard`.



## Flujo de la Aplicación
1. **Frontend:**
   - Pantalla de login para usuarios.
   - Uso de React Router para la navegación.
   - Uso de Axios para hacer peticiones al backend.

2. **Backend:**
   - Endpoints REST para manejar usuarios.
   - Uso de JWT para proteger rutas.

3. **Base de datos:**
   - Almacena usuarios y roles.


## Características
- Registro e inicio de sesión con hashing de contraseñas mediante bcrypt.
- Rutas protegidas con middleware JWT.
- Arquitectura basada en contenedores con Docker Compose.



## Comandos útiles

### Construir e iniciar los contenedores
```bash
docker-compose up --build
```

### Detener los contenedores
```bash
docker-compose down
```

### Ver logs de un contenedor
```bash
docker logs <NOMBRE_DEL_CONTENEDOR>
```

### Acceder al contenedor PostgreSQL
```bash
docker exec -it postgres-container psql -U postgres -d mydb
```

