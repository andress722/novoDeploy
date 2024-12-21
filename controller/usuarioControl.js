var express = require('express');
var router = express.Router();

const {
	Usuario,
	UsuarioComum,
	Carrinho,
	Produto,
	Categoria,
	FavoritoProduto,
} = require('../models');

const axios = require('axios');

var bcrypt = require('bcrypt');

/* GET home page. */

const usuario = {
	admin: async (req, res) => {
		const usuario = req.session.usuarioLogado.id;
		const obj = {
			usuario: usuario,
			administrador: await UsuarioComum.findByPk(usuario),
		};
		return res.render('usuariocomum/admin-comprador', obj);
	},

	viewOrder: async (req, res) => {
		try {
			const nOrder = req.params.order;
			const usuario = req.session.usuarioLogado.id;
			const order = await Carrinho.findOne({
				where: {
					numero_pedido: nOrder,
				},
			});

			return res.render('usuariocomum/visualizar-pedido', { order, usuario });
		} catch (error) {
			res.send(error);
		}
	},

	log: (req, res) => {
		return res.render('logar');
	},

	editUsuarioGet: async (req, res) => {
		const usuarioId = req.params.id;
		const usuario = await UsuarioComum.findByPk(usuarioId);

		return res.render('usuariocomum/edit-usuario', { usuario });
	},
	editUsuarioPost: async (req, res) => {
		const usuarioId = req.params.id;
		const {
			nome,
			emailCadastro,
			senha,
			cep,
			endereco,
			cidade,
			estado,
			bairro,
			numero,
			cpf,
			celular,
		} = req.body;
		let senhaB = bcrypt.hashSync(senha, 4);
		await UsuarioComum.update(
			{
				nome,
				emailCadastro,
				cep,
				endereco,
				cidade,
				estado,
				bairro,
				numero,
				cpf,
				celular,
				senha: senhaB,
			},
			{
				where: {
					id: usuarioId,
				},
			},
		);

		return res.redirect('/admin');
	},

	index: async function (req, res, next) {
		const obj = {
			produtos: await Produto.findAll(),
			categoria: await Categoria.findAll(),
		};
		return res.render('index', obj);
	},

	procura: async function (req, res, next) {
		let produtos = await Produto.findAll();
		const nome = req.params.search;

		return res.render('pesquisa', { produtos });
	},
	procuraParam: async function (req, res, next) {
		var nome = req.params.nome;
		let produtos = await Produto.findAll();
		let mProduct = [];

		if (nome != undefined) {
			for (let i = 0; i < produtos.length; i++) {
				nome = nome.toUpperCase();
				if (nome != undefined) {
					if (produtos[i].nome.toUpperCase().indexOf(nome) !== -1) {
						mProduct.push(produtos[i]);
					}
				}
			}
			console.log(mProduct);
			return res.render('pesquisa-id', { nome, mProduct });
		} else {
			console.log(nome);
			return res.render('pesquisa', { nome, produtos });
		}
	},

	forgetPassword: async function (req, res, next) {
		res.render('fortePass');
	},

	login: function (req, res) {
		const error = false;
		const obj = {
			error: error,
		};
		return res.render('login', obj);
	},

	loginPost: async function (req, res, next) {
		try {
			const { email, senha } = req.body;
			const usuarioLogin = await UsuarioComum.findOne({
				where: {
					email: req.body.email,
				},
			});
			if (usuarioLogin) {
				const usuarioSenha = usuarioLogin.senha;

				let valida = bcrypt.compareSync(req.body.senha, usuarioSenha);

				if (usuarioLogin && valida === true) {
					req.session.estaLogado = true;
					req.session.usuarioLogado = usuarioLogin;

					return res.redirect('/');
				} else {
					const error = true;
					const obj = {
						error: error,
					};

					return res.render('login', obj);
				}
			}
		} catch (erro) {
			return res.render('form-servico-erro', {
				mensagemErro: 'Erro ao efetuar login',
			});
		}
	},

	logout: function (req, res, next) {
		req.session.destroy();
		return res.redirect('/');
	},

	contato: async function (req, res) {
		try {
			const usuario = req.session.usuarioLogado.id;
			const obj = {
				usuario: await UsuarioComum.findByPk(usuario),
			};

			return res.render('envio', obj);
		} catch (error) {
			return res.render('envio');
		}
	},

	produtoUsuario: async function (req, res) {
		try {
			const obj = {
				produtos: await Produto.findAll(),
				categoria: await Categoria.findAll(),
			};
			return res.render('produtos', obj);
		} catch (error) {
			return res.render('produtos');
		}
	},

	produtoUsuarioId: async function (req, res) {
		const idProduto = req.params.idProduto;
		const obj = {
			produtos: await Produto.findByPk(idProduto),
		};
		return res.render('visualizar-produto', obj);
	},

	cadastro: function (req, res) {
		return res.render('usuariocomum/form-usuario-comum');
	},

	cadastroPost: async function (req, res) {
		const emailReq = req.body.email;
		const {
			nome,
			emailCadastro,
			senha,
			cep,
			endereco,
			cidade,
			estado,
			bairro,
			numero,
		} = req.body;
		console.log(senha);
		let senhaB = bcrypt.hashSync(senha, 4);
		console.log(senhaB);
		const email = await UsuarioComum.findOne({ where: { email: emailReq } });
		if (!email) {
			await UsuarioComum.create({
				nome,
				email: emailReq,
				senha: senhaB,
				cep,
				endereco,
				cidade,
				estado,
				bairro,
				numero,
			});
			console.log(senhaB);
			return res.redirect('/login');
		} else {
			return res.render('form-servico-erro', {
				mensagemErro: 'Email já cadastrado',
			});
		}
	},

	cep: async function (req, res, next) {
		return res.render('cep');
	},

	cepPost: async function (req, res, next) {
		const response = await axios.get(
			`https://viacep.com.br/ws/${req.body.cep}/json`,
		);
		console.log(response.data);

		return res.render('dados-cep', response.data);
	},
	favoritos: async function (req, res) {
		const usuario = await Usuario.findByPk(req.session.usuarioLogado.id, {
			include: {
				model: Produto,
				as: 'favoritos',
			},
		});
		return res.render('favoritos', {
			favoritos: usuario.favoritos,
			usuario: req.session.usuarioLogado.id,
		});
	},

	favoritoId: async function (req, res) {
		const idProdutos = req.params.idProdutos;
		const idUsuario = req.session.usuarioLogado.id;
		try {
			await ProdutoFavoritoUsuario.create({
				produto_id: idProdutos,
				usuario_id: idUsuario,
			});
			return res.redirect('/admin/favoritos');
		} catch (error) {
			console.log(error);
			return res.redirect('/admin/favoritos');
		}
	},

	removeIdFavorito: async function (req, res) {
		const idProdutos = req.params.idProdutos;
		const idUsuario = req.session.usuarioLogado.id;

		await ProdutoFavoritoUsuario.destroy({
			where: {
				produto_id: idProdutos,
				usuario_id: idUsuario,
			},
		});

		return res.redirect('/admin/favoritos');
	},
};

module.exports = usuario;
