axios.get('http://127.0.0.1:5000/pacer/skills', {}).then((res) => {
  const skills = res.data;
  skills.forEach((topico) => {
    populateSelectArray('skill1', topico.Skills);
    populateSelectArray('skill2', topico.Skills);
    populateSelectArray('skill3', topico.Skills);
    populateSelectArray('skill4', topico.Skills);
    populateSelectArray('skill5', topico.Skills);
  });
})

function populateSelectArray(selectId, array) {
    let selectElement = document.getElementById(selectId);
    for (let skill of array) {
        let skillName = Object.keys(skill)[0];
        let skillOption = document.createElement('option');
        skillOption.text = skillName;
        skillOption.value = skillName;
        selectElement.appendChild(skillOption);
    }
}

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
        method: 'put',
        url: 'http://127.0.0.1:5000/pacer/cadastrarGrupo',
        data: formData,
        headers: {'Content-Type': 'application/http://127.0.0.1:5000' }
    }).then((response) => {
        mensagemErroTemplate.innerHTML = response.data
        alert(mensagemErroTemplate.innerHTML);
        if (mensagemErroTemplate.innerHTML === "Grupo criado com sucesso!" || mensagemErroTemplate.innerHTML === "Grupo atualizado com sucesso!") {
          window.close();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {

  var alterarGrupo = window.sessionStorage.getItem("alterarGrupo");
  if (alterarGrupo === "true") {
    var nomeInput = document.getElementById("nome-reg");
    nomeInput.disabled = true;
    nomeInput.value = window.sessionStorage.getItem("nomeGrupoSelecionado");

    var alunos = window.sessionStorage.getItem("alunos").split(",");

    var emailInputs = document.querySelectorAll(".email-reg-input");
    for (var i = 0; i < emailInputs.length; i++) {
      emailInputs[i].disabled = true;
      emailInputs[i].value = alunos[i] || "";
    }
  }

    // Preenche o email do aluno logado no primeiro input text
    document.getElementById('email1-reg').value = window.sessionStorage.getItem('email');

    // Desabilita o primeiro input text
    document.getElementById('email1-reg').setAttribute('readonly', true);
});
  
  function changeMessageColor(mensagem) {
    const span = document.getElementById('mensagem');
    if (mensagem === 'Cadastro concluído!') {
      span.style.color = '#32CD32';
    } else {
      span.style.color = '#B22222';
    }
}