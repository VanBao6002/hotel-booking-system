// Su kien Dang nhap/ Dang ky

const getModal = () => { return document.querySelector(".modal"); }
const getFormSignIn = () => { return document.querySelector("#form-sign-in");}
const getFormSignUp = () => { return document.querySelector("#form-sign-up");}
const getModalOverlay = () => { return document.querySelector(".modal__overlay");}


export function turnOffModal() {
    getModal().classList.remove('active');
}

function turnOnModal() {
    getModal().classList.add('active');
}

export function showForm(type) {
    const isSignIn = type === "sign-in";
    getFormSignIn().style.display = isSignIn ? "block" : "none";
    getFormSignUp().style.display = isSignIn ? "none" : "block";
}

export function hideAllForm() {
    getFormSignIn().style.display = "none";
    getFormSignUp().style.display = "none";
}



export function initHeader() {
    getModalOverlay().addEventListener("click", () => {
        turnOffModal();
        hideAllForm();
    });

    document.querySelector('.auth__btn-login').addEventListener("click", () => {
        turnOnModal();
        showForm("sign-in");
    });
    document.querySelector('.auth__btn-regist').addEventListener("click", () => {
        turnOnModal();
        showForm("sign-up");
    });

    document.querySelector(".sign-in-btn").addEventListener("click", () => {
        showForm("sign-in");
    });
    document.querySelector(".sign-up-btn").addEventListener("click", () => {
        showForm("sign-up");
    });
}
