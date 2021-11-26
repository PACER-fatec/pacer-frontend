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

const populateSelect = (selectId, optionsList, sameNameAndValue = false) => {
    let select = document.getElementById(`${selectId}`);
    optionsList.forEach((option) => {
        if (sameNameAndValue) {
            createOption(option.nome, option.nome, select)
        } else {
            createOption(option._id, option.nome, select)
        }
    });
}

const populateSelectArray = (selectId, optionsList) => {
    let select = document.getElementById(`${selectId}`);
    optionsList.forEach((option) => {
        createOption(option, option, select)
    });
}