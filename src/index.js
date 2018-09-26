function component() {
    let element = document.createElement('div');
    element.innerHTML = "Test One more time";
    return element;
}

document.body.appendChild(component());