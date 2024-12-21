function refreshCard(){
    let carrinho = document.getElementById('cart-number')
    let local = JSON.parse(localStorage.getItem('produtos'))
    let total = local.map(e=> e.quantidade = parseInt(e.quantidade)).reduce((i,t)=> i+t)
    
    carrinho.textContent = total
    
}

addEventListener('load', refreshCard)