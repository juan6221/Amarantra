import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

const Role = sequelize.define(
  'Role',
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
    },
  },
  {
    tableName: 'roles',
    timestamps: false,
  }
)

export default Role

