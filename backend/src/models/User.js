import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

const User = sequelize.define(
  'User',
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        if (typeof value === 'string') {
          this.setDataValue('email', value.trim().toLowerCase())
        } else {
          this.setDataValue('email', value)
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    telefono: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
)

export default User

