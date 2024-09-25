console.log("hello from bundel!");

import { login, logOut } from './login';
import { disPlayMap } from './leaflet';
import { updateSettings } from './updateSettings';
import { signUp } from './signUp';

// docs
const map = document.getElementById('map');
const signupBtn = document.querySelector('.signup-form .form');
const loginBtn = document.querySelector('.login-form .form');
const logoutBtn = document.querySelector('.nav__el--logout');
const DataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');
if (map) {
    const locations = JSON.parse(map.dataset.locations);
    disPlayMap(locations)
}

if (signupBtn)
    signupBtn.addEventListener('submit', (event) => {
        console.log("Form submitted");
        event.preventDefault();
        const name = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        // console.log(email, password)
        signUp({ name, email, password, passwordConfirm });
    })
if (loginBtn)
    loginBtn.addEventListener('submit', (event) => {
        console.log("Form submitted");
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // console.log(email, password)
        login(email, password);
    })

if (logoutBtn) {
    logoutBtn.addEventListener('click', logOut);
}

if (DataForm) {
    DataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo' , document.getElementById('photo').files[0])
        updateSettings(form, 'data');
    })
}
if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    })
}