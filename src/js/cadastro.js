window.addEventListener('load', (event) => {

    let confirmButton = document.getElementById('button-cadastro');
    confirmButton.addEventListener('click', (event) => {
        confirm()
    })

})

const confirm = () => {
    const senhaInput = document.getElementById('senha');
    const confirmacaoInput = document.getElementById('senhaconf-reg-confirmacao');
    const mensagemErroTemplate = document.getElementById('mensagem');
    mensagemErroTemplate.innerHTML = '';

    if (senhaInput.value !== confirmacaoInput.value) {
        mensagemErroTemplate.innerHTML = 'As senhas estão diferentes!'
        return
    }

    let formData = new FormData();

    const nomeReg = document.getElementById('nome-reg');
    const emailReg = document.getElementById('email-reg');
    const emailRegDef = document.getElementById('email-reg-def');
    const raReg = document.getElementById('ra-reg');
    const mensagemSpan = document.getElementById('mensagem');

    formData.append('nome', nomeReg.value);
    formData.append('email', emailReg.value + '' + emailRegDef.value);
    formData.append('ra', raReg.value);
    formData.append('senha', senhaInput.value);

    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/pacer/cadastro',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    }).then((response) => {
        mensagemSpan.innerHTML = response.data
        alert(mensagemSpan.innerHTML)
        window.location.href = 'login.html'
    });
}

function changeMessageColor(mensagem) {
    const span = document.getElementById('mensagem');
    if(mensagem == 'Cadastro concluído!') {
        span.style.color = "#32CD32"
    } else {
        span.style.color = '#B22222'
    }
}