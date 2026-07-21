# Amaranta — Sistema de Gestión de Tabacos

Plataforma web **fullstack completa** para gestión de inventario, ventas y catálogo de productos de tabaco de lujo. Incluye roles diferenciados, módulos CRUD completos, dashboard con estadísticas en tiempo real y autenticación JWT.

**⚡ Completamente integrada:** Frontend React + Backend Node.js + MongoDB

---

## 🚀 Inicio Rápido

**Windows:**
```bash
START.bat
npm run dev
```

**macOS/Linux:**
```bash
bash START.sh
npm run dev
```

Luego abre: **http://localhost:5173**

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router v6 |
| Backend API | Node.js + Express 4 |
| Base de datos | MongoDB 7 + Mongoose |
| Autenticación | JWT + Bearer tokens + bcryptjs |
| Estilos | Tailwind CSS v3 |
| Estado global | Zustand + localStorage |
| Gráficas | Recharts |
| Formularios | React Hook Form |
| Contenedores | Docker + Docker Compose |
| Documentación | Markdown completa

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Navegador)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │   React 18 + Vite + React Router │
        │  (http://localhost:5173)          │
        │  • Componentes reutilizables      │
        │  • 9 módulos de features          │
        │  • Zustand + localStorage         │
        └──────────┬───────────────────────┘
                   │ API HTTP + JWT Bearer
                   ▼
        ┌──────────────────────────────────┐
        │   Node.js + Express Backend      │
        │  (http://localhost:5000)         │
        │  • 8 módulos de rutas            │
        │  • Middleware JWT + roles        │
        │  • Validaciones de integridad    │
        └──────────┬───────────────────────┘
                   │ Mongoose ODM
                   ▼
        ┌──────────────────────────────────┐
        │      MongoDB Database            │
        │  (localhost:27017/amaranta)      │
        │  • 6 colecciones                 │
        │  • Relaciones ObjectId           │
        │  • Índices y validaciones        │
        └──────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
amaranta/
├── src/                          # Frontend React
│   ├── components/               # 11 componentes reutilizables
│   ├── features/                 # 9 módulos por característica
│   │   ├── auth/                 # Autenticación JWT
│   │   ├── dashboard/            # Estadísticas en tiempo real
│   │   ├── usuarios/             # CRUD de usuarios (admin)
│   │   ├── roles/                # CRUD de roles (admin)
│   │   ├── productos/            # CRUD de productos + categorías
│   │   ├── clientes/             # Gestión de clientes
│   │   ├── ventas/               # Registro y historial de ventas
│   │   ├── perfil/               # Perfil y cambio de contraseña
│   │   └── landing/              # Catálogo público
│   ├── lib/
│   │   └── api.js                # Cliente HTTP centralizado
│   ├── store/
│   │   └── useStore.js           # Zustand auth + localStorage
│   ├── utils/                    # Funciones auxiliares
│   └── data/                     # Datos mock
│
├── backend/                      # API Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # MongoDB + Mongoose
│   │   ├── models/               # 6 esquemas Mongoose
│   │   ├── controllers/          # 8 controladores CRUD
│   │   ├── routes/               # 8 módulos de rutas
│   │   ├── middlewares/          # Auth, roles, errores
│   │   ├── utils/                # JWT, validaciones
│   │   └── server.js             # Punto de entrada
│   ├── mongodb-init/
│   │   └── init-db.js            # Script inicialización
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml            # Orquestación (MongoDB + Backend)
├── QUICKSTART.md                 # Guía rápida de 5 minutos
├── SETUP_COMPLETE.md             # Arquitectura detallada
├── DEVELOPMENT.md                # Guía para desarrolladores
├── ESTADO.md                     # Estado actual del proyecto
├── START.sh / START.bat          # Scripts de inicio rápido
└── [archivos de configuración]
```

---

## 🗄️ Base de Datos (MongoDB)

### Colecciones

```javascript
// users — Usuarios del sistema
{
  _id: ObjectId,
  nombre: String,
  email: String,
  password: String (bcrypt hashed),
  rol: ObjectId (ref: Role),
  activo: Boolean,
  telefono: String,
  createdAt: Date
}

// roles — Roles y permisos
{
  _id: ObjectId,
  nombre: String,       // "admin", "vendedor", "gerente"
  descripcion: String,
  permisos: [String],
  createdAt: Date
}

// categorias — Categorías de productos
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  activo: Boolean,
  createdAt: Date
}

// productos — Catálogo de productos
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number,
  categoria: ObjectId (ref: Categoria),
  imagenes: [String],
  activo: Boolean,
  createdAt: Date
}

