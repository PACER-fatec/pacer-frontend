function abrirPopup() {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.style.display = 'flex';
}

function fecharPopup() {
  const popupContainer = document.getElementById('popup-container');
  popupContainer.style.display = 'none';
}

function enviarSkill(event) {
  event.preventDefault();

  const skillNomeInput = document.getElementById('skill-nome');
  const skillDescricaoInput = document.getElementById('skill-descricao');

  const novaSkill = {
    Topico: 'SKILLS CRIADAS',
    Skills: [
      {
        [skillNomeInput.value]: [skillDescricaoInput.value]
      }
    ]
  };

  axios.post('http://127.0.0.1:5000/pacer/cadastroSkills', novaSkill)
    .then(response => {
      console.log(response.data);
      alert(response.data['message']);
      fecharPopup();
      // Exibir mensagem de sucesso, atualizar a página ou realizar outras ações necessárias
    });
}
