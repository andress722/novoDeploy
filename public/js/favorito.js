function favoritar(e){
    console.log('favorito')
    let soma
    const favorito = e.target
        if(favorito.src.endsWith('⭐')){
            favorito.src = '⭐'
            soma = -1
    }else{
        favorito.src = ''
        soma = 1
    }
}