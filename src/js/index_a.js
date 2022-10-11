window.onclick = e => {
    window.sessionStorage.setItem("grupoSelecionado", e.target.getAttribute("value"))
} 

window.addEventListener('load', (event) => {

    if (!window.sessionStorage.getItem('logged') 
    && window.sessionStorage.getItem('ROLE') == 'ROLE_PROFESSOR') {
        window.location.href = 'login.html'
    }

    document.getElementById("student-info-nome").innerHTML +=  window.sessionStorage.getItem('nome')
    email = window.sessionStorage.getItem('email')
    document.getElementById("student-info-email").innerHTML +=  window.sessionStorage.getItem('email')
    document.getElementById("student-info-ra").innerHTML +=  window.sessionStorage.getItem('ra')

    let sairButton = document.getElementById('sair');
    sairButton.addEventListener('click', (event) => {
        window.sessionStorage.removeItem('logged')
        window.sessionStorage.removeItem('ROLE')
        window.location.href = 'login.html'
    })

    let lista = document.getElementById("listaGrupos");

    axios.get('https://pacerftc-backend.herokuapp.com/pacer/gruposAlunoLogado', {
        params: {'email': email}
    })
    .then((res) => {
        var i = 0
        res.data.forEach(element => {
            let li = document.createElement("li")
            if (element != null) {
                li.innerText = element
                li.setAttribute('class', 'groupList')
                li.setAttribute('id', 'group ' + i)
                link = "https://pacerftc-backend.herokuapp.com/pacer/grupoSelecionado?grupo=" + element
                li.setAttribute('value', "https://pacerftc-backend.herokuapp.com/pacer/grupoSelecionado?grupo=" + element)
                li.setAttribute('onclick', "location.href='../src/avaliacao.html'")
            }
            else {
                li.innerText = 'Nenhum grupo encontrado!'
            }
            lista.appendChild(li)
            i++
        })
    })
    .catch((err) => {   
        console.warn(err)
    })
})

function cadastroGrupoPopup(){
    varWindow = window.open (
    'cadastroGrupo.html',
    'pagina',
    "width=1500, height=700, left=300, top=25, resizeble=no, scrollbars=no, menubar=no, status=no, titlebar=no, toolbar=no");
}