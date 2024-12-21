var mercadopago = require('mercadopago');
const cors = require('cors');
var express = require('express');
const { json } = require('body-parser');
const {
	Usuario,
	UsuarioComum,
	Produto,
	Categoria,
	Carrinho,
	Pedido,
} = require('../models');

mercadopago.configure({
	access_token:
		'TEST-8218594776835434-091003-3eab1f89cb25fb2fb5ec4eb39b8159da-258177562',
});

const creaOrder = {
	teste: async (req, res) => {
		try {
			const product = await Carrinho.findAll();
			const usuario = req.session.usuarioLogado.id;
			console.log(usuario);
			let pFilter = product
				.filter((item) => item.id_usuario === usuario)
				.filter((item, pos) => {
					if (item.numero_pedido === '0aCv9lPHyWadppNR7jAK') {
						item.total = parseInt(item.total) + parseInt(item.total);
						return item.indexOf(item) === pos;
					}
				});
			return res.send(pFilter);
		} catch (error) {
			res.send(error);
		}
	},

	createPrefer: async (req, res) => {
		const body = req.body;
		console.log(body);

		var preference = {
			items: body.map((e) => ({
				title: e.description,
				unit_price: Number(e.price),
				quantity: Number(e.quantity),
				pedido: e.pedido,
			})),

			back_urls: {
				success: '/pedidos/feedback',
				failure: '/pedidos/feedback',
				pending: '/pedidos/feedback',
			},
			auto_return: 'approved',
		};
		console.log(preference);
		const pedido = body.map((e) => e.pedido);
		console.log(pedido);
		mercadopago.preferences
			.create(preference)
			.then(async function (response) {
				res.send({
					id: response.body.id,
				});

				console.log(pedido);
				let idPagamento = response.body.id;
				console.log(response);
				await Carrinho.update(
					{
						id_pagamento: idPagamento,
					},
					{
						where: {
							numero_pedido: pedido,
						},
					},
				);
			})
			.catch(function (error) {
				console.log(error);
			});
		console.log(json);
	},
	feedback: async (req, res) => {
		const param = req.query;
		console.log(param);
		const pagamentoId = req.query.preference_id;
		const payId = req.query.payment_id;
		const statusP = req.query.status;
		const merchant = req.query.merchant_order_id;

		const obj = {
			pagamentoId: pagamentoId,
			payId: payId,
			statusP: statusP,
			merchant: merchant,
		};

		await Carrinho.update(
			{
				status: statusP,
				payment: payId,
				MerchantOrd: merchant,
			},
			{
				where: {
					id_pagamento: pagamentoId,
				},
			},
		);
		res.render('usuariocomum/dados-pagamento', obj);
	},
};

module.exports = creaOrder;
