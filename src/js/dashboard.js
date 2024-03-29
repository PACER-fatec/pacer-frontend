window.addEventListener('load', (event) => {
    if (!window.sessionStorage.getItem('logged')
    && window.sessionStorage.getItem('ROLE') == 'ROLE_ALUNO') {
        window.location.href = 'login.html'
    }

    axios.get('http://127.0.0.1:5000/pacer/sprints')
    .then((res) => {
        sprints = res.data
        populateSelectArray('sprint', sprints);
        populateSelectArray('sprint2', sprints);
        populateSelectArray('sprint3', sprints);
    })
    .catch((err) => {
        console.warn(err)
    })

    axios.get('http://127.0.0.1:5000/pacer/grupos')
    .then((res) => {
      grupos = res.data
      grupos.unshift({ nome: ''})
      populateSelectArray('grupo', grupos.map(g => g.nome));
      populateSelectArray('grupo2', grupos.map(g => g.nome));
      populateSelectArray('grupo3', grupos.map(g => g.nome));
    })
    .catch((err) => {
      console.warn(err)
    })

    let sairButton = document.getElementById('sair');
    sairButton.addEventListener('click', (event) => {
        window.sessionStorage.clear()
        window.location.href = 'login.html'
    })

    let graficoButton = document.getElementById('gerar-grafico');
    graficoButton.addEventListener('click', (event) => {
        getMediaAluno();
    })
})

function extrairRelatorio(){
    axios({
        method: 'GET',
        url: 'http://127.0.0.1:5000/pacer/csvfile',
        responseType: 'blob'
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'relatorio.csv');
        document.body.appendChild(link);
        link.click();
    })
}

function extrairRelatorioFiltrado() {
  const nomeGrupo = document.getElementById("grupo2").value;
  const sprint = document.getElementById("sprint2").value;

  const url = `http://127.0.0.1:5000/pacer/csvfileFiltered?nomeGrupo=${nomeGrupo}&sprint=${sprint}`;

  axios({
      method: 'GET',
      url: url,
      responseType: 'blob'
  }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio.csv');
      document.body.appendChild(link);
      link.click();
  });
}

function habilitar() {
  var inputPontos = document.getElementById("inputPontos");
  var pontosManualCheckbox = document.getElementById("pontosManualCheckbox");
  
  if (pontosManualCheckbox.checked) {
    inputPontos.disabled = false;
  } else {
    inputPontos.disabled = true;
  }
}

let chartInstance = null;

function updateGrafico(dataAluno, dataGrupo, skills) {
  const chartContainer = document.getElementById('chart-container');

  let chartCanvas = document.getElementById('radar-chart');

  if (chartInstance) {
      chartInstance.destroy();
  }

  if (chartCanvas) {
      chartContainer.removeChild(chartCanvas);
  }

  chartCanvas = document.createElement('canvas');
  chartCanvas.id = 'radar-chart';
  chartCanvas.classList.add('radar-chart');
  chartContainer.appendChild(chartCanvas);

  chartCanvas = document.getElementById('radar-chart').getContext('2d');

  const labels = skills && skills["media_aluno"] ? Object.keys(skills["media_aluno"]) : [];
  const dataAlunoValues = skills && skills["media_aluno"] ? Object.values(skills["media_aluno"]) : [];
  const dataGrupoValues = skills && skills["media_grupo"] ? Object.values(skills["media_grupo"]) : [];

  const radarChartData = {
      labels: labels,
      datasets: [
          {
              label: 'Média do Aluno',
              data: dataAlunoValues,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)',
              fill: true
          },
          {
              label: 'Média do Grupo',
              data: dataGrupoValues,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(54, 162, 235)',
              fill: true
          }
      ]
  };

  chartInstance = new Chart(chartCanvas, {
      type: 'radar',
      data: radarChartData,
      options: {
          responsive: false,
          maintainAspectRatio: true,
          scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 3,
                beginAtZero: true
            }
        }
      }
  });
}




let getMediaAluno = () => {
  let sprintSelect = document.getElementById('sprint3');
  let grupoSelect = document.getElementById('grupo3');
  let alunoSelect = document.getElementById('aluno');

  let formData = new FormData();
  formData.append('nome', alunoSelect.value);
  formData.append('sprint', sprintSelect.value);
  formData.append('grupo', grupoSelect.value);

  axios({
      method: 'post',
      url: 'http://127.0.0.1:5000/pacer/media',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'}
  }).then((response) => {
      updateGrafico(alunoSelect.value, grupoSelect.value, response.data);
  });
}


document.addEventListener('DOMContentLoaded', function() {
    const confirmarPontos = document.querySelector('#confirmarPontos');
    confirmarPontos.addEventListener('click', enviarDados);
});

function enviarDados() {
    const situacaoSelect = document.getElementById('inputSit')
    const situacaoValue =  situacaoSelect.options[situacaoSelect.selectedIndex].innerHTML;
    const endpoint = "http://127.0.0.1:5000/pacer/cadastrarAvaliacao";
  
    const nomeGrupo = document.querySelector('#grupo').value;
    const pontos = parseFloat(document.querySelector('#inputPontos').value);
    const sprint = document.querySelector('#sprint').value;
  
    if (nomeGrupo === '' || isNaN(pontos)) {
      alert('Por favor, forneça um nome de grupo e uma avaliação válidos.');
      return;
    }
  
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        nomeGrupo: nomeGrupo,
        avaliacao: {
          sprint: sprint,
          situacao: situacaoValue,
          pontos: pontos
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.hasOwnProperty('message')) {
          alert(data.message);
          window.location.reload();
        } else {
          alert(data.error);
        }
      })
      .catch(error => console.log(error));
  }

document.addEventListener('DOMContentLoaded', function() {
  const grupoSelect = document.getElementById('grupo3');
  const alunoSelect = document.getElementById('aluno');

  grupoSelect.addEventListener('change', function() {
    const grupoSelecionado = grupoSelect.value;
    axios.get(`http://127.0.0.1:5000/pacer/grupoSelecionado?grupo=${grupoSelecionado}`)
      .then(response => {
        const alunos = response.data.alunos;
        alunoSelect.innerHTML = '';

        alunos.forEach(aluno => {
          const option = document.createElement('option');
          option.value = aluno.nome;
          option.text = aluno.nome;
          alunoSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.log(error);
      });
  });
});
  
  