// clientes — Clientes
{
  _id: ObjectId,
  nombre: String,
  email: String,
  telefono: String,
  direccion: String,
  ciudad: String,
  activo: Boolean,
  createdAt: Date
}

// ventas — Registro de ventas
{
  _id: ObjectId,
  usuario: ObjectId (ref: User),
  cliente: ObjectId (ref: Cliente, nullable),
  items: [{
    producto: ObjectId (ref: Producto),
    cantidad: Number,
    precio: Number
  }],
  total: Number,
  pago: String,        // "efectivo", "tarjeta", "transferencia"
  estado: String,      // "pendiente", "completada", "cancelada"
  fecha: Date,
  createdAt: Date
}
```

---

## 🔐 Seguridad y Roles

### Tipos de Rol

| Rol | Permisos |
|-----|----------|
| **admin** | Acceso total: usuarios, roles, categorías, productos, clientes, todas las ventas |
| **vendedor** | Crear/editar clientes, crear ventas, ver solo sus ventas |
| **gerente** | Similar a admin pero con restricciones en usuarios |

### Control de Acceso por Módulo

| Módulo | Admin | Vendedor | Gerente |
|--------|-------|----------|---------|
| Dashboard | ✓ | — | ✓ |
| Usuarios | ✓ CRUD | — | Solo lectura |
| Roles | ✓ CRUD | — | — |
| Categorías | ✓ CRUD | Lectura | Lectura |
| Productos | ✓ CRUD | Lectura | Lectura |
| Clientes | ✓ CRUD | ✓ CRUD | ✓ CRUD |
| Ventas | ✓ Todas | ✓ Sus ventas | ✓ Todas |
| Perfil | ✓ | ✓ | ✓ |

### Seguridad de Autenticación

- **JWT Tokens** con expiración configurable (24h recomendado)
- **Bearer Authentication** en header `Authorization`
- **Hashing de contraseñas** con bcryptjs (10 salt rounds)
- **Middleware de autorización** por rol en cada endpoint protegido
- **Rutas protegidas** en frontend con ProtectedRoute component
- **Persistencia de sesión** con localStorage + Zustand

---

## 🔑 Flujo de Autenticación

```
┌──────────────────────────────────────────┐
│  1. Usuario visita /login                │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  2. Ingresa email + contraseña           │
│     LoginPage.jsx → store.login()        │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  3. POST /api/auth/login (backend)       │
│     • Busca usuario por email            │
│     • bcryptjs.compare(password)         │
│     • Verifica activo = true             │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  4. Response con JWT token               │
│     {                                    │
│       token: "eyJhbGciOi...",           │
│       user: { _id, nombre, rol, ... }   │
│     }                                    │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  5. Token guardado en:                   │
│     • Zustand store                      │
│     • localStorage (persistencia)        │
│     • Header Authorization (futuras req) │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  6. Redirección automática según rol:    │
│     • admin    → /app/dashboard          │
│     • vendedor → /app/ventas             │
│     • gerente  → /app/dashboard          │
└──────────────────────────────────────────┘
```

### Endpoints de Autenticación

```javascript
POST /api/auth/login
{
  email: "admin@amaranta.com",
  password: "123456"
}
// → { token, user }

POST /api/auth/recover-password
{
  email: "admin@amaranta.com"
}
// → Email de recuperación enviado

