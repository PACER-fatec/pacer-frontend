window.addEventListener('load', (event) => {

    let confirmButton = document.getElementById('button-confirmar');
    confirmButton.addEventListener('click', (event) => {
        confirm()
    })

})

const confirm = () => {
    const senhaInput = document.getElementById('senha');
    const confirmacaoInput = document.getElementById('senha-confirmacao');
    const mensagemErroTemplate = document.getElementById('mensagem');
    mensagemErroTemplate.innerHTML = '';

    if (senhaInput.value !== confirmacaoInput.value) {
        mensagemErroTemplate.innerHTML = 'As senhas estão diferentes!'
        return
    }

    let formData = new FormData();
    formData.append('senha', senhaInput.value);

    axios({
        method: 'POST',
        url: 'http://127.0.0.1:5000/pacer/login/novasenha',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        window.location.href = 'dashboard.html'
    });
}