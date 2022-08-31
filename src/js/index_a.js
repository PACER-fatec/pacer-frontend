window.addEventListener('load', (event) => {

    if (!window.sessionStorage.getItem('logged') 
    && window.sessionStorage.getItem('ROLE') == 'ROLE_PROFESSOR') {
        window.location.href = 'login.html'
    }

    document.getElementById("student-info-nome").innerHTML +=  window.sessionStorage.getItem('nome')
    document.getElementById("student-info-email").innerHTML +=  window.sessionStorage.getItem('email')
    document.getElementById("student-info-ra").innerHTML +=  window.sessionStorage.getItem('ra')

    let sairButton = document.getElementById('sair');
    sairButton.addEventListener('click', (event) => {
        window.sessionStorage.removeItem('logged')
        window.sessionStorage.removeItem('ROLE')
        window.location.href = 'login.html'
    })

})

function cadastroGrupoPopup(){
    varWindow = window.open (
    'cadastroGrupo.html',
    'pagina',
    "width=1500, height=700, left=300, top=25, resizeble=no, scrollbars=no, menubar=no, status=no, titlebar=no, toolbar=no");
}