PUT /api/auth/reset-password
{
  token: "...",
  newPassword: "nueva-contraseña"
}
```

---

## 💰 Flujo de Ventas

```
┌────────────────────────────────────────┐
│  1. Usuario visita catálogo             │
│     (LandingPage o ProductosPage)       │
└────────────────────┬───────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│  2. Selecciona productos y cantidades   │
│     (Carrito temporal en estado React)  │
└────────────────────┬───────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│  3. Opcionalmente selecciona cliente    │
│     (dropdown de clientes existentes)   │
└────────────────────┬───────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│  4. Procesa venta: POST /api/ventas     │
│     {                                   │
│       cliente: ObjectId (nullable),     │
│       items: [                          │
│         { producto: ObjectId, ... }     │
│       ],                                │
│       total: 123.45,                    │
│       pago: "efectivo"                  │
│     }                                   │
└────────────────────┬───────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│  5. Backend crea documento venta en BD: │
│     • INSERT en colección "ventas"      │
│     • Calcula total desde items         │
│     • Asocia usuario_id del token JWT   │
└────────────────────┬───────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│  6. Response con factura:               │
│     {                                   │
│       _id: "...",                       │
│       total: 123.45,                    │
│       items: [...],                     │
│       fecha: "2026-05-26"               │
│     }                                   │
└────────────────────┬───────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│  7. Frontend genera PDF de factura      │
│     (html2canvas + jsPDF)               │
└────────────────────────────────────────┘
```

### Notas importantes

- El **stock no se decrementa automáticamente** (responsabilidad del negocio)
- Cliente es **nullable** (ventas sin cliente específico)
- Cada usuario solo ve **sus propias ventas** (no-admin)
- Admin ve **todas las ventas** del sistema

---

## ⚙️ Variables de Entorno

### Frontend (`.env` en raíz)
```env
# URL del backend API
VITE_API_URL=http://localhost:5000
```

### Backend (`backend/.env`)
```env
# Puerto del servidor
PORT=5000

# MongoDB local
MONGO_URI=mongodb://localhost:27017/amaranta

# O MongoDB Atlas (cloud)
# MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/amaranta

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_prod

# Environment
NODE_ENV=development
```

> Las variables se cargan automáticamente con **dotenv** en el backend y **Vite** en el frontend

---

## 📦 Instalación y Desarrollo Local

### Opción 1: Docker Compose (Recomendado - Automático)

```bash
# 1. Levanta MongoDB + Backend automáticamente
docker-compose up -d

# 2. Instala dependencias frontend
npm install

# 3. Configura archivo .env
echo "VITE_API_URL=http://localhost:5000" > .env

# 4. Inicia frontend
npm run dev

# → Frontend en http://localhost:5173
# → Backend en http://localhost:5000
# → MongoDB en mongodb://localhost:27017/amaranta
```

### Opción 2: Instalación Manual

**Backend:**
```bash
cd backend
npm install

# Edita .env con tus valores (MongoDB local o Atlas)
nano .env

npm run dev
# → Backend corriendo en http://localhost:5000
```

**Frontend (en otra terminal):**
```bash
npm install

# Copia .env.example a .env y edita
cp .env.example .env

npm run dev
# → Frontend en http://localhost:5173
```

### Verificar que todo funciona

```bash
# Frontend compila sin errores
npm run build
# → dist/ folder

# Backend inicia sin errores
cd backend && npm run dev
# → "Server running on port 5000"

# Prueba autenticación
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amaranta.com","password":"123456"}'
# → { "token": "eyJ...", "user": {...} }
```

---

## 🌐 Deployment

### Frontend

**Vercel:**
```bash
npm install -g vercel
vercel login
vercel

