window.addEventListener('load', (event) => {
    
    let sairButton = document.getElementById('sair');
    sairButton.addEventListener('click', (event) => {
        window.sessionStorage.clear()
        window.location.href = 'login.html'
    })
})