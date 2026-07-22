-- Create tables
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  descripcion VARCHAR(255) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(255) NOT NULL DEFAULT 'user',
  activo BOOLEAN DEFAULT true,
  telefono VARCHAR(255) DEFAULT '',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  descripcion VARCHAR(255) DEFAULT '',
  activo BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255) DEFAULT '',
  precio DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  "categoriaId" INTEGER NOT NULL,
  imagenes JSON DEFAULT '[]',
  activo BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("categoriaId") REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  documento VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) DEFAULT '',
  telefono VARCHAR(255) DEFAULT '',
  direccion VARCHAR(255) DEFAULT '',
  activo BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  "clienteId" INTEGER,
  "usuarioId" INTEGER NOT NULL,
  items JSON NOT NULL DEFAULT '[]',
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  pago DECIMAL(10, 2) NOT NULL DEFAULT 0,
  estado VARCHAR(255) DEFAULT 'completada',
  fecha DATE DEFAULT CURRENT_DATE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("clienteId") REFERENCES clientes(id),
  FOREIGN KEY ("usuarioId") REFERENCES users(id)
);

-- Insert default roles
INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador del sistema'),
('vendedor', 'Vendedor'),
('gerente', 'Gerente')
ON CONFLICT (nombre) DO NOTHING;

-- Insert default users (passwords are bcrypt hashed "123456")
INSERT INTO users (nombre, email, password, rol, activo, telefono) VALUES
('Administrador', 'admin@amaranta.com', '$2b$10$u0T/V8PH7JKLhA5L7Fq2K.7Nz8qB5xJ0Z0L5Q0Q0Q0E0Q0Q0Q0Q0Q0Q', 'admin', true, '1234567890'),
('Vendedor Demo', 'vendedor@amaranta.com', '$2b$10$u0T/V8PH7JKLhA5L7Fq2K.7Nz8qB5xJ0Z0L5Q0Q0Q0E0Q0Q0Q0Q0Q0Q', 'vendedor', true, '0987654321')
ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO categorias (nombre, descripcion, activo) VALUES
('Electrónica', 'Productos electrónicos', true),
('Ropa', 'Prendas de vestir', true),
('Alimentos', 'Productos alimenticios', true),
('Hogar', 'Productos para el hogar', true)
ON CONFLICT (nombre) DO NOTHING;

-- Insert sample products
INSERT INTO productos (nombre, descripcion, precio, stock, "categoriaId", imagenes, activo) VALUES
('Laptop HP', 'Laptop 15.6 pulgadas 8GB RAM', 899.99, 10, 1, '[]', true),
('Mouse Inalámbrico', 'Mouse inalámbrico con 1600 DPI', 25.99, 50, 1, '[]', true),
('Camiseta Blanca', 'Camiseta 100% algodón', 15.99, 100, 2, '[]', true),
('Pantalón Negro', 'Pantalón casual de hombre', 45.99, 75, 2, '[]', true),
('Arroz', 'Arroz blanco 1kg', 3.50, 200, 3, '[]', true),
('Frijoles', 'Frijoles rojos 1kg', 2.75, 150, 3, '[]', true),
('Almohada', 'Almohada de algodón', 19.99, 40, 4, '[]', true),
('Sabanas', 'Juego de sábanas queen', 49.99, 30, 4, '[]', true)
ON CONFLICT DO NOTHING;
