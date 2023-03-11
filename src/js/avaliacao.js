let alunos = []

window.addEventListener('load', (event) => {
    if (!window.sessionStorage.getItem('logged')) {
        window.location.href = 'login.html'
    }

    // Faz request p/ backend para pegar a listagem de alunos
    axios.get(window.sessionStorage.getItem('grupoSelecionado'))
    .then((res) => {
        alunos = res.data.alunos
        emailAlunos = []
        alunos.forEach((aluno) => {
            if (aluno != "")
            {
                emailAlunos.push(aluno['email'])
            }
        })
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



axios.get(window.sessionStorage.getItem('grupoSelecionado'))
    .then((res) => {
        const groupData = res.data;
        const skillsList = groupData.skills;

        // popular as labels dos selects de skills
        for (let i = 1; i <= 5; i++) {
            const skillLabelElement = document.querySelector(`label[for="skill${i}"]`);
            skillLabelElement.textContent = skillsList[i-1];
        }

        let url = 'http://localhost:5000/skills/descricao?';

        for (const skill of skillsList) {
        url += `&skill=${encodeURIComponent(skill)}`;
        }

        console.log(url)

        axios.get(url)
        .then(response => {
            const skills = response.data.skills;
            skills.forEach((skill, index) => {
              const skillName = Object.keys(skill)[0]; // pega o nome da skill (por exemplo, "Analítico")
              const skillLevel = skill[skillName][0]; // pega o nível da skill (por exemplo, "teste1")
              const skillTitle = document.querySelectorAll('.pacer-exemplo-title')[index]; // seleciona o elemento com classe "pacer-exemplo-title" de acordo com o índice
              const skillSubtitle = document.querySelectorAll('.pacer-exemplo-subtitle')[index]; // seleciona o elemento com classe "pacer-exemplo-subtitle" de acordo com o índice
              skillTitle.innerHTML = skillName; // atualiza o título com o nome da skill
              skillSubtitle.innerHTML = skillLevel; // atualiza o subtítulo com o nível da skill
            });
          })
          .catch(error => {
            console.log(error);
          });
    })
    .catch((err) => {
        console.warn(err)
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
    formData.append(document.getElementById('skill1-label').innerHTML, skill1.value);
    formData.append(document.getElementById('skill2-label').innerHTML, skill2.value);
    formData.append(document.getElementById('skill3-label').innerHTML, skill3.value);
    formData.append(document.getElementById('skill4-label').innerHTML, skill4.value);
    formData.append(document.getElementById('skill5-label').innerHTML, skill5.value);
    formData.append('nomeGrupo', window.sessionStorage.getItem('nomeGrupoSelecionado'))

    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/pacer',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        alert(response.data)
        location.reload()
    });
}