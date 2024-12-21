// alterei o nome da função para entrar no contexto de adição de produtos!
async function addProduto(produto, quantidade, valor, id) {
	// mantive a nomenclatura para facilitar a leitura do código..
	const productCart = await fetch('/api/produtos');
	const fetchProduct = await productCart.json();
	const arrayPro = [fetchProduct.produtos];
	const nomeProduct = produto;
	const newArray = arrayPro[0].map((elemento) => elemento);
	var productArr = [];
	for (let i = 0; i < newArray.length; i++) {
		console.log(newArray[i].nome);
		if (newArray[i].nome == nomeProduct) {
			productArr.push(newArray[i]);
		}
	}

	console.log(productArr);
	if (productArr[0].quantidade >= 1) {
		alert(`item ${produto} adicionado ao carrinho`);
		const produtos = {
			produto: produto,
			quantidade: quantidade,
			valor: valor,
			id: id,
		};
		// aqui o método vai retornar somente as chaves (ou melhor os produtos) negativo caso não exista!
		if (!Object.keys(produtos).length) {
			alert('é necessário informar!');
		} else {
			// verifica se existe o item no localStorage
			if (localStorage.getItem('produtos') === null) {
				// cria um item com o objeto indexado (passou a ser uma chave filho)
				localStorage.setItem('produtos', JSON.stringify([produtos]));
				window.location.reload();
			} else {
				// obtêm o conteúdo do item produtos do localStorage

				let listaProdutos = JSON.parse(localStorage.getItem('produtos'));
				listaProdutos.map((items) => {
					if (items.produto === produto) items.produto = items.produto;
					items.quantidade = parseInt(items.quantidade);
					items.valor = parseInt(items.valor);
					items.id = parseInt(items.id);
					return items;
				});
				// percorre todo o array e verifica se existe um produto semelhante ao que foi passado no parâmetro da função addProduto()
				let checarSeExiste =
					listaProdutos.filter((item) => item.produto === produto).length > 0; // retorna true ou false

				// valida se o retorno booleano é true (neste caso sim)
				if (checarSeExiste) {
					// percorre todo o array porém, condiciona a um possível produto existente, neste caso sim, ele vai retornar
					// um novo array com o novos valores, isto é, a quantidade (observação: serve para qualquer propriedade)
					listaProdutos.map((items) => {
						if (items.produto === produto) items.produto = items.produto;
						items.quantidade = parseInt(items.quantidade);
						items.valor = parseInt(items.valor);
						items.id = parseInt(items.id);
						items.quantidade += Number(quantidade); // soma o valor existente mais a quantidade repassada na função
						return items;
					});
				} else {
					// não existindo ele adiciona!
					listaProdutos.push(produtos);
				}

				// e por fim, não incrementa, mas sim sobrescreve todo o conteúdo presente no item produtos do localStorage
				localStorage.setItem('produtos', JSON.stringify(listaProdutos));
				console.log(listaProdutos);
				console.log(localStorage.getItem('produtos'));
				window.location.reload();
			}
		}
	} else {
		alert('produto fora de estoque, por favor entre em contato conosco!');
	}
}
