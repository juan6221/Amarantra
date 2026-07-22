import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

const Categoria = sequelize.define(
  'Categoria',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: 'categorias',
    timestamps: false,
  }
)

export default Categoria

