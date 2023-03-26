window.addEventListener('load', (event) => {
    let loginButton = document.getElementById('button-login');
    loginButton.addEventListener('click', (event) => {
        login()
    });

})

const login = () => {
    const emailInput = document.getElementById('email-login');
    const senhaInput = document.getElementById('senha-login');
    const mensagemErroTemplate = document.getElementById('mensagem');
    mensagemErroTemplate.innerHTML = '';

    let formData = new FormData();
    formData.append('email', emailInput.value);
    formData.append('senha', senhaInput.value);

    axios({
        method: 'POST',
        url: 'http://127.0.0.1:5000/pacer/login',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        window.sessionStorage.setItem('logged', 'true')
        window.sessionStorage.setItem('nome', response.data['nome'])
        window.sessionStorage.setItem('email', response.data['email'])
        window.sessionStorage.setItem('ra', response.data['ra'])
        window.sessionStorage.setItem('ROLE', response.data['ROLE'])
        if (response.data['ROLE'] == 'ROLE_PROFESSOR') {
            window.sessionStorage.setItem('ROLE', 'ROLE_PROFESSOR')
            window.location.href = "dashboard.html";
        } else if (response.data['ROLE'] == 'ROLE_ADMIN') {
            window.sessionStorage.setItem('ROLE', 'ROLE_ADMIN')
            window.location.href = "index_adm.html";
        } else {
            window.sessionStorage.setItem('ROLE', 'ROLE_ALUNO')
            window.location.href = "index_a.html";
        }
    }).catch(() => {
        mensagemErroTemplate.innerHTML = 'Email ou senha incorretos!';
    });
}