function searchItem(e, nome){
    e.preventDefault()
    
    let parametro = nome
    localStorage.setItem('pesquisa', parametro)
    if(parametro != ''){
        window.location.href = `/procura/${nome}`
    }else{
        window.location.href = `/procura`
    }

    
    
    
}
