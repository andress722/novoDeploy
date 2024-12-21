// Add SDK credentials
// REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel
const mercadopago = new MercadoPago(
	'TEST-7bd75aea-c0f3-476c-919f-feb33efcfa89',
	{
		locale: 'pt-BR', // The most common are: 'pt-BR', 'es-AR' and 'en-US'
	},
);

// Handle call to backend and generate preference.

document.getElementById('checkout-btn').addEventListener('click', function () {
	$('#checkout-btn').attr('disabled', true);

	const orderData = comP.map((e) => ({
		description: e.produto,
		price: e.valor,
		quantity: e.quantidade,
		pedido: nPedido,
	}));

	console.log(orderData);
	fetch('/pedidos/create_preference', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(orderData),
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (preference) {
			createCheckoutButton(preference.id);

			$('.shopping-cart').fadeOut(500);
			setTimeout(() => {
				$('.container_payment').show(500).fadeIn();
			}, 500);
			console.log(preference);
		})

		.catch(function () {
			alert('Unexpected error');
			$('#checkout-btn').attr('disabled', false);
		});
});

// Create preference when click on checkout button
async function createCheckoutButton(preferenceId) {
	// Initialize the checkout

	mercadopago.checkout({
		preference: {
			id: preferenceId,
		},
		render: {
			container: '#button-checkout', // Class name where the payment button will be displayed
			label: 'Pagamento', // Change the payment button text (optional)
		},
	});
	console.log(preferenceId);
}

// Handle price update

// Go back
document.getElementById('go-back').addEventListener('click', async function () {
	$('.container_payment').fadeOut(500);
	setTimeout(() => {
		$('.shopping-cart').show(500).fadeIn();
	}, 500);
	$('#checkout-btn').attr('disabled', false);
	localStorage.clear();
	const pay = await fetch(
		`https://api.mercadopago.com/v1/payments/${preferenceId}`,
		{
			headers: {
				Authorization: 'Bearer TEST-7bd75aea-c0f3-476c-919f-feb33efcfa89',
			},
		},
	);
	let payment = await pay.json();
	console.log(payment);
});
