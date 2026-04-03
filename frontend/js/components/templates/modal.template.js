export function modalTemplate() {
    return `
        <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__body">

          <!-- Sign in form -->
          <!-- invalid khi kh hop le (chua xu ly xong) -->
          <form class="auth-form" id ="form-sign-in">
            <div class="auth-form__container">
              <div class="auth-form__header">
                <span class="auth-form__header-title">Đăng Nhập</span>
                <span class="auth-form__header-description">Nhập thông tin đăng nhập của bạn để truy cập vào tài khoản</span>
              </div>
              <div class="auth-form__form">
                <div class="form-group ">
                  <input id="email" type="text" class="form-input" placeholder="" required>
                  <label for="email">Email</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="password" type="password" class="form-input" placeholder="" required>
                  <label for="password">Mật khẩu</label>
                  <span class="form-error"></span>
                </div>
                <div class="auth-form__form-option">
                  <label for="checkbox" class="remember-wrapper">
                    <input type="checkbox" name="checkbox" id="checkbox" class="checkbox-input">
                    <span class="checbox-label">
                      Lưu mật khẩu
                    </span>
                  </label>
                  <a href="#" class="fogot-password">Quên mật khẩu?</a>
                </div>
                <button class="confirm-btn">
                  <span class="confirm-btn-text">Đăng nhập</span>
                  <span class="confirm-btn-loading"></span>
                </button>
              </div>
              <div class="auth-form__footer">
                <p>Không có tài khoản?
                  <span class="sign-up-btn">Tạo ngay</span>
                </p>
              </div>
            </div>
          </form>
        
          <!-- Sign up form -->
          <form class="auth-form" id="form-sign-up">
            <div class="auth-form__container">
              <div class="auth-form__header">
                <div class="auth-form__header-title">Đăng ký</div>
                <div class="auth-form__header-description">Đăng ký để tiếp tục</div>
              </div>
              <div class="auth-form__form">
                <div class="form-group">
                  <input id="fullname" type="text" class="form-input" placeholder="" required>
                  <label for="fullname">Họ và tên</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="username" type="text" class="form-input" placeholder="" required>
                  <label for="username">Username</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="email" type="text" class="form-input" placeholder="" required>
                  <label for="email'">Email</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="phone-number" type="text" class="form-input" placeholder="" required>
                  <label for="phone-number">Số điện thoại</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="password" type="password" class="form-input" placeholder="" required>
                  <label for="password">Mật khẩu</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="confirm-password" type="password" class="form-input" placeholder="" required>
                  <label for="confirm-password">xác nhận mật khẩu</label>
                  <span class="form-error"></span>
                </div>
                <button class="confirm-btn">
                  <span class="confirm-btn-text">Đăng Ký</span>
                  <span class="confirm-btn-loading"></span>
                </button>
              </div>
              <div class="auth-form__footer">
                  <p>Đã có tài khoản?
                  <span class="sign-in-btn">Đăng nhập ngay</span>
                  </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
}