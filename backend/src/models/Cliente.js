import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

const Cliente = sequelize.define(
  'Cliente',
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
    documento: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue('documento', typeof value === 'string' ? value.trim() : value)
      },
    },
    email: {
      type: DataTypes.STRING,
      defaultValue: '',
      set(value) {
        this.setDataValue('email', typeof value === 'string' ? value.trim() : value)
      },
    },
    telefono: {
      type: DataTypes.STRING,
      defaultValue: '',
      set(value) {
        this.setDataValue('telefono', typeof value === 'string' ? value.trim() : value)
      },
    },
    direccion: {
      type: DataTypes.STRING,
      defaultValue: '',
      set(value) {
        this.setDataValue('direccion', typeof value === 'string' ? value.trim() : value)
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
    tableName: 'clientes',
    timestamps: false,
  }
)

export default Cliente

