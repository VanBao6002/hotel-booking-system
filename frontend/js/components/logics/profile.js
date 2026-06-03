import { updateMe } from "../../services/users.js";
import { isValidEmail, isValidPassword, isValidUsername, isValidPhoneNumber, safeJsonParse } from "../../utils/utils.js";

const userData = safeJsonParse(localStorage.getItem("userData"), {});

// if(userData) {
    const oldProfile = {
        fullName : userData.fullName ?? "",
        email : userData.email ?? "",
        dateOfBirth : userData.dateOfBirth ?? "",
        gender : userData.gender ?? "",
        phoneNumber : userData.phoneNumber ?? "",
        currentAddress : userData.currentAddress ?? "",  
    }
    
    const newProfile = {
        fullName : userData.fullName ?? "",
        email : userData.email ?? "",
        dateOfBirth : userData.dateOfBirth ?? "",
        gender : userData.gender ?? "",
        phoneNumber : userData.phoneNumber ?? "",
        currentAddress : userData.currentAddress ?? "",  
    }
    
// }
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
    return Object.keys(oldProfile).some(key => String(oldProfile[key] ?? "").trim() !== String(newProfile[key] ?? "").trim());
}

function updateSaveButtonState() {
    const profileWrap = document.querySelector(".profile__wrap");
    const saveBtn = profileWrap?.querySelector(".save-info__btn");
    if (!saveBtn) return;

    if (isValidProfile() && hasProfileChanged()) {
        saveBtn.classList.add("active");
    } else {
        saveBtn.classList.remove("active");
    }
}

function attachChangeHighlight() {
    const profileWrap = document.querySelector(".profile__wrap");
    const inputs = profileWrap?.querySelectorAll("input") || [];

    const updateField = (input) => {
        const key = input.name;
        if (oldProfile[key] !== input.value) {
            input.classList.add("changed");
        } else {
            input.classList.remove("changed");
        }
        newProfile[key] = input.value;
        updateSaveButtonState();
    };

    inputs.forEach(input => {
        input.addEventListener("input", () => updateField(input));
        input.addEventListener("blur", () => updateField(input));
        input.addEventListener("change", () => updateField(input));
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
                newProfile.gender = selectedGender;
                genderInput.classList.toggle("changed", oldProfile.gender !== selectedGender);
                updateSaveButtonState();
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
                newProfile.dateOfBirth = dateOfBirthInput.value;
                updateSaveButtonState();
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
            updateSaveButtonState();
        }
    });

    emailInput.addEventListener("blur", () => {
        if(!isValidEmail(emailInput.value)) {
            errorMessages.email.textContent = "Định dạng email không hợp lệ."; 
            emailInput.classList.add("error");
        } else {
            errorMessages.email.textContent = "";
            emailInput.classList.remove("error");
            updateSaveButtonState();
        }
    });

    phoneInput.addEventListener("blur", () => {
        if(!isValidPhoneNumber(phoneInput.value)) {
            errorMessages.phoneNumber.textContent = "Định dạng số điện thoại không hợp lệ.";
            phoneInput.classList.add("error");
        } else {
            errorMessages.phoneNumber.textContent = "";
            phoneInput.classList.remove("error");
            updateSaveButtonState();
        }
    });
}



function saveProfile() {
    const saveBtn = document.querySelector(".save-info__btn");
    if (!saveBtn) return;

    const modal = document.querySelector(".modal");
    const showNotification = modal.querySelector(".show__notification");
    const notificationTitle = showNotification.querySelector(".show__notification-title span");
    const notificationMessage = showNotification.querySelector(".show__notification-text");


    saveBtn.onclick = function() {
        if (!saveBtn.classList.contains("active")) return;

        console.log("Thông tin hợp lệ. Thực hiện lưu thông tin cá nhân.");
        updateMe(newProfile)
            .then(() => {
                modal.classList.add("active");
                showNotification.classList.remove("error", "warning", "success", "qrcode");
                showNotification.classList.add("show", "success");
                notificationTitle.innerText = "Thành công!";
                notificationMessage.innerText = "Thông tin cá nhân của bạn đã được cập nhật.";
                Object.assign(oldProfile, newProfile);
                updateSaveButtonState();

                const newUserData = JSON.parse(localStorage.getItem("userData")) || {};
                newUserData.fullName = newProfile.fullName;
                newUserData.email = newProfile.email;
                newUserData.dateOfBirth = newProfile.dateOfBirth;
                newUserData.gender = newProfile.gender;
                newUserData.phoneNumber = newProfile.phoneNumber;
                newUserData.currentAddress = newProfile.currentAddress;

                localStorage.setItem("userData", JSON.stringify(newUserData));
            })
            .catch((error) => {
                modal.classList.add("active");
                showNotification.classList.remove("error", "warning", "success", "qrcode");
                showNotification.classList.add("show", "error");
                notificationTitle.innerText = "Lỗi!";
                notificationMessage.innerText = "Đã có lỗi xảy ra. Vui lòng thử lại.";
                console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
            });
        console.log(newProfile);
    }
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
export function initProfile() {
    editProfile();
    attachValidation();
    attachChangeHighlight();
    saveProfile();
    updateSaveButtonState();
}



