module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      nome: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      senha: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      tipo: {
          type: DataTypes.ENUM('Administrador', 'Usuario'),
          defaultValue: 'Usuario',
          allowNull: false,
      },
  }, {
      tableName: 'usuarios',
      timestamps: true,
  });

  return Usuario;
};
