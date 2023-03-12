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
    })
    .catch((err) => {
        console.warn(err)
    })

    axios.get('http://127.0.0.1:5000/pacer/grupos')
    .then((res) => {
      grupos = res.data
      populateSelectArray('grupo', grupos.map(g => g.nome));
      populateSelectArray('grupo2', grupos.map(g => g.nome));
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

    let dataAluno = []
    let dataGrupo = []
    updateGrafico(dataAluno, dataGrupo);
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

function updateGrafico (dataAluno, dataGrupo) {
    const chartContainer = document.getElementById('chart-container');
    let chartCanvas = document.getElementById('radar-chart')

    if (chartCanvas) {
        chartContainer.removeChild(chartCanvas)

        chartCanvas = document.createElement('canvas')
        chartCanvas.id = 'radar-chart'
        chartCanvas.classList.add('radar-chart')
        chartContainer.appendChild(chartCanvas)
    }

    chartCanvas = chartCanvas.getContext('2d');
    var options = {
        responsive: false,
        maintainAspectRatio: true,
        scale: {
            ticks: {
                beginAtZero: true,
                max: 3
            }
        }
    };
    const radarChart = new Chart(chartCanvas, {
        type: 'radar',
        data: {
            labels: [
              'Proatividade',
              'Autonomia',
              'Colaboração',
              'Entrega de Resultados'
            ],
            datasets: [{
              label: 'Média do Aluno',
              data: dataAluno,
              fill: true,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)'
            }, {
              label: 'Média do Grupo',
              data: dataGrupo,
              fill: true,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(54, 162, 235)'
            }]
        },
        options: {
            scale: {
                r: {
                    min: 0,
                    max: 3
                }
            }
        }
    })
}

let getMediaAluno = () => {
    let sprintSelect = document.getElementById('sprint');
    let alunoSelect = document.getElementById('aluno');

    let formData = new FormData();
    formData.append('nome', alunoSelect.value);
    formData.append('sprint', sprintSelect.value);

    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/pacer/media',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        updateGrafico(response.data.aluno, response.data.grupo)
    });
    
}

function habilitar(){
	if(document.getElementById('pontosManualCheckbox').checked){
		document.getElementById('inputPontos').disabled = false;
	} else {
		document.getElementById('inputPontos').disabled = true;
	}
}

document.addEventListener('DOMContentLoaded', function() {
    const inputNota = document.querySelector('#inputNota');
    inputNota.addEventListener('input', calcularPontos);
    const confirmarPontos = document.querySelector('#confirmarPontos');
    confirmarPontos.addEventListener('click', enviarDados);
});

function calcularPontos() {
    const nota = parseFloat(document.querySelector('input[type="number"]').value);
    const endpoint = "http://127.0.0.1:5000/pacer/grupoSelecionado?grupo=" + document.querySelector('#grupo').value;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const quantidadeAlunos = data.alunos.length;
            const valorNotaMaxima = quantidadeAlunos * 15;
            const pontos = Math.round((nota / 10) * valorNotaMaxima); // arredonda para o inteiro mais próximo
            document.querySelector('#inputPontos').value = pontos;
        })
        .catch(error => console.log(error));
}
function enviarDados() {
    const nota = parseFloat(document.querySelector('input[type="number"]').value);
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
          nota: nota,
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