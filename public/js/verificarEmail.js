function validaCadastro(e){ 

    limpaErros(e.target)
    
    

    erros = [...validateRequired(e.target)]



    
    if(erros.length){
        e.preventDefault()
    }
    const listaErros = e.target.querySelector('.lista-erros')
    const ul = generateErrors(erros)
    listaErros.replaceChildren(ul)
}


function exececutaCadastro(e){
    e.preventDefault()
}
