let alunos = []

window.addEventListener('load', (event) => {
    if (!window.sessionStorage.getItem('logged')) {
        window.location.href = 'login.html'
    }

    // Faz request p/ backend para pegar a listagem de alunos
    axios.get(window.sessionStorage.getItem('grupoSelecionado'))
    .then((res) => {
        alunos = res.data
        alunos.forEach((aluno) => {
            if (aluno != "")
            {
                console.log(aluno)
                populateSelect('avaliador', aluno);
                populateSelect('avaliado', aluno);
            }
        });
        window.sessionStorage.removeItem('grupoSelecionado')
    })
    .catch((err) => {
        console.warn(err)
    })

    let sairButton = document.getElementById('sair');
    sairButton.addEventListener('click', (event) => {
        window.sessionStorage.removeItem('logged')
        window.sessionStorage.removeItem('ROLE')
        window.location.href = 'login.html'
    })

    let evaluatorSelect = document.getElementById('avaliador');

});

const clearAssessedSelect = () => {
    let assessedSelect = document.getElementById('avaliado');
    assessedSelect.innerHTML = '';
};

const sendEvaluation = () => {
    const sprintSelect = document.getElementById('sprint');
    const avaliadorSelect = document.getElementById('avaliador');
    const avaliadoSelect = document.getElementById('avaliado');
    const proatividadeSelect = document.getElementById('proatividade');
    const autonomiaSelect = document.getElementById('autonomia');
    const colaboracaoSelect = document.getElementById('colaboracao');
    const resultadosSelect = document.getElementById('entrega-resultados');
    const mensagemSpan = document.getElementById('mensagem');

    let formData = new FormData();
    formData.append('sprint', sprintSelect.value);
    formData.append('avaliador', avaliadorSelect.value);
    formData.append('avaliado', avaliadoSelect.value);
    formData.append('proatividade', proatividadeSelect.value);
    formData.append('autonomia', autonomiaSelect.value);
    formData.append('colaboracao', colaboracaoSelect.value);
    formData.append('entrega-resultados', resultadosSelect.value);

    axios({
        method: 'post',
        url: 'https://pacerftc-backend.herokuapp.com/pacer',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        mensagemSpan.innerHTML = response.data
        changeMessageColor(mensagemSpan.innerHTML); 
    });
}

function changeMessageColor(mensagem) {
    const span = document.getElementById('mensagem');
    if(mensagem == 'Avaliação enviada! Obrigado.') {
        span.style.color = "#32CD32"
    } else {
        span.style.color = '#B22222'
    }
}