window.addEventListener('load', (event) => {
    if (window.sessionStorage.getItem('logged')) {
        window.location.href = 'dashboard.html'
    //TO DO: Redirecionar usuário para a pagina inicial da ROLE correta.
    }

    let loginButton = document.getElementById('button-login');
    loginButton.addEventListener('click', (event) => {
        login()
    });

})

const login = () => {
    const nomeInput = document.getElementById('nome-login');
    const senhaInput = document.getElementById('senha-login');
    const mensagemErroTemplate = document.getElementById('mensagem');
    mensagemErroTemplate.innerHTML = '';

    let formData = new FormData();
    formData.append('nome', nomeInput.value);
    formData.append('senha', senhaInput.value);

    axios({
        method: 'POST',
        url: 'https://pacerftc-backend.herokuapp.com/pacer/login',
        crossDomain: true,
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        window.sessionStorage.setItem('logged', 'true')
        window.location.href = response.data.primeiroAcesso ? "primeiro-acesso.html" : "dashboard.html";
        //TO DO: Redirecionar usuário para a pagina inicial da ROLE correta.
    }).catch((error) => {
        mensagemErroTemplate.innerHTML = 'Nome ou senha incorretos!';
    });
}