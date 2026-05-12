# Amaranta — Sistema de Gestión de Tabacos

Plataforma web fullstack para gestión de inventario, ventas y catálogo de productos de tabaco de lujo. Incluye roles diferenciados, módulos CRUD completos y dashboard con estadísticas en tiempo real.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS v3 |
| Routing | React Router DOM v6 |
| Estado global | Zustand (persistido en localStorage) |
| Base de datos | Supabase (PostgreSQL) |
| Gráficas | Recharts |
| Formularios | React Hook Form |
| Deploy frontend | Vercel |

---

## Arquitectura

```
Usuario (navegador)
       │
       ▼
  Vercel — Frontend React
  │   Variables de entorno bakeadas en build time:
  │   VITE_SUPABASE_URL
  │   VITE_SUPABASE_ANON_KEY
       │
       ▼
  Supabase — PostgreSQL
  ├── usuarios
  ├── categorias
  ├── productos
  ├── ventas
  └── venta_items
```

---

## Estructura de carpetas

```
src/
├── features/
│   ├── landing/          # Página pública + catálogo
│   │   ├── components/   # Navbar, ProductCard, ProductDetailModal
│   │   └── pages/        # LandingPage
│   ├── auth/
│   │   └── pages/        # LoginPage
│   ├── dashboard/
│   │   ├── hooks/        # (stats calculadas desde ventas/productos)
│   │   └── pages/        # DashboardPage — gráficas Recharts
│   ├── usuarios/
│   │   ├── hooks/        # useUsuarios — CRUD contra Supabase
│   │   └── pages/        # UsuariosPage
│   ├── productos/
│   │   ├── hooks/        # useProductos, useCategorias
│   │   └── pages/        # ProductosPage, CategoriasPage
│   └── ventas/
│       ├── hooks/        # useVentas — carrito + historial
│       └── pages/        # VentasPage
└── shared/
    ├── components/       # Sidebar, AppLayout, Modal, ConfirmDialog,
    │                     # ProtectedRoute, AmarantaLogo, LoadingSpinner
    ├── lib/
    │   └── supabase.js   # Cliente Supabase inicializado
    └── store/
        └── useStore.js   # useAuthStore (Zustand + persist)
```

---

## Base de datos

### Tablas

```sql
usuarios     — id, nombre, email, password, rol, activo, created_at
categorias   — id, nombre, descripcion, imagen, activo, created_at
productos    — id, categoria_id, nombre, descripcion, precio,
               stock, activo, imagenes (jsonb), created_at
ventas       — id, usuario_id, total, estado, fecha
venta_items  — id, venta_id, producto_id, cantidad, precio
```

### RLS (Row Level Security)
Todas las tablas tienen RLS habilitado con políticas públicas para la `anon key`:
```sql
create policy "public_all" on <tabla> for all using (true) with check (true);
```

---

## Roles y acceso

| Módulo | Admin | Tendero |
|--------|-------|---------|
| Landing (pública) | ✓ | ✓ |
| Login | ✓ | ✓ |
| Dashboard | ✓ | — |
| Usuarios (CRUD) | ✓ | — |
| Categorías (CRUD) | ✓ | — |
| Productos (CRUD) | ✓ | Solo lectura |
| Ventas | ✓ | ✓ |
| Historial de ventas | Todas | Solo las propias |

---

## Flujo de autenticación

```
1. Usuario ingresa email + contraseña en /login
2. useAuthStore.login() consulta la tabla "usuarios" en Supabase
3. Verifica email + password + activo = true
4. Si hay coincidencia → guarda usuario en Zustand (localStorage)
5. Redirige según rol:
   - admin   → /app/dashboard
   - tendero → /app/ventas
6. ProtectedRoute bloquea rutas según rol en cada navegación
```

---

## Flujo de una venta

```
1. Tendero/Admin selecciona productos del catálogo
2. Se arma el carrito local (estado React)
3. Al procesar → addVenta():
   a. INSERT en tabla "ventas"
   b. INSERT de cada ítem en "venta_items"
   c. UPDATE stock de cada producto (stock - cantidad)
4. Modal de confirmación con el total
5. Catálogo se actualiza reflejando el nuevo stock
```

---

## Variables de entorno

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...   # JWT anon key (NO la Publishable key sb_*)
```

> Las variables deben configurarse en **Vercel → Settings → Environment Variables** y hacer Redeploy. Vite las hornea en el bundle en tiempo de build, no en runtime.

---

## Instalación y desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/amaranta.git
cd amaranta

# 2. Instalar dependencias
npm install

# 3. Crear archivo de variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Arrancar servidor de desarrollo
npm run dev
# → http://localhost:5173
```

---

## Deploy

### Vercel (frontend)
1. Conectar repositorio GitHub en vercel.com
2. Agregar variables de entorno en Settings → Environment Variables
3. Build Command: `npm run build` — Output Directory: `dist`
4. El archivo `vercel.json` ya incluye la regla de rewrite para SPA routing

### Base de datos (Supabase)
1. Crear proyecto en supabase.com
2. Ejecutar el SQL de creación de tablas y RLS en el SQL Editor
3. Ejecutar el SQL de datos seed (usuarios demo + productos)
4. Copiar Project URL y JWT anon key al `.env` y a Vercel

---

## Cuentas demo

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@amaranta.com | admin123 |
| Tendero | maria@amaranta.com | tendero123 |
| Tendero | carlos@amaranta.com | tendero123 |
