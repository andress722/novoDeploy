const { DataTypes } = require("sequelize");

module.exports = (connection) => {
    const Carrinho = connection.define('Carrinho', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        produto: {
            type: DataTypes.STRING
        },
        quantidade: {
            type: DataTypes.STRING
        },
        valor: {
            type: DataTypes.STRING
        },
        total: {
            type: DataTypes.STRING
        },
        numero_pedido: {
            type: DataTypes.STRING
        },
        id_produto: {
            type: DataTypes.INTEGER // Alterei para INTEGER, assumindo que o id do produto é um número
        },
        status: {
            type: DataTypes.STRING
        },
        payment: {
            type: DataTypes.INTEGER
        },
        merchantOrder: {
            type: DataTypes.INTEGER
        },
        id_pagamento: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true,
        tableName: 'carrinhos'
    });

    Carrinho.associate = (models) => {
        Carrinho.belongsTo(models.Produto, {
            foreignKey: 'id_produto',
            as: 'produtoCarrinho'
        });
        
        Carrinho.belongsTo(models.UsuarioComum, {
            foreignKey: 'id_usuario',
            as: 'usuario'
        });

        // Não é necessário chamar sync dentro do associate
    }

    return Carrinho;
}
