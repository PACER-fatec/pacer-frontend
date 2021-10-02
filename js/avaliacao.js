// Isso é uma mock pra conseguir imaginar o front melhor, tirar isso aqui
let alunos = [
    {
        'id': 1,
        'nome': 'Raimundo Otonni',
        'grupo': 1
    },
    {
        'id': 2,
        'nome': 'Gabriela Antunes',
        'grupo': 1
    },
    {
        'id': 3,
        'nome': 'Geraldo Nunes',
        'grupo': 2
    },
    {
        'id': 4,
        'nome': 'Liliane Moraes',
        'grupo': 2
    }
]

window.addEventListener('load', (event) => {
    // Faz request p/ backend para pegar a listagem de alunos
    // axios.get()
    populateSelect('avaliador', alunos);

    let evaluatorSelect = document.getElementById('avaliador');

    evaluatorSelect.addEventListener('change', (event) => {
        // Faz request p/ backend para pegar específico do grupo ou, caso os alunos 
        // venham com grupo no dicionário, dá pra fazer um array.filter()
        clearAssessedSelect();
        let avaliador = alunos.filter((a) => a.id === parseInt(event.target.value))[0];
        let avaliadoList = alunos.filter((a) => a.grupo === avaliador.grupo && a.id !== avaliador.id);
        populateSelect('avaliado', avaliadoList);
    });
});

const clearAssessedSelect = () => {
    let assessedSelect = document.getElementById('avaliado');
    assessedSelect.innerHTML = '';
};