# En Settings → Environment Variables, agregar:
# VITE_API_URL=https://tu-backend.com
```

**Netlify:**
```bash
npm run build
# Arrastra la carpeta dist/ a Netlify.com
# En Settings → Environment → Build environment variables:
# VITE_API_URL=https://tu-backend.com
```

### Backend

**Render.com:** (Recomendado)
1. Push código a GitHub
2. Conectar repo en render.com
3. Crear "Web Service" desde rama `main`
4. Environment variables:
   - `MONGO_URI` → MongoDB Atlas connection string
   - `JWT_SECRET` → secret seguro
   - `NODE_ENV` → `production`
5. Deploy automático en cada push

**Railway.app:**
1. Conectar GitHub
2. Crear Web Service
3. Setear variables de entorno
4. Deploy automático

**Heroku (legacy):**
```bash
heroku create amaranta-backend
git push heroku main
heroku config:set MONGO_URI=<tu_mongodb_uri>
heroku config:set JWT_SECRET=<tu_secreto>
```

### Base de Datos

**MongoDB Atlas** (Recomendado para producción):
1. Crear cuenta en mongodb.com
2. Crear cluster gratuito
3. Copiar connection string
4. Setearlo como `MONGO_URI` en backend

**MongoDB local:**
```bash
# macOS (Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb

# Windows
# Descargar desde mongodb.com o usar Chocolatey
```

---

## � Documentación Completa

1. **[QUICKSTART.md](./QUICKSTART.md)** - Guía de 5 minutos para empezar
2. **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Resumen de arquitectura y estructura
3. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guía detallada para desarrolladores
4. **[ESTADO.md](./ESTADO.md)** - Estado actual y características implementadas
5. **[backend/README.md](./backend/README.md)** - Documentación de API endpoints

---

## 🐛 Troubleshooting

### Puerto 5000 en uso
```bash
# Busca qué proceso lo usa
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Y cambia PORT en backend/.env
```

### MongoDB no responde
```bash
# Verifica que MongoDB esté corriendo
docker-compose logs mongodb

# O si lo instalaste local:
mongosh mongodb://localhost:27017/amaranta
```

### Frontend no conecta con backend
- Verifica `VITE_API_URL` en `.env`
- Verifica que backend esté corriendo: `curl http://localhost:5000/api/auth/...`
- Revisa console del navegador (F12) para errores de CORS

### Errores de build
```bash
# Limpia y reinstala dependencias
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## ✨ Características Implementadas

- ✅ Autenticación JWT con roles
- ✅ CRUD completo para todos los módulos
- ✅ Validación de integridad referencial
- ✅ Generación de facturas PDF
- ✅ Dashboard con gráficas en tiempo real
- ✅ Persistencia de sesión con localStorage
- ✅ API REST documentada
- ✅ Docker Compose para desarrollo fácil
- ✅ Estilos responsivos con Tailwind CSS
- ✅ Manejo centralizado de errores

---

## 📦 Dependencias Principales

### Frontend
- react@18, vite@8, react-router-dom@6
- zustand, react-hook-form, recharts, html2canvas

### Backend
- express, mongoose, jsonwebtoken, bcryptjs, cors, morgan

---

## 🤝 Contribuir

1. Fork el repo
2. Crea rama: `git checkout -b feature/MiFeature`
3. Commit: `git commit -m "Añade MiFeature"`
4. Push: `git push origin feature/MiFeature`
5. Abre Pull Request

---

## 📄 Licencia

MIT

---

## �👥 Cuentas de Demostración

Automáticamente creadas cuando inicia Docker Compose:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| **Administrador** | admin@amaranta.com | 123456 |
| **Vendedor** | vendedor@amaranta.com | 123456 |

> ⚠️ **Importante:** Cambía estas contraseñas en producción. Las credenciales iniciales son solo para pruebas.

### Crear nuevos usuarios

Como **admin**, ve a **Gestión de Usuarios** → **Crear Usuario**:
```javascript
{
  nombre: "Juan Pérez",
  email: "juan@amaranta.com",
  contraseña: "nueva-contraseña",
  rol: "vendedor"  // O "gerente", "admin"
}
```
