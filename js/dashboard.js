window.addEventListener('load', (event) => {
    // if (!window.sessionStorage.getItem('logged')) {
    //     window.location.href = 'login.html'
    // }

    let sairButton = document.getElementById('sair');
    sairButton.addEventListener('click', (event) => {
        window.sessionStorage.removeItem('logged')
        window.location.href = 'login.html'
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
    const chartCanvas = document.getElementById('radar-chart').getContext('2d');
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