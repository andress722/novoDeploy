module.exports = (connection, DataTypes) => {
    const model = connection.define('FavoritoProduto', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_produto: { // Campo necessário para associar ao modelo Produto
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'produto_favoritos'
    });

    model.associate = models => {
        model.belongsTo(models.Produto, {
            foreignKey: 'id_produto',
            as: 'addfavo'
        });

        // Sincroniza o modelo apenas se necessário
        // Você pode remover isso em produção
        model.sync({ alter: true });
    };

    return model;
};
