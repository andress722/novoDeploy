

function validateRequired(form){
    
    const erros = []
    const inputs = form.querySelectorAll("[data-required]")
    console.log(inputs)
    const nome = document.getElementsByName('nome')
    if(nome.value.length < 4){
        erros.push('O campo nome precisa de mais caracteres!')
        nome.classList.add('has-error')
    }

    inputs.forEach(i => {
        if(!i.value){
            erros.push(`preencha o campo "${i.placeholder}"`)
            i.classList.add('has-error')
            
        }

        
    })
    return erros
}


function generateErrors(erros){
   const ul = document.createElement('ul')
   erros.forEach(e => {
       const li = document.createElement('li')
       li.innerText = e
       ul.appendChild(li)
   })
   return ul
}

function validaCamposIguais(input1,input2){
    const erros = []
    if(input1.value != input2.value){
        erros.push(`'${input1.placeholder}' e '${input2.placeholder}' devem ser iguais`)
        input1.classList.add('has-error')
        input2.classList.add('has-error')
    }
    if(input1.value.length < 6){
        erros.push((`'${input1.placeholder}' deve conter no minimo 6 caracteres`))
        input1.classList.add('has-error')
    }
    return erros
}


function limpaErros(form){
    form.querySelectorAll('input').forEach(i => {
        i.classList.remove('has-error')
    })
    const listaErros = form.querySelector('.lista-erros')
    if(listaErros){
        listaErros.innerHtml = ''
    }
}