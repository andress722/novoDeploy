module.exports = (connection, DataTypes) => {

    const model = connection.define('FavoritoProduto', {
         id:{
             type: DataTypes.INTEGER(100),
             primaryKey: true,
             autoIncrement: true
         },

        
     },{
         timestamps: false,
         tableName: 'produto_favoritos'
     })
     model.associate = models => {
        model.belongsTo(models.Produto,{
            foreignKey: 'id_produto',
            as: 'addfavo'
        })
        
      
         model.sync({alter:true})
     }
 
     return model
 }
 