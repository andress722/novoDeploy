module.exports = (connection, DataTypes) => {

    const model = connection.define('Usuario', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nome: {
          type: DataTypes.STRING(200)
        },
        superusuario: {
          type: DataTypes.STRING(200)
        },
        email: {
          type: DataTypes.STRING(200)
        },
        senha: {
          type: DataTypes.STRING(200)
        }
      }, {
        timestamps: true,
        tableName: 'usuarios'
      })

      model.associate = models => {

      

        

        model.sync({alter:true})

      }

    
      return model
 }
 
