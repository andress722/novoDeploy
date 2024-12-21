
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const { Usuario, Produto, Categoria, Carrinho,Pedido, UsuarioComum} = require('../models')
const crypto = require('crypto')
const mailer = require('../middlewares/email')
const bcrypt = require('bcrypt')
var session = require('express-session');
const axios = require('axios').default


const passwordNew = {
    reset: function (req,res){
        
        res.render('fortePass')
    },

    resetPost: async function (req,res){
        const {email, token, senha} = req.body
       
        try {
            const usuario = await UsuarioComum.findOne({where: {
                email: email
            }})
            let senhaB = bcrypt.hashSync(senha, 4)
            if(usuario != null){
                if(token === null || token === undefined ){
                    res.render('form-servico-erro', {mensagemErro: 'Erro de validação no token'})
                }else{
                    if(usuario.token == token){
                        await UsuarioComum.update({senha:senhaB, token:null}, {
                            where: {
                                email: email
                            }})
                    }else{
                        res.render('form-servico-erro', {mensagemErro: 'Erro de validação no token'})
                    }

                }
            
        } else{
            res.render('form-servico-erro', {mensagemErro: 'Erro de validação de usuario'})
        }
            res.redirect('/login')
        }catch (error) {
            res.render('form-servico-erro', {mensagemErro: 'Erro de validação de usuario'})
        }

    },
    enviado: function (req,res){
        
        res.render('enviado')
    },

    forget: (req,res) => {
        
        res.render('forget')
    },

    forgetPost: (req,res) => {
        const {email} = req.body
        console.log(email)
        res.render('emailSend', email)
    },

    send: async (req,res) => {
        const {email} = req.body
        try {
            const usuario = await UsuarioComum.findOne({where: {
                email: email
            }})
            console.log('Este é o email ' + usuario)
        const token = crypto.randomBytes(20).toString('hex')
            if(usuario !== null){
                if(usuario.token === null){
                    console.log('entrou no if ******')
                    await mailer.sendMail({
                        to: email,
                        from: 'andrecidre@hotmail.com',
                        html: `
                        <body>
                            <strong>Olá abaixo você irá visualizar o token: </strong>
                            <strong><span>Numero: ${token}</span></strong>

                        </body>
            
                    `
                    })
                    await UsuarioComum.update({token:token}, {
                        where: {
                            email: email
                        }})
                }else{
                    if(usuario.token != null){
                        await mailer.sendMail({
                            to: email,
                            from: 'andrecidre@hotmail.com',
                            html: `
                            <body>
                                <strong>Olá abaixo você irá visualizar o token: </strong>
                                <strong><span>Numero: ${token}</span></strong>
                            </body>
                
                        `
                        })
                        await UsuarioComum.update({token:token}, {
                            where: {
                                email: email
                            }})
                    }
                }
            
        }
        
        res.redirect('/pass/resetpass')
    

        } catch (error) {
            res.render('form-servico-error', {mensagemErro: 'Erro ao enviar menssagem'})
        }
    }

}



module.exports = passwordNew