window.addEventListener('load', (event) => {
    console.log('caraio')
    let loginButton = document.getElementById('button-login');
    loginButton.addEventListener('click', (event) => {
        login()
    })

})

const login = () => {
    const emailInput = document.getElementById('email-login');
    const senhaInput = document.getElementById('senha-login');

    let formData = new FormData();
    formData.append('email', emailInput.value);
    formData.append('senha', senhaInput.value);

    axios({
        method: 'POST',
        url: 'http://localhost:5000/pacer/login',
        crossDomain: true,
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        if (response.data == true) {
            window.location.href = "dashboard.html";
        } else {
            alert('Usuário ou senha incorreto!')
            window.location.href = "login.html";
        }
    });
}