export function changePasswordTemplate() {
    return `
        <div class="setting">
        <div class="grid">
          <div class="change-password">
            <div class="change-password__title">Đổi Mật Khẩu</div>
            <div class="change-password__wrap">
              <div class="change-password__message" style="display:none;"></div>
              <div class="group-info">
                <label for="currentPassword">Mật khẩu hiện tại</label>
                <input type="password" name="currentPassword" id="currentPassword" >
              </div>
              <div class="group-info">
                <label for="newPassword">Mật khẩu mới</label>
                <input type="password" name="newPassword" id="newPassword" >
                <div class="error-message" id="newPasswordError"></div>
              </div>
              <div class="group-info">
                <label for="confirmPassword">Xác nhận mật khẩu mới</label>
                <input type="password" name="confirmPassword" id="confirmPassword" >
                <div class="error-message" id="confirmPasswordError"></div>
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
