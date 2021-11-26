window.addEventListener('load', (event) => {
    // if (!window.sessionStorage.getItem('logged')) {
    //     window.location.href = 'login.html'
    // }

    axios.get('http://localhost:5000/pacer/sprints')
    .then((res) => {
        sprints = res.data
        populateSelectArray('sprint', sprints);
    })
    .catch((err) => {
        console.warn(err)
    })

    axios.get('http://localhost:5000/pacer/alunos')
    .then((res) => {
        alunos = res.data
        populateSelect('aluno', alunos, true);
    })
    .catch((err) => {
        console.warn(err)
    })

    let sairButton = document.getElementById('sair');
    sairButton.addEventListener('click', (event) => {
        window.sessionStorage.removeItem('logged')
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
        url: 'http://localhost:5000/pacer/csvfile',
        crossDomain: true,
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
    debugger
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
        url: 'http://localhost:5000/pacer/media',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        updateGrafico(response.data, [])
    });
    
}