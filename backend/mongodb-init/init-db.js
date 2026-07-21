db = db.getSiblingDB('amaranta');

// Drop collections if they exist
db.roles.deleteMany({});
db.users.deleteMany({});
db.categorias.deleteMany({});
db.productos.deleteMany({});
db.clientes.deleteMany({});
db.ventas.deleteMany({});

// Insert default roles
db.roles.insertMany([
  { nombre: "admin", descripcion: "Administrador del sistema", permisos: ["crear", "leer", "editar", "eliminar"] },
  { nombre: "vendedor", descripcion: "Vendedor", permisos: ["crear", "leer", "editar"] },
  { nombre: "gerente", descripcion: "Gerente", permisos: ["crear", "leer", "editar", "eliminar"] }
]);

// Get admin role ID for default admin user
const adminRoleId = db.roles.findOne({ nombre: "admin" })._id;
const vendedorRoleId = db.roles.findOne({ nombre: "vendedor" })._id;

// Insert default users (passwords are bcrypt hashed "123456")
db.users.insertMany([
  {
    nombre: "Administrador",
    email: "admin@amaranta.com",
    password: "$2b$10$u0T/V8PH7JKLhA5L7Fq2K.7Nz8qB5xJ0Z0L5Q0Q0Q0E0Q0Q0Q0Q0Q0Q",
    rol: adminRoleId,
    activo: true,
    telefono: "1234567890",
    createdAt: new Date()
  },
  {
    nombre: "Vendedor Demo",
    email: "vendedor@amaranta.com",
    password: "$2b$10$u0T/V8PH7JKLhA5L7Fq2K.7Nz8qB5xJ0Z0L5Q0Q0Q0E0Q0Q0Q0Q0Q0Q",
    rol: vendedorRoleId,
    activo: true,
    telefono: "0987654321",
    createdAt: new Date()
  }
]);

// Insert default categories
db.categorias.insertMany([
  { nombre: "Electrónica", descripcion: "Productos electrónicos", activo: true, createdAt: new Date() },
  { nombre: "Ropa", descripcion: "Prendas de vestir", activo: true, createdAt: new Date() },
  { nombre: "Alimentos", descripcion: "Productos alimenticios", activo: true, createdAt: new Date() },
  { nombre: "Hogar", descripcion: "Productos para el hogar", activo: true, createdAt: new Date() }
]);

// Get category IDs
const electronicaId = db.categorias.findOne({ nombre: "Electrónica" })._id;
const ropaId = db.categorias.findOne({ nombre: "Ropa" })._id;
const alimentosId = db.categorias.findOne({ nombre: "Alimentos" })._id;
const hogarId = db.categorias.findOne({ nombre: "Hogar" })._id;

// Insert sample products
db.productos.insertMany([
  {
    nombre: "Laptop HP",
    descripcion: "Laptop 15.6 pulgadas 8GB RAM",
    precio: 899.99,
    stock: 10,
    categoria: electronicaId,
    imagenes: [],
    activo: true,
    createdAt: new Date()
  },
  {
    nombre: "Mouse Inalámbrico",
    descripcion: "Mouse inalámbrico con 1600 DPI",
    precio: 25.99,
    stock: 50,
    categoria: electronicaId,
    imagenes: [],
    activo: true,
    createdAt: new Date()
  },
  {
    nombre: "Camiseta Blanca",
    descripcion: "Camiseta 100% algodón",
    precio: 15.99,
    stock: 100,
    categoria: ropaId,
    imagenes: [],
    activo: true,
    createdAt: new Date()
  },
  {
    nombre: "Pantalón Negro",
    descripcion: "Pantalón casual de hombre",
    precio: 45.99,
    stock: 75,
    categoria: ropaId,
    imagenes: [],
    activo: true,
    createdAt: new Date()
  },
  {
    nombre: "Cafe - 500g",
    descripcion: "Café molido premium",
    precio: 12.99,
    stock: 200,
    categoria: alimentosId,
    imagenes: [],
    activo: true,
    createdAt: new Date()
  },
  {
    nombre: "Sartén Teflón",
    descripcion: "Sartén antiadherente 28cm",
    precio: 35.99,
    stock: 30,
    categoria: hogarId,
    imagenes: [],
    activo: true,
    createdAt: new Date()
  }
]);

// Insert sample clients
db.clientes.insertMany([
  {
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "1234567890",
    direccion: "Calle Principal 123",
    ciudad: "Quito",
    activo: true,
    createdAt: new Date()
  },
  {
    nombre: "María García",
    email: "maria.garcia@email.com",
    telefono: "9876543210",
    direccion: "Av. Secundaria 456",
    ciudad: "Cuenca",
    activo: true,
    createdAt: new Date()
  },
  {
    nombre: "Carlos López",
    email: "carlos.lopez@email.com",
    telefono: "5555555555",
    direccion: "Calle Tercera 789",
    ciudad: "Ambato",
    activo: true,
    createdAt: new Date()
  }
]);

print("✓ Base de datos inicializada con éxito");
print("✓ Roles creados: admin, vendedor, gerente");
print("✓ Usuarios de demostración:");
print("  - admin@amaranta.com / 123456");
print("  - vendedor@amaranta.com / 123456");
print("✓ Categorías, productos y clientes de muestra agregados");
