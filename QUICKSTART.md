# Amaranta - Sistema de Gestión de Ventas

Sistema completo de gestión de ventas con frontend React + Vite y backend Node.js + Express + MongoDB.

## 📋 Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación Rápida con Docker](#instalación-rápida-con-docker)
- [Instalación Manual](#instalación-manual)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Credenciales de Demostración](#credenciales-de-demostración)
- [Troubleshooting](#troubleshooting)

## 📦 Requisitos

### Opción 1: Docker (Recomendado)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Opción 2: Instalación Manual
- Node.js 18+ ([Descargar](https://nodejs.org/))
- MongoDB 7+ ([Descargar](https://www.mongodb.com/try/download/community) o usar [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm (incluido con Node.js)

## 🚀 Instalación Rápida con Docker

### 1. Inicia los servicios
```bash
docker-compose up -d
```

Este comando levantará:
- MongoDB en puerto 27017
- Backend en puerto 5000
- Base de datos se inicializará automáticamente con roles, usuarios y productos de demostración

### 2. Instala dependencias del frontend
```bash
npm install
```

### 3. Configura variables de entorno del frontend
Crea un archivo `.env` en la raíz:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Inicia el servidor de desarrollo del frontend
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 5. Accede con las credenciales de demostración
- Email: `admin@amaranta.com`
- Password: `123456`

## 🛠️ Instalación Manual

### Backend

#### 1. Configura MongoDB
**Opción A: MongoDB Atlas (Cloud)**
1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta y un cluster gratuito
3. Obtén tu connection string (MongoDB URI)

**Opción B: MongoDB Local**
```bash
# macOS (con Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install -y mongodb

# Windows
# Descarga desde https://www.mongodb.com/try/download/community
# O usa: choco install mongodb (con Chocolatey)
```

#### 2. Instala dependencias del backend
```bash
cd backend
npm install
```

#### 3. Configura variables de entorno del backend
Crea un archivo `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/amaranta
JWT_SECRET=tu_secreto_jwt_super_seguro_12345
NODE_ENV=development
```

Si usas MongoDB Atlas, el MONGO_URI será similar a:
```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/amaranta?retryWrites=true&w=majority
```

#### 4. Inicia el backend
```bash
# En la carpeta backend/
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### Frontend

#### 1. Instala dependencias
```bash
# En la raíz del proyecto
npm install
```

#### 2. Configura variables de entorno
Crea un archivo `.env` en la raíz:
```env
VITE_API_URL=http://localhost:5000
```

#### 3. Inicia el servidor de desarrollo
```bash
npm run dev
```

Accede a `http://localhost:5173`

## 📁 Estructura del Proyecto

```
amaranta/
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes compartidos
│   │   ├── features/            # Módulos por característica
│   │   │   ├── auth/           # Autenticación
│   │   │   ├── dashboard/      # Dashboard
│   │   │   ├── usuarios/       # Gestión de usuarios
│   │   │   ├── roles/          # Gestión de roles
│   │   │   ├── productos/      # Gestión de productos
│   │   │   ├── categorias/     # Gestión de categorías
│   │   │   ├── clientes/       # Gestión de clientes
│   │   │   ├── ventas/         # Gestión de ventas
│   │   │   └── perfil/         # Perfil de usuario
│   │   ├── lib/                 # Utilidades (API client)
│   │   ├── store/               # Estado global (Zustand)
│   │   ├── data/                # Datos mock
│   │   ├── utils/               # Funciones auxiliares
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/              # Configuración de BD
│   │   ├── models/              # Esquemas MongoDB
│   │   ├── controllers/         # Lógica de negocio
│   │   ├── routes/              # Rutas API
│   │   ├── middlewares/         # Middlewares (auth, etc)
│   │   ├── utils/               # Funciones auxiliares
│   │   └── server.js            # Entrada principal
│   ├── mongodb-init/            # Scripts inicialización BD
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml           # Orquestación de servicios
└── package.json                 # Dependencias frontend
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Inicia sesión y obtiene JWT
- `POST /api/auth/recover-password` - Inicia recuperación de contraseña
- `PUT /api/auth/reset-password` - Resetea contraseña

### Usuarios (requiere admin)
- `GET /api/usuarios` - Lista todos los usuarios
- `POST /api/usuarios` - Crea un nuevo usuario
- `PUT /api/usuarios/:id` - Actualiza un usuario
- `DELETE /api/usuarios/:id` - Elimina un usuario
- `PUT /api/usuarios/:id/role` - Actualiza rol de un usuario

### Perfil
- `GET /api/perfil` - Obtiene perfil del usuario autenticado
- `PUT /api/perfil` - Actualiza perfil y contraseña

### Roles (requiere admin)
- `GET /api/roles` - Lista todos los roles
- `POST /api/roles` - Crea un nuevo rol
- `PUT /api/roles/:id` - Actualiza un rol
- `DELETE /api/roles/:id` - Elimina un rol

### Categorías
- `GET /api/categorias` - Lista todas las categorías
- `POST /api/categorias` - Crea una categoría (requiere admin)
- `PUT /api/categorias/:id` - Actualiza una categoría (requiere admin)
- `DELETE /api/categorias/:id` - Elimina una categoría (requiere admin)

### Productos
- `GET /api/productos` - Lista todos los productos
- `POST /api/productos` - Crea un producto (requiere admin)
- `PUT /api/productos/:id` - Actualiza un producto (requiere admin)
- `DELETE /api/productos/:id` - Elimina un producto (requiere admin)

### Clientes
- `GET /api/clientes` - Lista todos los clientes
- `POST /api/clientes` - Crea un cliente
- `PUT /api/clientes/:id` - Actualiza un cliente
- `DELETE /api/clientes/:id` - Elimina un cliente

### Ventas
- `GET /api/ventas` - Lista ventas (admin ve todas, vendedor ve sus propias)
- `POST /api/ventas` - Registra una nueva venta
- `PUT /api/ventas/:id` - Actualiza una venta

## 👤 Credenciales de Demostración

Después de iniciar con Docker Compose, puedes usar:

```
Email: admin@amaranta.com
Contraseña: 123456

Email: vendedor@amaranta.com
Contraseña: 123456
```

Para crear nuevos usuarios, inicia sesión como admin y usa el panel de usuarios.

## 🔒 Seguridad

- **Autenticación**: JWT (JSON Web Tokens)
- **Contraseñas**: Hasheadas con bcryptjs (10 salt rounds)
- **Autorización**: Role-based access control (admin/vendedor/gerente)
- **Headers**: CORS habilitado, Morgan logging activado

## 🐛 Troubleshooting

### Puerto 5000 en uso
```bash
# Busca qué proceso usa el puerto
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# O cambia el puerto en backend/.env
```

### Conexión a MongoDB fallida
```bash
# Verifica que MongoDB esté corriendo
# Docker: docker-compose logs mongodb
# Local: mongosh mongodb://localhost:27017/amaranta
```

### Frontend no puede conectar al backend
- Verifica que el backend esté corriendo en puerto 5000
- Revisa la variable `VITE_API_URL` en tu `.env`
- Revisa la consola del navegador (F12) para errores de CORS

### Limpiar Docker y reiniciar
```bash
docker-compose down -v
docker-compose up -d
```

## 📝 Scripts Útiles

### Frontend
```bash
npm run dev      # Inicia servidor desarrollo
npm run build    # Compila para producción
npm run preview  # Vista previa de build
npm run lint     # Ejecuta ESLint
```

### Backend
```bash
npm run dev      # Inicia con nodemon (auto-reload)
npm run start    # Inicia en producción
```

## 📚 Documentación Adicional

- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guía detallada de desarrollo
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)

## 🤝 Contribuir

Para contribuir al proyecto:

1. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
2. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

**Desarrollado con ❤️ para Amaranta**
