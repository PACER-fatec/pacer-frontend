let alunos = []

window.addEventListener('load', (event) => {
    if (!window.sessionStorage.getItem('logged')) {
        window.location.href = 'login.html'
    }

    // Faz request p/ backend para pegar a listagem de alunos
    axios.get(window.sessionStorage.getItem('grupoSelecionado'))
    .then((res) => {
        alunos = res.data
        emailAlunos = []
        alunos.forEach((aluno) => {
            if (aluno != "")
            {
                emailAlunos.push(aluno[0]['email'])
            }
        })
        console.log(emailAlunos)
        populateSelectArray('avaliador', emailAlunos)
        populateSelectArray('avaliado', emailAlunos)
    })
    .catch((err) => {
        console.warn(err)
    })

    let sairButton = document.getElementById('sair');
    sairButton.addEventListener('click', (event) => {
        window.sessionStorage.removeItem('logged')
        window.sessionStorage.removeItem('ROLE')
        window.sessionStorage.clear()
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
    const avaliadorValue = avaliadorSelect.options[avaliadorSelect.selectedIndex].innerHTML;
    const avaliadoSelect = document.getElementById('avaliado');
    const avaliadoValue = avaliadoSelect.options[avaliadoSelect.selectedIndex].innerHTML;
    const skill1 = document.getElementById('skill1');
    const skill2 = document.getElementById('skill2');
    const skill3 = document.getElementById('skill3');
    const skill4 = document.getElementById('skill4');
    const skill5 = document.getElementById('skill5');
    const mensagemSpan = document.getElementById('mensagem');

    let formData = new FormData();
    formData.append('sprint', sprintSelect.value);
    formData.append('avaliador', avaliadorValue);
    formData.append('avaliado', avaliadoValue);
    formData.append('skill1', skill1.value);
    formData.append('skill2', skill2.value);
    formData.append('skill3', skill3.value);
    formData.append('skill4', skill4.value);
    formData.append('skill5', skill5.value);
    formData.append('nomeGrupo', window.sessionStorage.getItem('nomeGrupoSelecionado'))

    axios({
        method: 'post',
        url: 'https://pacerftc-backend.herokuapp.com/pacer',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        alert(response.data)
        location.reload()
    });
}