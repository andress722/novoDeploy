var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const { Usuario, Produto, Categoria, FavoritoProduto } = require('../models');
const { Op } = require('sequelize');
const { default: axios } = require('axios');

var bcrypt = require('bcrypt');

const superadmin = {
	administrador: async (req, res) => {
        try {
            const logado = req.session.usuarioLogado.id;
            const administrador = await Usuario.findByPk(logado);

            if (!administrador) {
                return res.render('form-servico-erro', { mensagemErro: 'Usuário não encontrado' });
            }

            return res.render('produtos/admin', { administrador });
        } catch (error) {
            console.error(error);
            return res.render('form-servico-erro', { mensagemErro: 'Houve um erro' });
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
		try {
			const idProduto = req.params.idProduto;
	
			// Verificar se o produto já está nos favoritos
			const favoritoExistente = await FavoritoProduto.findOne({ where: { id_produto: idProduto } });
			if (favoritoExistente) {
				return res.redirect('/superadmin/produtos'); // Já está favoritado
			}
	
			// Adicionar aos favoritos
			await FavoritoProduto.create({ id_produto: idProduto });
			console.log(`Produto ${idProduto} adicionado aos favoritos.`);
			return res.redirect('/superadmin/produtos');
		} catch (error) {
			console.error('Erro ao adicionar favorito:', error);
			return res.render('form-servico-erro', { mensagemErro: 'Erro ao adicionar aos favoritos' });
		}
	},
	

	cadastrarAdminGet: (req, res) => {
		return res.render('produtos/cadastro-admin');
	},
	
	cadastrarAdminPost: async function (req, res) {
		try {
			const { email, senha, nome } = req.body;
	
			if (!email || !senha || !nome) {
				console.error('Dados incompletos: email, senha ou nome ausentes.');
				return res.render('form-servico-erro', {
					mensagemErro: 'Todos os campos são obrigatórios.',
				});
			}
	
			// Criptografar senha
			const senhaB = bcrypt.hashSync(senha, 4);
			console.log('Senha criptografada:', senhaB);
	
			// Verificar se o email já está cadastrado
			const emailReq = await Usuario.findOne({ where: { email: email } });
			if (emailReq) {
				console.error('Email já cadastrado:', email);
				return res.render('form-servico-erro', {
					mensagemErro: 'Email já cadastrado. Use outro email.',
				});
			}
	
			// Criar administrador
			const novoAdmin = await Usuario.create({ nome: nome, email: email, senha: senhaB, tipo: 'Administrador' });
			console.log('Administrador criado com sucesso:', novoAdmin);
	
			// Redirecionar após sucesso
			return res.redirect('/superadmin/loginempresa');
		} catch (error) {
			console.error('Erro ao criar administrador:', error);
			return res.render('form-servico-erro', {
				mensagemErro: 'Erro no cadastro, tente novamente.',
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
			console.log(email, senha);
			const usuarioLogin = await Usuario.findOne({ where: { email } });
	
			if (!usuarioLogin || usuarioLogin.tipo !== 'Administrador') {
				console.error('Usuário não autorizado ou não encontrado.');
				return res.render('form-servico-erro', { mensagemErro: 'Usuário ou senha inválidos' });
			}
	
			const valida = bcrypt.compareSync(senha, usuarioLogin.senha);
			console.log(valida);
			if (valida) {
				console.log('Login autorizado.');
				req.session.estaLogado = true;
				req.session.usuarioLogado = usuarioLogin;
				return res.redirect('/superadmin/admin');
			} else {
				console.error('Senha inválida.');
				return res.render('form-servico-erro', { mensagemErro: 'Usuário ou senha inválidos' });
			}
		} catch (error) {
			console.error('Erro ao tentar login:', error);
			return res.render('form-servico-erro', { mensagemErro: 'Erro ao tentar login' });
		}
	},
	produtosAdmin: async function (req, res) {
		try {
			const produtos = await Produto.findAll({
				include: {
					model: Categoria,
					as: 'categoria'
				}
			});
	
			// Calcular a porcentagem de desconto para cada produto
			produtos.forEach(produto => {
				if (produto.valor_promocional) {
					produto.dataValues.desconto = ((produto.valor - produto.valor_promocional) / produto.valor) * 100;
				} else {
					produto.dataValues.desconto = null;
				}
			});
	
			return res.render('produtos/admin-produtos', { produtos });
		} catch (error) {
			console.error('Erro ao buscar produtos:', error);
			return res.render('form-servico-erro', { mensagemErro: 'Erro ao carregar produtos' });
		}
	},
	produtosPromocao: async (req, res) => {
		try {
			const produtos = await Produto.findAll({
				where: {
					valor_promocional: {
						[Op.not]: null
					}
				},
				include: {
					model: Categoria,
					as: 'categoria'
				}
			});
	
			// Calcular a porcentagem de desconto
			produtos.forEach(produto => {
				produto.dataValues.desconto = ((produto.valor - produto.valor_promocional) / produto.valor) * 100;
			});
	
			return res.render('produtos/produtos-promocao', { produtos });
		} catch (error) {
			console.error('Erro ao buscar produtos em promoção:', error);
			return res.render('form-servico-erro', { mensagemErro: 'Erro ao carregar produtos em promoção' });
		}
	},
	alterarPromocao: async (req, res) => {
		try {
			const idProduto = req.params.idProduto;
			const { desconto } = req.body;
	
			console.log('Produto ID:', idProduto);
			console.log('Desconto Recebido:', desconto);
	
			// Validação do desconto
			if (!desconto || desconto <= 0 || desconto > 100) {
				console.log('Desconto inválido.');
				return res.render('form-servico-erro', { mensagemErro: 'Desconto inválido. Informe um valor entre 1% e 100%.' });
			}
	
			const produto = await Produto.findByPk(idProduto);
			if (!produto) {
				console.log('Produto não encontrado.');
				return res.render('form-servico-erro', { mensagemErro: 'Produto não encontrado.' });
			}
	
			console.log('Produto encontrado:', produto);
	
			// Calcular o valor com desconto
			const valorComDesconto = produto.valor - (produto.valor * desconto / 100);
	
			console.log('Valor com desconto calculado:', valorComDesconto);
	
			// Atualizar o banco de dados
			await Produto.update(
				{ valor_promocional: valorComDesconto },
				{ where: { id: idProduto } }
			);
	
			console.log('Produto atualizado com sucesso.');
	
			// Redirecionar para a página de promoções
			return res.redirect('/superadmin/promocoes');
		} catch (error) {
			console.error('Erro ao alterar promoção:', error);
			return res.render('form-servico-erro', { mensagemErro: 'Erro ao alterar promoção. Tente novamente.' });
		}
	},
	removerPromocao: async (req, res) => {
		try {
			const idProduto = req.params.idProduto;
	
			await Produto.update(
				{ valor_promocional: null },
				{ where: { id: idProduto } }
			);
	
			return res.redirect('/superadmin/produtos/promocoes');
		} catch (error) {
			console.error('Erro ao remover promoção:', error);
			return res.render('form-servico-erro', { mensagemErro: 'Erro ao remover promoção' });
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
	removerFavorito: async (req, res) => {
		try {
			const idProduto = req.params.idProduto;
	
			// Remover o produto dos favoritos
			await FavoritoProduto.destroy({ where: { id_produto: idProduto } });
	
			console.log(`Produto ${idProduto} removido dos favoritos.`);
			return res.redirect('/superadmin/favoritos');
		} catch (error) {
			console.error('Erro ao remover favorito:', error);
			return res.render('form-servico-erro', { mensagemErro: 'Erro ao remover dos favoritos' });
		}
	},
		

	aplicarPromocao: async (req, res) => {
		try {
			const idProduto = req.params.idProduto;
			const desconto = parseFloat(req.query.discount);
	
			if (!desconto || desconto <= 0 || desconto > 100) {
				return res.render('form-servico-erro', { mensagemErro: 'Desconto inválido' });
			}
	
			// Buscar produto
			const produto = await Produto.findByPk(idProduto);
			if (!produto) {
				return res.render('form-servico-erro', { mensagemErro: 'Produto não encontrado' });
			}
	
			// Calcular o valor com desconto
			const valorComDesconto = produto.valor - (produto.valor * desconto / 100);
	
			// Atualizar o produto com o valor promocional
			await Produto.update(
				{ valor_promocional: valorComDesconto },
				{ where: { id: idProduto } }
			);
	
			console.log(`Promoção aplicada ao produto ${idProduto} com desconto de ${desconto}%.`);
			return res.redirect('/superadmin/produtos');
		} catch (error) {
			console.error('Erro ao aplicar promoção:', error);
			return res.render('form-servico-erro', { mensagemErro: 'Erro ao aplicar promoção' });
		}
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
