import { isValidEmail, isValidPassword, isValidUsername, isValidPhoneNumber } from "../../utils/utils.js";

const userData = JSON.parse(localStorage.getItem("userData"));

const oldProfile = {
    fullName : userData.fullName ?? "",
    username : userData.userName ?? "",
    email : userData.email ?? "",
    dateOfBirth : userData.dateOfBirth ?? "",
    gender : userData.gender ?? "",
    phoneNumber : userData.phoneNumber ?? "",
    address : userData.currentAddress ?? "",  
}

const newProfile = {
    fullName : userData.fullName ?? "",
    username : userData.userName ?? "",
    email : userData.email ?? "",
    dateOfBirth : userData.dateOfBirth ?? "",
    gender : userData.gender ?? "",
    phoneNumber : userData.phoneNumber ?? "",
    address : userData.currentAddress ?? "",  
}

function isValidProfile() {
    let isValid = true;

    const profileWrap = document.querySelector(".profile__wrap");
    const inputs = profileWrap.querySelectorAll("input");

    for(let input of inputs) {
        if(input.classList.contains("error")) {
            isValid = false;
            break;
        }
    }
    return isValid;
}

function hasProfileChanged() {
    return Object.keys(oldProfile).some(key => oldProfile[key] !== newProfile[key]);
}

function attachChangeHighlight() {
    const profileWrap = document.querySelector(".profile__wrap");
    const inputs = profileWrap.querySelectorAll("input");
    const saveBtn = profileWrap.querySelector(".save-info__btn");
    inputs.forEach(input => {
        input.addEventListener("blur", () => {
            const key = input.name;
            if (oldProfile[key] !== input.value) {
                console.log("changed", input.value, oldProfile[key]);
                input.classList.add("changed");
            } else {
                input.classList.remove("changed");
            }
            newProfile[key] = input.value;
            if(isValidProfile() && hasProfileChanged()) {
                    saveBtn.classList.add("active");
                }
                else {                
                    saveBtn.classList.remove("active");
                }
        });
    });
}

function attachValidation() {
    const profileWrap = document.querySelector(".profile__wrap");
    const emailInput = profileWrap.querySelector("#email");
    const phoneInput = profileWrap.querySelector("#phonenumber");
    const fullNameInput = profileWrap.querySelector("#fullname");

    const errorMessages = {
        fullName: profileWrap.querySelector("#fullNameError"),
        email: profileWrap.querySelector("#emailError"),
        phoneNumber: profileWrap.querySelector("#phoneNumberError"),
        dateOfBirth: profileWrap.querySelector("#dateOfBirthError")
    };
    
    function choiceGender() {
        const genderInput = profileWrap.querySelector("#gender");
        const genderOptions = profileWrap.querySelector(".gender-options");
    
        genderOptions.addEventListener("mousedown",(e) => {
            if(e.target.classList.contains("gender-item")) {
                const selectedGender = e.target.innerText;
                genderInput.value = selectedGender;
            }
        });
    };

    function choiceDateOfBirth() {
        const dateOfBirthInput = profileWrap.querySelector("#dateofbirth");
        const today = new Date().toISOString().split("T")[0];
        dateOfBirthInput.setAttribute("max", today);

        dateOfBirthInput.addEventListener("change", () => {
            const selectedDate = new Date(dateOfBirthInput.value);
            const today = new Date();

            let age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                age--;
            }

            if (age < 18) {
                errorMessages.dateOfBirth.textContent = "Bạn phải đủ 18 tuổi trở lên.";
                dateOfBirthInput.classList.add("error");
            } else {
                errorMessages.dateOfBirth.textContent = "";
                dateOfBirthInput.classList.remove("error");
            }
        });

    }

    choiceGender();
    choiceDateOfBirth();

    fullNameInput.addEventListener("blur", () => { 
        if(fullNameInput.value.trim() === "") {
            errorMessages.fullName.textContent = "Họ và tên không được để trống.";
            fullNameInput.classList.add("error");
        } else {
            errorMessages.fullName.textContent = "";
            fullNameInput.classList.remove("error");
        }
    });

    emailInput.addEventListener("blur", () => {
        if(!isValidEmail(emailInput.value)) {
            errorMessages.email.textContent = "Định dạng email không hợp lệ."; 
            emailInput.classList.add("error");
        } else {
            errorMessages.email.textContent = "";
            emailInput.classList.remove("error");
        }
    });

    phoneInput.addEventListener("blur", () => {
        if(!isValidPhoneNumber(phoneInput.value)) {
            errorMessages.phoneNumber.textContent = "Định dạng số điện thoại không hợp lệ.";
            phoneInput.classList.add("error");
        } else {
            errorMessages.phoneNumber.textContent = "";
            phoneInput.classList.remove("error");
        }
    });
}



function saveProfile() {
    
}

function editProfile() {
    const profileWrap = document.querySelector(".profile__wrap");
    const editIcons = profileWrap.querySelectorAll(".edit");

    editIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const input = icon.nextElementSibling;
            if(input.hasAttribute("readonly")) {
                input.removeAttribute("readonly");
                input.style.pointerEvents = "auto";
                input.focus();
            } else {
                input.setAttribute("readonly", true);
                input.style.pointerEvents = "none";
            }
        });
    });

}



export function initSetting() {
    editProfile();
    attachValidation();
    attachChangeHighlight();

}