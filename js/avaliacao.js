let alunos = []

window.addEventListener('load', (event) => {
    // Faz request p/ backend para pegar a listagem de alunos
    axios.get('http://localhost:5000/pacer/alunos')
    .then((res) => {
        alunos = res.data
        populateSelect('avaliador', alunos);
    })
    .catch((err) => {
        console.warn(err)
    })


    let evaluatorSelect = document.getElementById('avaliador');

    evaluatorSelect.addEventListener('change', (event) => {
        // Filtra alunos do mesmo gtupo e popula o segundo select
        clearAssessedSelect();
        let avaliador = alunos.filter((a) => a._id === event.target.value)[0];
        let avaliadoList = alunos.filter((a) => a.grupo === avaliador.grupo && a._id !== avaliador._id);
        populateSelect('avaliado', avaliadoList);
    });
});

const clearAssessedSelect = () => {
    let assessedSelect = document.getElementById('avaliado');
    assessedSelect.innerHTML = '';
};

const sendEvaluation = () => {
    const sprintSelect = document.getElementById('sprint');
    const avaliadorSelect = document.getElementById('avaliador');
    const avaliadoSelect = document.getElementById('avaliado');
    const proatividadeSelect = document.getElementById('proatividade');
    const autonomiaSelect = document.getElementById('autonomia');
    const colaboracaoSelect = document.getElementById('colaboracao');
    const resultadosSelect = document.getElementById('entrega-resultados');
    const mensagemSpan = document.getElementById('mensagem');

    let formData = new FormData();
    formData.append('sprint', sprintSelect.value);
    formData.append('avaliador', avaliadorSelect.value);
    formData.append('avaliado', avaliadoSelect.value);
    formData.append('proatividade', proatividadeSelect.value);
    formData.append('autonomia', autonomiaSelect.value);
    formData.append('colaboracao', colaboracaoSelect.value);
    formData.append('entrega-resultados', resultadosSelect.value);

    axios({
        method: 'post',
        url: 'http://localhost:5000/pacer',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
        mensagemSpan.innerHTML = response.data
    });
}