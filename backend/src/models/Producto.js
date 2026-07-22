import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

const Producto = sequelize.define(
  'Producto',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('nombre', typeof value === 'string' ? value.trim() : value)
      },
    },
    descripcion: {
      type: DataTypes.STRING,
      defaultValue: '',
      set(value) {
        this.setDataValue('descripcion', typeof value === 'string' ? value.trim() : value)
      },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id',
      },
    },
    imagenes: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'productos',
    timestamps: false,
  }
)

export default Producto

