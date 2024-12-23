function ValidaLogin(e) {
    console.log('ValidaLogin');
    limpaErros(e.target);

    const password = document.getElementsByName('senha')[0];
    const email = document.getElementsByName('email')[0];

    let erros = [
        ...validateRequired(e.target),
    ];

    const listaErros = e.target.querySelector('.lista-erros');
    const ul = generateErrors(erros);
    listaErros.replaceChildren(ul);

    if (erros.length) {
        e.preventDefault();
    }
}

function ValidaLogin(e) {
    console.log('ValidaLogin');
    limpaErros(e.target);

    const erros = validateRequired(e.target); // Executa validações
    const listaErros = e.target.querySelector('.lista-erros');
    const ul = generateErrors(erros);
    listaErros.replaceChildren(ul);

    // Se houver erros, previne o envio do formulário
    if (erros.length > 0) {
        e.preventDefault(); // Previne envio
        console.log('Erros encontrados:', erros);
        return false;
    }

    // Se não houver erros, permite a submissão
    console.log('Formulário válido. Enviando...');
    return true;
}




function generateErrors(erros) {
    const ul = document.createElement('ul');
    ul.classList.add('error-list'); // Adicione uma classe para personalização, se necessário

    erros.forEach((erro) => {
        const li = document.createElement('li');
        li.innerText = erro;
        ul.appendChild(li);
    });

    return ul;
}

function validaCamposIguais(input1, input2) {
    const erros = [];

    if (input1.value !== input2.value) {
        erros.push(`'${input1.placeholder}' e '${input2.placeholder}' devem ser iguais`);
        input1.classList.add('has-error');
        input2.classList.add('has-error');
    }

    if (input1.value.length < 6) {
        erros.push(`'${input1.placeholder}' deve conter no mínimo 6 caracteres`);
        input1.classList.add('has-error');
    }

    return erros;
}

function limpaErros(form) {
    form.querySelectorAll('input').forEach((input) => {
        input.classList.remove('has-error');
    });

    const listaErros = form.querySelector('.lista-erros');
    if (listaErros) {
        listaErros.innerHTML = ''; // Corrigido de innerHtml para innerHTML
    }
}
