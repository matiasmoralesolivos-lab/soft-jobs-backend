# Soft Jobs — Backend
<a href="https://soft-jobs-frontend-j0im.onrender.com" target="_blank">Ver aplicación online</a>

API REST desarrollada con Node.js, Express y PostgreSQL para la plataforma Soft Jobs.

## Tecnologías

* Node.js
* Express
* PostgreSQL
* JWT
* bcrypt
* CORS
* dotenv

## Funcionalidades

* Registro de usuarios.
* Encriptación de contraseñas mediante bcrypt.
* Inicio de sesión mediante JWT.
* Autenticación mediante token.
* Consulta de información del usuario autenticado.
* Middleware para validación de credenciales y JWT.
* Registro de solicitudes en consola.
* Manejo de errores.

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=softjobs
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secret
```

Crear la tabla `usuarios` en PostgreSQL:

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    rol VARCHAR(25),
    lenguage VARCHAR(20)
);
```

## Ejecución

Para desarrollo:

```bash
npm run dev
```

Para ejecutar el servidor:

```bash
npm start
```

El servidor utiliza el puerto definido en la variable `PORT` o, en su defecto, el puerto `3000`.

## Endpoints principales

| Método | Endpoint    | Descripción                               |
| ------ | ----------- | ----------------------------------------- |
| GET    | `/`         | Verifica el funcionamiento del servidor   |
| POST   | `/usuarios` | Registra un nuevo usuario                 |
| POST   | `/login`    | Autentica al usuario y entrega un JWT     |
| GET    | `/usuarios` | Obtiene los datos del usuario autenticado |

## Autenticación

Para acceder a las rutas protegidas se debe enviar el token mediante el header:

```text
Authorization: Bearer <token>
```

Las variables de entorno no se incluyen en el repositorio.

