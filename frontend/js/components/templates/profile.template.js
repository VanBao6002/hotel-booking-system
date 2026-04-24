export function profileTemplate() {
    return `
        <div class="setting">
        <div class="grid">
          <div class="profile">
            <div class="profile__title">Thông Tin Cá Nhân</div>
            <div class="profile__wrap">
              <div class="group-info">
                <label for="fullname">Họ và Tên</label>
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" name="fullname" id="fullname">
              </div>
              <div class="group-info">
                <label for="fullname">Username</label>
                <input type="text" name="username" id="username">
              </div>
              <div class="group-info">
                <label for="fullname">Email</label>
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" name="email" id="email">
              </div>
              <div class="group-info">
                <div class="group-info-wrap">
                  <div class="group-info-section">
                    <label for="fullname">Ngày sinh</label>
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="date" name="dateofbirth" id="dateofbirth">
                  </div>
                  <div class="group-info-section">
                    <label for="fullname">Giới tính</label>
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="text" name="gender" id="gender">
                  </div>
                </div>
              </div>
              <div class="group-info">
                <label for="fullname">Số điện thoại</label>
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" name="phonenumber" id="phonenumber">
              </div>
              <div class="group-info">
                <div class="group-info-wrap">
                  <div class="group-info-section">
                    <label for="fullname">Địa chỉ</label>
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="text" name="address" id="address">
                  </div>
                  <div class="group-info-section">
                    <label for="fullname">Quốc gia</label>
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="text" name="country" id="country">
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