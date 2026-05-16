export function changePasswordTemplate() {
    return `
        <div class="setting">
        <div class="grid">
          <div class="change-password">
            <div class="change-password__title">Thông Tin Cá Nhân</div>
            <div class="change-password__wrap">
              <div class="group-info">
                <label for="fullname">Mật khẩu hiện tại</label>
                <input type="password" name="fullname" id="fullname" readonly>
              </div>
              <div class="group-info">
                <label for="fullname">Mật khẩu mới</label>
                <input type="password" name="username" id="username" readonly>
              </div>
              <div class="group-info">
                <label for="fullname">Xác nhận mật khẩu mới</label>
                <input type="password" name="email" id="email" readonly>
              </div>
              <div class="save-info__btn">
                <span>Xác nhận</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}