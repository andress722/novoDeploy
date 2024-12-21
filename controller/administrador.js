var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const { Usuario, Produto, Categoria, FavoritoProduto } = require('../models');

const { default: axios } = require('axios');

var bcrypt = require('bcrypt');

const superadmin = {
	administrador: async function (req, res) {
		try {
			const logado = req.session.usuarioLogado.id;

			const obj = {
				administrador: await Usuario.findByPk(logado),
			};

			return res.render('produtos/admin');
		} catch (error) {
			res.render('form-servico-erro', { mensagemErro: 'Houve algum erro' });
		}
	},

	favorito: async (req, res) => {
		try {
			const favorito = await FavoritoProduto.findAll({
				include: {
					model: Produto,
					as: 'addfavo',
				},
			});
			return res.render('produtos/favo-promo', { favorito });
		} catch (error) {
			return res.sendStatus(404);
		}

		//return res.send(favorito)
	},

	favoritar: async (req, res) => {
		const idProduto = req.params.idProduto;
		await FavoritoProduto.create({ id_produto: idProduto });
		return res.redirect('/superadmin/produtos');
	},

	criarUsuarioGet: (req, res) => {
		return res.render('cadastro');
	},
	criando: async function (req, res) {
		try {
			const { email, senha, nome } = req.body;
			let senhaB = bcrypt.hashSync(senha, 4);
			console.log(email);
			const emailReq = await Usuario.findOne({ where: { email: email } });
			if (!emailReq) {
				await Usuario.create({ nome: nome, email: email, senha: senhaB });
				console.log(senhaB);
				return res.redirect('/superadmin/loginempresa');
			}
		} catch (error) {
			return res.render('form-servico-erro', {
				mensagemErro: 'Erro no cadastro, tente novamente',
			});
		}
	},

	loginEmpresa: function (req, res) {
		if (req.query.fail)
			return res.render('form-servico-erro', { mensagemErro: 'erro no login' });
		else return res.render('login-empresa');
	},

	loginEmpresaPost: async function (req, res, next) {
		try {
			const { email, senha } = req.body;
			const usuarioLogin = await Usuario.findOne({
				where: {
					email: req.body.email,
				},
			});
			if (usuarioLogin != null || undefined) {
				const usuarioSenha = usuarioLogin.senha;

				let valida = bcrypt.compareSync(req.body.senha, usuarioSenha);

				if (usuarioLogin && valida === true) {
					req.session.estaLogado = true;
					req.session.usuarioLogado = usuarioLogin;

					return res.redirect('/superadmin/admin');
				}
			} else {
				return res.render('form-servico-erro', {
					mensagemErro: 'erro ao tentar login',
				});
			}
		} catch (erro) {
			return res.render('form-servico-erro', {
				mensagemErro: 'erro ao tentar login',
			});
		}
	},

	produtosAdmin: async function (req, res) {
		const usuario = req.session.usuarioLogado.id;
		const calca = await Produto.findAll();
		try {
			const obj = {
				calca: calca,
				usuario: await Usuario.findByPk(usuario),
			};
			console.log(calca);
			return res.render('produtos/admin-produtos', obj);
		} catch (error) {
			return res.render('produtos/admin-produtos');
		}
	},

	verProuto: async (req, res) => {
		const idProduto = req.params.idProduto;
		const usuario = req.session.usuarioLogado.id;
		const produto = await Produto.findByPk(idProduto, {
			include: {
				model: Categoria,
				as: 'categoria',
			},
		});

		if (!produto) {
			return res.render('erro-validacao', {
				mensagemErro: 'Produto não existe',
			});
		}

		const obj = {
			produto: produto,
			categorias: await Categoria.findAll(),
			usuario: await Usuario.findByPk(usuario),
		};

		return res.render('produtos/visualizar-produto-admin', obj);
	},

	criarProdutosAdmin: async function (req, res) {
		const usuario = req.session.usuarioLogado.id;
		try {
			const obj = {
				categorias: await Categoria.findAll(),
				usuario: await Usuario.findByPk(usuario),
			};

			return res.render('produtos/form-produtos', obj);
		} catch (error) {
			return res.sendStatus(404);
		}
	},

	criarProdutoAdminPost: async function (req, res) {
		try {
			const { categoria_id, usuario_id, nome, descricao, valor } = req.body;
			let file = req.file;
			if (file != null) {
				await Produto.create({
					categoria_id: categoria_id,
					usuario_id: usuario_id,
					nome: nome,
					descricao: descricao,
					valor: valor,
					imagem: file.filename,
				});
			}
			return res.render('enviado');
		} catch (error) {
			res.render('form-servico-erro', { mensagemErro: 'Erro' });
		}
	},

	removerProdutoAdmin: async function (req, res) {
		const idProduto = req.params.idProduto;
		await Produto.destroy({
			where: {
				id: idProduto,
			},
		});

		return res.redirect('/superadmin/produtos');
	},

	produtoEditId: async function (req, res) {
		const idProduto = req.params.idProduto;
		const usuario = req.session.usuarioLogado.id;
		const produto = await Produto.findByPk(idProduto, {
			include: {
				model: Categoria,
				as: 'categoria',
			},
		});

		if (!produto) {
			return res.render('erro-validacao', {
				mensagemErro: 'Produto não existe',
			});
		}

		const obj = {
			produto: produto,
			categorias: await Categoria.findAll(),
			usuario: await Usuario.findByPk(usuario),
		};

		return res.render('produtos/editar-produto', obj);
	},

	editProdutoId: async function (req, res) {
		const idProduto = req.params.idProduto;

		await Produto.update(req.body, {
			where: {
				id: idProduto,
			},
		});

		return res.redirect('/superadmin/produtos');
	},

	categoriaAdmin: async function (req, res) {
		const obj = {
			categorias: await Categoria.findAll(),
		};
		return res.render('categorias/admin-categorias', obj);
	},

	categoriaCriar: async function (req, res) {
		return res.render('categorias/form-categorias');
	},

	categoriaCriarPost: async function (req, res) {
		let file = req.file;
		try {
			if (file) {
				console.log(req.body);
				await Categoria.create(req.body);

				return res.redirect('/superadmin/categorias');
			}
		} catch (error) {
			res.render('form-servico-erro', { MessageChannel: 'erro ao criar' });
		}
	},

	categoriaId: async function (req, res) {
		try {
			const idCategoria = req.params.idCategoria;
			const obj = {
				categorias: await Categoria.findByPk(idCategoria, {
					include: {
						model: Produto,
						as: 'produtos',
					},
				}),
			};
			return res.render('categorias/ver-categoria', obj);
		} catch (error) {
			return res.sendStatus(404);
		}
	},

	categoriaEditId: async function (req, res) {
		console.log('chamaou :idCategoria/edit');
		const idCategoria = req.params.idCategoria;
		try {
			const produto = await Categoria.findByPk(idCategoria);
			const obj = {
				produto: produto,
			};

			return res.render('categorias/editar-categorias', obj);
		} catch (error) {
			return res.render('categorias/editar-categorias', obj);
		}
	},

	jsonPedido: async (req, res) => {
		const salvar = await axios.get(
			'https://api.mercadopago.com/v1/payments/1307465816?acces_token=TEST-8218594776835434-091003-3eab1f89cb25fb2fb5ec4eb39b8159da-258177562',
		);
		const response = await salvar.data;

		return res.json(response);
	},

	categoriaEditPost: async function (req, res) {
		const idCategoria = req.params.idCategoria;
		console.log('chhamou edição');

		try {
			await Categoria.update(req.body, {
				where: {
					id: idCategoria,
				},
			});
			return res.redirect('/superadmin/categorias');
		} catch (error) {
			return res.sendStatus(404);
		}
	},

	categoriaRemoveId: async function (req, res) {
		const idCategoria = req.params.idCategoria;
		try {
			await Categoria.destroy({
				where: {
					id: idCategoria,
				},
			});
			return res.redirect('/superadmin/categorias');
		} catch (error) {
			return res.sendStatus(404);
		}
	},
};

module.exports = superadmin;
