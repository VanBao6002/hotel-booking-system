// global var

const emailField = {
    selector: "#email",
    validate: isValidEmail,
    message: "Không đúng định dạng email hoặc chưa nhập email"
}

const passwordField = {
    selector: "#password",
    validate: function(password) {
        return password != "" ? true : false;
    },
    message: "Chưa nhập mật khẩu"
}

const fullnameField = {
    selector: "#fullname",
    validate: function(fullname) {
        return fullname != "" ? true : false;
    },
    message: "Chưa nhập Họ và Tên"
}

const usernameField = {
    selector: "#username",
    validate: isValidUsername,
    message: "Tên người dùng phải có độ dài từ 3 đến 16 ký tự, chỉ được phép chứa chữ cái, chữ số hoặc dấu gạch dưới, và không được bắt đầu bằng số hoặc dấu gạch dưới"
}

const phoneNumberField = {
    selector: "#phone-number",
    validate: isValidPhoneNumber,
    message: "Số điện thoại không hợp lệ"
}

const passwordFieldSIgnUp = {
    selector: "#password",
    validate: isValidPassword,
    message: "Mật khẩu mạnh, tối thiểu 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt"
}

const confirmPasswordField = {
    selector: "#confirm-password",
    validate: function(confirmPassword) {
        const password = document.querySelector("#form-sign-up #password");
        return confirmPassword === password.value ? true : false;
    },
    message: "Mật khẩu không khớp"
}


// Su kien Dang nhap/ Dang ky

import { userLogin } from "../../services/login.js";

const getModal = () => { return document.querySelector(".modal"); }
const getSignInForm = () => { return document.querySelector("#form-sign-in");}
const getSignUpForm = () => { return document.querySelector("#form-sign-up");}
const getModalOverlay = () => { return document.querySelector(".modal .modal__overlay");}


export function turnOffModal() {
    getModal().classList.remove('active');
}

function turnOnModal() {
    getModal().classList.add('active');
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePassword(password, confirmPassword) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isStrong = regex.test(password);
    const isMatch = password === confirmPassword;
    return isStrong && isMatch;
}

function isValidPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

function isValidUsername(username) {
    const regex = /^(?![_0-9])[a-zA-Z0-9_]{3,16}$/;
    const forbidden = ["admin", "root", "system"];
    return regex.test(username) && !forbidden.includes(username.toLowerCase());
}

function isValidPhoneNumber(phone) {
    const regex = /^(0[3|5|7|8|9][0-9]{8}|(\+84)[3|5|7|8|9][0-9]{8})$/;
    return regex.test(phone);
}


export function showForm(type) {
    const isSignIn = type === "sign-in";
    getSignInForm().style.display = isSignIn ? "block" : "none";
    getSignUpForm().style.display = isSignIn ? "none" : "block";
    getModal().querySelectorAll(".form-group").forEach(e => {
        e.querySelector(".form-error").innerText = "";
        e.querySelector("input").value = "";
        e.classList.remove("invalid");
    });
}

export function hideAllForm() {
    getSignInForm().style.display = "none";
    getSignUpForm().style.display = "none";
    
}


function attachValidation(formID, rules) {
    const form = document.getElementById(formID);

    rules.forEach(rule => {
        const filed = form.querySelector(rule.selector);
        const inputGroup = filed.closest(".form-group");
        const errorMessage = inputGroup.querySelector(".form-error");

        filed.addEventListener("blur", () => {
            if(!rule.validate(filed.value)) {
                inputGroup.classList.add("invalid");
                errorMessage.innerText = rule.message;
            }
            else {
                inputGroup.classList.remove("invalid");
                errorMessage.innerText = "";
            }
        });
    })
}


function submitForm(){
    const submitButton = getModal().querySelectorAll(".confirm-btn");

    let response = {};

    // sign in

    function handleClick(e) {
        e.preventDefault();
        const inputs = getSignInForm().querySelectorAll(".form-input");
        for(let input of inputs) {
            if(input.value === "") {
                return;
            }
        }
        
        turnOffModal();
        hideAllForm();
    }

    submitButton[0].addEventListener("click", handleClick);
    // sign up
    submitButton[1].addEventListener("click", (e) => {
        e.preventDefault();
    });

    console.log(getSignInForm().querySelectorAll(".form-input"));
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


    attachValidation("form-sign-in",[emailField,passwordField]);
    attachValidation("form-sign-up",[fullnameField,usernameField,emailField,phoneNumberField,passwordFieldSIgnUp,confirmPasswordField]);
    submitForm();
}
