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

  // Faz request para o backend para pegar a listagem de alunos
  axios.get(window.sessionStorage.getItem('grupoSelecionado'))
    .then((res) => {
      alunos = res.data.alunos;
      emailAlunos = [];
      alunos.forEach((aluno) => {
        if (aluno !== "") {
          emailAlunos.push(aluno['email']);
        }
      });
      console.log(emailAlunos);
      window.sessionStorage.setItem("alunos", emailAlunos);
      populateSelectEmails('.avaliado-label', emailAlunos);
      disableSkillFields(emailAlunos.length);
    })
    .catch((err) => {
      console.warn(err);
    });

  function populateSelectEmails(selectClass, emailArray) {
    let selectElements = document.querySelectorAll(selectClass);

    for (let i = 0; i < selectElements.length; i++) {
      let selectElement = selectElements[i];
      let formId = selectElement.getAttribute('data-form-id');
      let email = emailArray[formId - 1] || '';

      let option = document.createElement('option');
      option.text = email;
      option.value = email;
      selectElement.appendChild(option);
    }
  }

  function disableSkillFields(numAlunos) {
    let formElements = document.querySelectorAll('.student-form');
  
    formElements.forEach((formElement, index) => {
      let skillSelects = formElement.querySelectorAll('.skill-value');
      let avaliadoLabel = formElement.querySelector('.avaliado-label');
      let formId = avaliadoLabel ? avaliadoLabel.getAttribute('data-form-id') : '';
      let email = avaliadoLabel ? avaliadoLabel.textContent.trim() : '';
  
      if (formId && (formId > numAlunos || email === '')) {
        skillSelects.forEach((select) => {
          select.disabled = true;
        });
      } else {
        skillSelects.forEach((select) => {
          select.disabled = false;
        });
      }
    });
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

        console.log(skillsList)
        const skillLabelElements = document.querySelectorAll('.skill-label');
        const numSkills = skillsList.length;
        
        for (let i = 0; i < skillLabelElements.length; i++) {
          const skillIndex = i % numSkills;
          skillLabelElements[i].textContent = skillsList[skillIndex];
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
var sprintCarregada = false;

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
          if (sprintCarregada == false) {
            sprintCarregada = true
            sprints = res.data
            populateSelectArray('sprint', sprints);
          } 
          axios.get(`http://localhost:5000/pacer/pontos?grupo=${grupoSelecionado}&sprint=${sprintSelect.value}`)
          .then(response => {
            const pontos = response.data.pontos;
            const nota = response.data.situacao;
            pontosGrupoLabel.textContent = "Pontos disponíveis: " + pontos;
            situacaoSprintLabel.textContent = "Situação da entrega nesta sprint: " + nota;
          })
          .catch(error => 
            alert("Sem avaliação do professor para essa sprint"),
            pontosGrupoLabel.textContent = "Pontos disponíveis: SPRINT NÃO AVALIADA PELO PROFESSOR!",
            situacaoSprintLabel.textContent = "Situação da entrega nesta sprint: SPRINT NÃO AVALIADA PELO PROFESSOR!"
        );
      })
    };
  
    sprintSelect.addEventListener("change", preencherLabels);
  
    // Chama a função uma vez ao carregar a página
    preencherLabels();
});

function sendEvaluation() {
  var evaluations = [];
  var forms = document.getElementsByClassName("student-form");

  for (var i = 0; i < forms.length; i++) {
    var form = forms[i];
    var avaliado = form.querySelector(".avaliado-label").textContent.trim();

    // Verificar se o campo "avaliado" está vazio
    if (avaliado !== "Email do avaliado:" && avaliado !== "") {
      var skills = {};
      var skillLabels = form.getElementsByClassName("skill-label");
      var skillValues = form.getElementsByClassName("skill-value");

      for (var j = 0; j < skillLabels.length; j++) {
        var skillLabel = skillLabels[j].textContent.trim();
        var skillValue = skillValues[j].value;

        skills[skillLabel] = skillValue;
      }

      var evaluation = {
        avaliado: avaliado.replace("Email do avaliado:", "").trim(),
        ...skills
      };

      evaluations.push(evaluation);
    }
  }

  var pontos = document.getElementById("pontosGrupo").innerText
  pontos = pontos.replace("Pontos disponíveis: ", "").trim()
  var sprint = document.getElementById("sprint");
  var sprint = sprint.value


  var formData = {
    sprint: sprint,
    avaliador: window.sessionStorage.getItem('email'),
    avaliacoes: evaluations,
    nomeGrupo: window.sessionStorage.getItem('nomeGrupoSelecionado'),
    pontos_disponiveis: pontos
  };


  axios.post('http://127.0.0.1:5000/pacer', formData, {
    headers: {'Content-Type': 'application/json'}
  }).then((response) => {
    alert(response.data);
    location.reload();
  }).catch((error) => {
    console.error('Ocorreu um erro ao enviar a avaliação:', error);
  });
}

