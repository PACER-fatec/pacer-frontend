const renderHTMLTemplate = (node, template) => {
    if (!node) return
    node.innerHTML = template;
}

const appendTo = (node, element) => {
    node.appendChild(element);
}

const createOption = (value, text, father) => {
    let option = document.createElement('option');
    option.value = value;
    option.innerHTML = text

    appendTo(father, option);
}

const populateSelect = (selectId, optionsList) => {
    let select = document.getElementById(`${selectId}`);
    optionsList.forEach((option) => {
        createOption(option.id, option.nome, select)
    });
}