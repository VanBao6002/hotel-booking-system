export function profileTemplate() {
    let fullName = "";
    let username = "";
    let email = ""
    let dateOfBirth = "";
    let gender = "";
    let phoneNumber = "";
    let address = "";
    let country = "";
    const data = localStorage.getItem("userData");
    if(data) {
        const userData = JSON.parse(data);
        if(userData) {
            fullName = userData.fullName || "";
            username = userData.userName || "";
            email = userData.email || "";
            dateOfBirth = userData.dateOfBirth || "";
            gender = userData.gender || "";
            phoneNumber = userData.phoneNumber || "";
            address = userData.currentAddress || "";
            country = "";
        }
    }
    return `
        <div class="setting">
        <div class="grid">
          <div class="profile">
            <div class="profile__title">Thông Tin Cá Nhân</div>
            <div class="profile__wrap">
              <div class="group-info">
                <label for="fullname">Họ và Tên</label>
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" name="fullname" id="fullname" value="${fullName}" readonly>
              </div>
              <div class="group-info">
                <label for="fullname">Username</label>
                <input type="text" name="username" id="username" value="${username}" readonly>
              </div>
              <div class="group-info">
                <label for="fullname">Email</label>
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" name="email" id="email" value="${email}" readonly>
              </div>
              <div class="group-info">
                <div class="group-info-wrap">
                  <div class="group-info-section">
                    <label for="fullname">Ngày sinh</label>
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="date" name="dateofbirth" id="dateofbirth" value="${dateOfBirth}" readonly>
                  </div>
                  <div class="group-info-section">
                    <label for="fullname">Giới tính</label>
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="text" name="gender" id="gender" value="${gender}" readonly>
                  </div>
                </div>
              </div>
              <div class="group-info">
                <label for="fullname">Số điện thoại</label>
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" name="phonenumber" id="phonenumber" value="${phoneNumber}" readonly>
              </div>
              <div class="group-info">
                <div class="group-info-wrap">
                  <div class="group-info-section">
                    <label for="fullname">Địa chỉ</label>
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="text" name="address" id="address" value="${address}" readonly>
                  </div>
                  <div class="group-info-section">
                    <label for="fullname">Quốc gia</label>
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="text" name="country" id="country" value="${country}" readonly>
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