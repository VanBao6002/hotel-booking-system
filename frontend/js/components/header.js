// Su kien Dang nhap/ Dang ky
function modalElement() {
    return document.querySelector('.modal');
}

function formSignInElement() {
    return document.querySelector('#form-sign-in');
}

function formSignUpElement() {
    return document.querySelector('#form-sign-up');
}

function modalOverlayElement() {
    return document.querySelector('.modal__overlay');
}

function turnOffModal() {
    modalElement().classList.remove('active');
    
}

function turnOnModal() {
    modalElement().classList.add('active');
}

modalOverlayElement().onclick = () => {
    turnOffModal();
    formSignInElement().style.display = 'none';
    formSignUpElement().style.display = 'none';
}

var signInButton = document.querySelector('.auth__btn-login');
signInButton.onclick = () => {
    turnOnModal();
    formSignInElement().style.display = 'block';
}

var signUpButton = document.querySelector('.auth__btn-regist');
signUpButton.onclick = () => {
    turnOnModal();
    formSignUpElement().style.display = 'block';
}


document.addEventListener("DOMContentLoaded", () => {

    var signInBtn = document.querySelector('.sign-in-btn');
    var signUpBtn = document.querySelector('.sign-up-btn');

    signInBtn.addEventListener("click", () => {
        formSignUpElement().style.display = 'none';
        formSignInElement().style.display = 'block';
    }); 

    signUpBtn.addEventListener("click", () => {
        formSignUpElement().style.display = 'block';
        formSignInElement().style.display = 'none';
    });

})