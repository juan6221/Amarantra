# Amaranta Backend

Backend separado para el proyecto Amaranta, construido con Node.js, Express y MongoDB.

## Instalación

1. Ir a la carpeta `backend`
2. Ejecutar `npm install`
3. Crear un archivo `.env` basado en `.env.example`
4. Ejecutar `npm run dev`

## Rutas principales

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/recover-password`
- `GET /api/usuarios`
- `GET /api/roles`
- `GET /api/clientes`
- `GET /api/categorias`
- `GET /api/productos`
- `GET /api/ventas`
- `GET /api/perfil`

## Notas

- La conexión a la base de datos se realiza con MongoDB usando `MONGO_URI`.
- El backend está separado del frontend en la carpeta `backend`.
