let alunos = []

const url = 'http://localhost:5000/skills/descricao?grupo=grupoTeste?sprint=1';

axios.get(url)
  .then(response => {
    const documento = response.data;
    const pontos = documento.pontos;
    const pontosGrupo = document.querySelector('#pontosGrupo');
    pontosGrupo.textContent = pontos;
  })
  .catch(error => {
    console.log(error);
  });

function abrirPopup() {
  window.sessionStorage.setItem("alterarGrupo", true);
  window.open("cadastroGrupo.html", "Cadastro de Grupo", "width=675,height=800");
}

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
        console.log(emailAlunos)
        window.sessionStorage.setItem("alunos", emailAlunos);
        populateSelectEmails('avaliado', emailAlunos)
    })
    .catch((err) => {
        console.warn(err)
    })

    function populateSelectEmails(selectId, array) {
      let selectElement = document.getElementById(selectId);
      for (let email of array) {
          let option = document.createElement('option');
          option.text = email;
          option.value = email;
          selectElement.appendChild(option);
      }
    }
    

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

var pontosPorAluno = null;
var grupoSelected = null;

document.addEventListener("DOMContentLoaded", () => {
    const sprintSelect = document.getElementById("sprint");
    const pontosGrupoLabel = document.getElementById("pontosGrupo");
    const situacaoSprintLabel = document.getElementById("situacaoSprint");
    const pontosAlunoLabel = document.getElementById("pontosAluno");

    const preencherLabels = () => {
      const grupoSelecionado = window.sessionStorage.getItem('nomeGrupoSelecionado');
      grupoSelected = grupoSelecionado

      axios.get(`http://127.0.0.1:5000/pacer/sprints?grupo=${grupoSelecionado}`)
      .then((res) => {
          sprints = res.data
          populateSelectArray('sprint', sprints);
      })

      axios.get(`http://localhost:5000/pacer/numeroDeAlunos?nome=${grupoSelecionado}`) 
        .then(response => {
          const numAlunos = response.data.numero_de_alunos;
  
          axios.get(`http://localhost:5000/pacer/pontos?grupo=${grupoSelecionado}&sprint=${sprintSelect.value}`)
            .then(response => {
              const pontos = response.data.pontos;
              const nota = response.data.situacao;
              pontosPorAluno = Math.ceil(pontos / numAlunos)
              console.log (pontosPorAluno);
              pontosGrupoLabel.textContent = "Pontos disponíveis: " + pontos;
              situacaoSprintLabel.textContent = "Situação da entrega nesta sprint: " + nota;
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    };
  
    sprintSelect.addEventListener("change", preencherLabels);
  
    // Chama a função uma vez ao carregar a página
    preencherLabels();
});

const sendEvaluation = () => {
  const sprintSelect = document.getElementById('sprint');
  const avaliadorSelect = document.getElementById('avaliador');
  const avaliadorValue = window.sessionStorage.getItem('email');
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
  formData.append('pontos_disponiveis', pontosPorAluno)
  formData.append('grupoSelecionado', grupoSelected)

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
