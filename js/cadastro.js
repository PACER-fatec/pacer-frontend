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
    const raReg = document.getElementById('ra-reg');

    formData.append('nome', nomeReg.value);
    formData.append('email', emailReg.value);
    formData.append('ra', raReg.value);
    formData.append('senha', senhaInput.value);

    axios({
        method: 'post',
        url: 'https://pacerftc-backend.herokuapp.com/pacer/cadastro',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
    }).then((response) => {
        console.log("Usuario criado!")
    });
}