var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const multer = require('multer')
var superAdm = require('../middlewares/authAdmin');
const { default: axios } = require('axios');
const { data } = require('jquery');


const { Usuario, Produto, Categoria, UsuarioComum,Carrinho, FavoritoProduto} = require('../models')


/* GET home page. */



const api = {
    //produtos
    index: async function(req, res, next) {
        
        try {
            const produtos = await Produto.findAll()
            res.send({produtos})    
            
        } catch (error) {
            return res.sendStatus(404)
        }
    },

    promo: async(req,res) => {

        try {
            const products = await FavoritoProduto.findAll({
                include: {
                  model: Produto,
                  as: 'addfavo'
                }})
            res.send({products})
            
        } catch (error) {
            return res.sendStatus(404)
        }
    },

    //pedidos
    carrinho: async function(req,res,next){
        
        const page =  req.query.page
        try {
            const usuario = req.session.usuarioLogado.id
            const {count:total,rows:orders} = await Carrinho.findAndCountAll({
               limit: 4,
                offset: page *4
            })
        
         let totalPages = Math.round(total/4)
    
           res.render('usuariocomum/admin-usuario-pedido',{totalPages, orders, usuario})
        } catch (error) {
            return res.send(error)
        }
        
    },

    //login
    login: async function(req,res,next){
        try {
            const usuarios =  await UsuarioComum.findAll()
            res.send({usuarios})
            
        } catch (error) {
            return res.sendStatus(404)
        }
    },
    //buscador cep
    cep: async function(req, res, next) {
        try {
            const cep = await axios.get('https://viacep.com.br/ws/01001000/json')
    
            res.send(cep.data)
            
        } catch (error) {
            return res.sendStatus(404)
        }
    },


}

module.exports = api