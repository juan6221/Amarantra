# Amaranta — Sistema de Gestión de Tabacos

Plataforma web fullstack para gestión de inventario, ventas y catálogo de productos de tabaco de lujo.

## 📋 Requisitos previos

- Node.js v18+
- MongoDB v4.4+ (local o Atlas)
- Git

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd amaranta
```

### 2. Configurar el Backend

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/amaranta
JWT_SECRET=misupersecretojwt
```

Si usas MongoDB Atlas, reemplaza `MONGO_URI`:

```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.mongodb.net/amaranta
```

Instala dependencias del backend:

```bash
npm install
```

### 3. Configurar el Frontend

En la raíz del proyecto, crea `.env` o `.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

Instala dependencias del frontend:

```bash
npm install
```

## 🎯 Desarrollo local

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Terminal 2: Frontend

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔑 Credenciales de demostración

Antes de usar la aplicación, necesitas crear un usuario admin. Puedes hacer una solicitud POST:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Administrador",
    "email": "admin@amaranta.com",
    "password": "admin123",
    "rol": "admin"
  }'
```

Luego inicia sesión con:
- **Email**: admin@amaranta.com
- **Contraseña**: admin123

## 📁 Estructura del proyecto

```
amaranta/
├── backend/                           # API REST con Express + MongoDB
│   ├── src/
│   │   ├── config/                    # Configuración de BD
│   │   ├── controllers/               # Lógica de negocio
│   │   ├── middlewares/               # Auth, roles, errores
│   │   ├── models/                    # Esquemas MongoDB
│   │   ├── routes/                    # Definición de endpoints
│   │   ├── utils/                     # Utilidades (JWT, etc)
│   │   └── server.js                  # Entrada del servidor
│   ├── .env.example
│   └── package.json
│
├── src/                               # Frontend React + Vite
│   ├── features/                      # Módulos por dominio
│   │   ├── auth/                      # Autenticación
│   │   ├── clientes/                  # Gestión de clientes
│   │   ├── dashboard/                 # Estadísticas
│   │   ├── landing/                   # Página pública
│   │   ├── perfil/                    # Perfil de usuario
│   │   ├── productos/                 # Catálogo + categorías
│   │   ├── roles/                     # Gestión de roles
│   │   ├── usuarios/                  # Gestión de usuarios
│   │   └── ventas/                    # Punto de venta
│   ├── components/                    # Componentes compartidos
│   ├── lib/                           # Cliente API + utilidades
│   ├── store/                         # Estado global (Zustand)
│   ├── utils/                         # Funciones útiles
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── README.md
```

## 🔄 Flujo de desarrollo

### Backend

1. **Autenticación**: Usa JWT en header `Authorization: Bearer <token>`
2. **Validaciones**: Los controladores validan datos antes de la BD
3. **Integridad referencial**: Previene eliminar datos con dependencias

### Frontend

1. **Gestión de estado**: Zustand + localStorage para persistencia
2. **Cliente HTTP**: `src/lib/api.js` maneja todas las peticiones
3. **Hooks personalizados**: Cada módulo tiene su propio hook REST
4. **Validación**: `react-hook-form` con Tailwind CSS

## 📦 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Base de datos | MongoDB + Mongoose |
| Estilos | Tailwind CSS v3 |
| Autenticación | JWT (jsonwebtoken) |
| Estado | Zustand |
| Validación | React Hook Form |
| Gráficas | Recharts |

## 🌐 Endpoints principales

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Crear usuario (admin)
- `POST /api/auth/recover-password` - Solicitar recuperación
- `PUT /api/auth/recover-password` - Restablecer contraseña

### Recursos protegidos (requieren token)

- `GET /api/usuarios` - Listar usuarios (admin)
- `POST /api/usuarios` - Crear usuario (admin)
- `PUT /api/usuarios/:id` - Actualizar usuario (admin)
- `DELETE /api/usuarios/:id` - Eliminar usuario (admin)

- `GET /api/roles` - Listar roles (admin)
- `POST /api/roles` - Crear rol (admin)
- `PUT /api/roles/:id` - Actualizar rol (admin)
- `DELETE /api/roles/:id` - Eliminar rol (admin)

- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente (admin)
- `PUT /api/clientes/:id` - Actualizar cliente (admin)
- `DELETE /api/clientes/:id` - Eliminar cliente (admin)

- `GET /api/categorias` - Listar categorías
- `POST /api/categorias` - Crear categoría (admin)
- `PUT /api/categorias/:id` - Actualizar categoría (admin)
- `DELETE /api/categorias/:id` - Eliminar categoría (admin)

- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto (admin)
- `PUT /api/productos/:id` - Actualizar producto (admin)
- `DELETE /api/productos/:id` - Eliminar producto (admin)

- `GET /api/ventas` - Historial de ventas
- `POST /api/ventas` - Crear venta
- `GET /api/ventas/:id` - Detalle de venta
- `DELETE /api/ventas/:id` - Eliminar venta

- `GET /api/perfil` - Obtener perfil del usuario
- `PUT /api/perfil` - Actualizar perfil

## 🛡️ Seguridad

- Contraseñas hasheadas con `bcryptjs`
- Tokens JWT con expiración de 12 horas
- Middleware de autenticación en rutas protegidas
- Validación de roles (admin/user)
- CORS habilitado

## 🐛 Troubleshooting

### Error de conexión a MongoDB

Asegúrate de que:
- MongoDB está corriendo (`mongod`)
- `MONGO_URI` es correcto en `backend/.env`
- Credenciales de Atlas son válidas

### Frontend no conecta con backend

Verifica:
- Backend está corriendo en puerto 5000
- `VITE_API_URL` apunta a `http://localhost:5000`
- No hay errores CORS (backend tiene CORS habilitado)

### Errores de compilación

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Notas

- La aplicación usa Zustand para persistencia en localStorage
- Cada módulo feature tiene sus propios hooks REST
- El frontend no depende de Supabase (ahora solo usa el backend)
- MongoDB puede ser local o en la nube (Atlas)

## 📄 Licencia

Propietario — Amaranta & Co.
