export const CATEGORIAS = [
  { id: 1, nombre: 'Cigarros Premium', descripcion: 'Habanos y puros de alta gama', activo: true, imagen: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', createdAt: '2024-01-10' },
  { id: 2, nombre: 'Cigarrillos', descripcion: 'Marcas selectas de cigarrillos', activo: true, imagen: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400', createdAt: '2024-01-15' },
  { id: 3, nombre: 'Tabaco de Pipa', descripcion: 'Mezclas artesanales para pipa', activo: true, imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', createdAt: '2024-02-01' },
  { id: 4, nombre: 'Accesorios', descripcion: 'Cortadores, encendedores y humidores', activo: true, imagen: 'https://images.unsplash.com/photo-1599446294862-3a42bcce8e7b?w=400', createdAt: '2024-02-10' },
]

export const PRODUCTOS = [
  {
    id: 1, categoriaId: 1, nombre: 'Cohiba Siglo VI', precio: 380000, stock: 12, activo: true,
    descripcion: 'El emblema de los habanos cubanos. Capa colorado natural, fortaleza media-plena. Vitola Gran Corona de 150mm.',
    imagenes: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600',
      'https://images.unsplash.com/photo-1547496614-0b7c62c44a89?w=600',
    ],
    createdAt: '2024-01-20',
  },
  {
    id: 2, categoriaId: 1, nombre: 'Montecristo No. 2', precio: 220000, stock: 20, activo: true,
    descripcion: 'El torpedo más famoso del mundo. Capa natural oscura, notas de madera, cuero y especias. 156mm.',
    imagenes: [
      'https://images.unsplash.com/photo-1547496614-0b7c62c44a89?w=600',
    ],
    createdAt: '2024-01-25',
  },
  {
    id: 3, categoriaId: 1, nombre: 'Romeo y Julieta Churchill', precio: 195000, stock: 18, activo: true,
    descripcion: 'Vitola Churchill clásica. Perfil suave con notas florales y cedro. Ideal para el fumador elegante.',
    imagenes: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600',
    ],
    createdAt: '2024-02-05',
  },
  {
    id: 4, categoriaId: 1, nombre: 'Partagás Serie D No. 4', precio: 175000, stock: 25, activo: true,
    descripcion: 'Robusto cubano por excelencia. Fortaleza media-plena, notas terrosas y de cacao. 124mm.',
    imagenes: [
      'https://images.unsplash.com/photo-1547496614-0b7c62c44a89?w=600',
    ],
    createdAt: '2024-02-12',
  },
  {
    id: 5, categoriaId: 1, nombre: 'Arturo Fuente Opus X', precio: 290000, stock: 8, activo: true,
    descripcion: 'El habano dominicano más buscado del mundo. Capa colorado maduro, complejidad excepcional.',
    imagenes: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600',
    ],
    createdAt: '2024-02-20',
  },
  {
    id: 6, categoriaId: 2, nombre: 'Dunhill International', precio: 32000, stock: 60, activo: true,
    descripcion: 'Cigarrillo de lujo con filtro especial. Blend suave de tabacos Virginia y Burley seleccionados.',
    imagenes: [
      'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600',
    ],
    createdAt: '2024-03-01',
  },
  {
    id: 7, categoriaId: 2, nombre: 'Marlboro Gold Premium', precio: 22000, stock: 100, activo: true,
    descripcion: 'La versión premium de la marca más icónica. Tabaco Virginia seleccionado, sabor suave y limpio.',
    imagenes: [
      'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600',
    ],
    createdAt: '2024-03-05',
  },
  {
    id: 8, categoriaId: 2, nombre: 'Camel Blue Box', precio: 20000, stock: 80, activo: true,
    descripcion: 'Blend turco americano equilibrado. Sabor redondo, notas dulces de Burley y Virginia.',
    imagenes: [
      'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600',
    ],
    createdAt: '2024-03-10',
  },
  {
    id: 9, categoriaId: 3, nombre: 'Mezcla Amaranta Reserve', precio: 85000, stock: 15, activo: true,
    descripcion: 'Blend exclusivo de la casa. Mezcla de Virginia flue-cured, Latakia sirio y Perique. Lata de 100g.',
    imagenes: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    ],
    createdAt: '2024-03-15',
  },
  {
    id: 10, categoriaId: 3, nombre: 'Davidoff Flake', precio: 95000, stock: 10, activo: true,
    descripcion: 'Tabaco de pipa en láminas prensadas. Virginia puro añejado 2 años. Dulce, con notas de heno.',
    imagenes: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    ],
    createdAt: '2024-03-20',
  },
  {
    id: 11, categoriaId: 3, nombre: 'Dunhill Early Morning', precio: 78000, stock: 0, activo: false,
    descripcion: 'Aromatic inglés suave. Blend de Virginia y Burley con toque de vainilla. Lata 50g.',
    imagenes: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    ],
    createdAt: '2024-03-25',
  },
  {
    id: 12, categoriaId: 4, nombre: 'Cortador Guillotina Xikar XI', precio: 145000, stock: 7, activo: true,
    descripcion: 'Cortador de doble hoja de acero quirúrgico. Corte perfecto hasta calibre 54. Garantía de por vida.',
    imagenes: [
      'https://images.unsplash.com/photo-1599446294862-3a42bcce8e7b?w=600',
    ],
    createdAt: '2024-04-01',
  },
  {
    id: 13, categoriaId: 4, nombre: 'Encendedor S.T. Dupont Ligne 2', precio: 680000, stock: 3, activo: true,
    descripcion: 'El encendedor de lujo por excelencia. Cuerpo lacado negro, llama suave y llama antorcha. Sonido "clic" inconfundible.',
    imagenes: [
      'https://images.unsplash.com/photo-1599446294862-3a42bcce8e7b?w=600',
    ],
    createdAt: '2024-04-05',
  },
  {
    id: 14, categoriaId: 4, nombre: 'Humidor Caoba 25 Unidades', precio: 320000, stock: 5, activo: true,
    descripcion: 'Humidor de madera de caoba española. Capacidad 25 habanos. Higrómetro análogo y humidificador incluidos.',
    imagenes: [
      'https://images.unsplash.com/photo-1599446294862-3a42bcce8e7b?w=600',
    ],
    createdAt: '2024-04-10',
  },
  {
    id: 15, categoriaId: 4, nombre: 'Pipa Briar Peterson Classic', precio: 210000, stock: 6, activo: true,
    descripcion: 'Pipa artesanal en madera de brezo irlandés. Sistema Peterson de condensador de humedad. Forma billiard.',
    imagenes: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    ],
    createdAt: '2024-04-15',
  },
  {
    id: 16, categoriaId: 4, nombre: 'Cenicero Cristal Amaranta', precio: 95000, stock: 12, activo: true,
    descripcion: 'Cenicero de cristal tallado a mano. Diseño hexagonal con bordes dorados. Exclusivo de la casa.',
    imagenes: [
      'https://images.unsplash.com/photo-1599446294862-3a42bcce8e7b?w=600',
    ],
    createdAt: '2024-04-20',
  },
]

