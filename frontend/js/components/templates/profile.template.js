import { safeJsonParse } from "../../utils/utils.js";

export function profileTemplate() {
    let fullName = "";
    let username = "";
    let email = ""
    let dateOfBirth = "";
    let gender = "";
    let phoneNumber = "";
    let address = "";
    const userData = safeJsonParse(localStorage.getItem("userData"), {});
    if(userData) {
      fullName = userData.fullName ?? "";
      username = userData.userName ?? "";
      email = userData.email ?? "";
      dateOfBirth = userData.dateOfBirth ?? "";
      gender = userData.gender ?? "";
      phoneNumber = userData.phoneNumber ?? "";
      address = userData.currentAddress ?? "";
    }
    return `
        <div class="setting">
        <div class="grid">
          <div class="profile">
            <div class="profile__title">Thông Tin Cá Nhân</div>
            <div class="profile__wrap">
              <div class="group-info">
                <label for="fullname">Họ và Tên</label>
                <i class="edit fa-regular fa-pen-to-square"></i>
                <input type="text" name="fullName" id="fullname" value="${fullName}" readonly style="pointer-events:none;">
                <div class="error-message" id="fullNameError"></div>
              </div>
              <div class="group-info">
                <label for="fullname">Username</label>
                <input type="text" name="username" id="username" value="${username}" readonly style="pointer-events:none;">
              </div>
              <div class="group-info">
                <label for="fullname">Email</label>
                <i class="edit fa-regular fa-pen-to-square"></i>
                <input type="text" name="email" id="email" value="${email}" readonly style="pointer-events:none;">
                <div class="error-message" id="emailError"></div>
              </div>
              <div class="group-info">
                <div class="group-info-wrap">
                  <div class="group-info-section">
                    <label for="fullname">Ngày sinh</label>
                    <i class="edit fa-regular fa-pen-to-square"></i>
                    <input type="date" name="dateOfBirth" id="dateofbirth" value="${dateOfBirth}" readonly style="pointer-events:none;">
                    <div class="error-message" id="dateOfBirthError"></div>
                  </div>
                  <div class="group-info-section">
                    <label for="fullname">Giới tính</label>
                    <i class="edit fa-regular fa-pen-to-square"></i>
                    <input type="text" name="gender" id="gender" value="${gender}" readonly style="pointer-events:none;">
                    <div class="gender-options">
                      <ul class="gender-list">
                        <li class="gender-item" >Nam</li>
                        <li class="gender-item" >Nữ</li>
                        <li class="gender-item" >Khác</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="group-info">
                <label for="fullname">Số điện thoại</label>
                <i class="edit fa-regular fa-pen-to-square"></i>
                <input type="text" name="phoneNumber" id="phonenumber" value="${phoneNumber}" readonly style="pointer-events:none;">
                <div class="error-message" id="phoneNumberError"></div>
              </div>
              <div class="group-info">
                <div class="group-info-wrap">
                  <div class="group-info-section">
                    <label for="fullname">Địa chỉ</label>
                    <i class="edit fa-regular fa-pen-to-square"></i>
                    <input type="text" name="address" id="address" value="${address}" readonly style="pointer-events:none;">
                  </div>
                </div>
              </div>
              <div class="save-info__btn">
                <span>Lưu thông tin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}