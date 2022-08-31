
window.addEventListener('load', (event) => {

    if (!window.sessionStorage.getItem('logged') && 
        !window.sessionStorage.getItem('ROLE') == 'ROLE_ALUNO') {
            alert("Você precisa estar logado como aluno para acessar esta página!")
            window.sessionStorage.clear()
            window.close()
    }

})

const criarGrupo = () => {

    const alunos = {}
    const skills = {}

    const nomeGrupo = document.getElementById('nome-reg').value;

    const materia = document.getElementById('materia').value;

    const mensagemErroTemplate = document.getElementById('mensagem');
    mensagemErroTemplate.innerHTML = '';

    let formData = new FormData();

    formData = {
        nome: nomeGrupo,
        alunos: [document.getElementById('email1-reg').value,
                document.getElementById('email2-reg').value,
                document.getElementById('email3-reg').value,
                document.getElementById('email4-reg').value,
                document.getElementById('email5-reg').value],
        skills: [document.getElementById('skill1').value,
                document.getElementById('skill2').value,
                document.getElementById('skill3').value,
                document.getElementById('skill4').value,
                document.getElementById('skill5').value],
        materia: materia
    }

    axios({
        method: 'post',
        url: 'https://pacerftc-backend.herokuapp.com/pacer/cadastrarGrupo',
        data: formData,
        headers: {'Content-Type': 'application/json' }
    }).then((response) => {
        mensagemErroTemplate.innerHTML = response.data
        changeMessageColor(mensagemErroTemplate.innerHTML); 
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