export const USUARIOS = [
  { id: 1, nombre: 'Admin Amaranta', email: 'admin@amaranta.com', password: 'admin123', rol: 'admin', activo: true, createdAt: '2024-01-01' },
  { id: 2, nombre: 'María González', email: 'maria@amaranta.com', password: 'tendero123', rol: 'tendero', activo: true, createdAt: '2024-02-10' },
  { id: 3, nombre: 'Carlos Restrepo', email: 'carlos@amaranta.com', password: 'tendero123', rol: 'tendero', activo: true, createdAt: '2024-02-20' },
  { id: 4, nombre: 'Laura Martínez', email: 'laura@amaranta.com', password: 'tendero123', rol: 'tendero', activo: false, createdAt: '2024-03-05' },
]

export const VENTAS_HISTORIAL = [
  { id: 1, usuarioId: 2, productos: [{ productoId: 1, cantidad: 1, precio: 380000 }, { productoId: 12, cantidad: 1, precio: 145000 }], total: 525000, fecha: '2024-04-01', estado: 'completada' },
  { id: 2, usuarioId: 3, productos: [{ productoId: 2, cantidad: 2, precio: 220000 }], total: 440000, fecha: '2024-04-03', estado: 'completada' },
  { id: 3, usuarioId: 2, productos: [{ productoId: 9, cantidad: 1, precio: 85000 }, { productoId: 15, cantidad: 1, precio: 210000 }], total: 295000, fecha: '2024-04-05', estado: 'completada' },
  { id: 4, usuarioId: 2, productos: [{ productoId: 13, cantidad: 1, precio: 680000 }], total: 680000, fecha: '2024-04-10', estado: 'completada' },
  { id: 5, usuarioId: 3, productos: [{ productoId: 4, cantidad: 3, precio: 175000 }, { productoId: 6, cantidad: 2, precio: 32000 }], total: 589000, fecha: '2024-04-12', estado: 'completada' },
  { id: 6, usuarioId: 2, productos: [{ productoId: 5, cantidad: 1, precio: 290000 }, { productoId: 14, cantidad: 1, precio: 320000 }], total: 610000, fecha: '2024-04-15', estado: 'completada' },
  { id: 7, usuarioId: 3, productos: [{ productoId: 3, cantidad: 2, precio: 195000 }, { productoId: 16, cantidad: 1, precio: 95000 }], total: 485000, fecha: '2024-04-18', estado: 'completada' },
  { id: 8, usuarioId: 2, productos: [{ productoId: 7, cantidad: 4, precio: 22000 }, { productoId: 10, cantidad: 1, precio: 95000 }], total: 183000, fecha: '2024-04-20', estado: 'completada' },
]

export const VENTAS_MENSUALES = [
  { mes: 'Ene', ventas: 1450000, transacciones: 5 },
  { mes: 'Feb', ventas: 2100000, transacciones: 7 },
  { mes: 'Mar', ventas: 1980000, transacciones: 6 },
  { mes: 'Abr', ventas: 3807000, transacciones: 8 },
  { mes: 'May', ventas: 1200000, transacciones: 4 },
]
