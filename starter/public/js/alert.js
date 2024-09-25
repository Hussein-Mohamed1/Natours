

export const hideAlert = () => {
    const alert = document.querySelector('.alert');
    if (alert)
        alert.remove();
}

export const showAlert = (type, message) => {
    const alert = `<div class="alert alert--${type}"> ${message}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', alert);
    window.setTimeout(hideAlert, 5000);
}