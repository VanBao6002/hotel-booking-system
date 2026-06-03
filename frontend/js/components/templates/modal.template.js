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
                <div class="form-group">
                  <input id="email" type="text" class="form-input" placeholder="">
                  <label for="email">Email</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="password" type="password" class="form-input" placeholder="" >
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
                  <input id="fullname" type="text" class="form-input" placeholder="" >
                  <label for="fullname">Họ và tên</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="username" type="text" class="form-input" placeholder="" >
                  <label for="username">Username</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="email" type="text" class="form-input" placeholder="" >
                  <label for="email'">Email</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="phone-number" type="text" class="form-input" placeholder="" >
                  <label for="phone-number">Số điện thoại</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="password" type="password" class="form-input" placeholder="" >
                  <label for="password">Mật khẩu</label>
                  <span class="form-error"></span>
                </div>
                <div class="form-group">
                  <input id="confirm-password" type="password" class="form-input" placeholder="" >
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


          <div class="show-room">
            <div class="show-room_head">
              <div class="show-room__id">Phong xxx</div>
              <div class="show-room__exit"><i class="fa-solid fa-xmark"></i></div>
            </div>
            <div class="show-room__detail">
              
              <div class="show-room__detail-picture">
                <div class="show-room__detail-img"></div>
              </div>

              <div class="show-room__detail-info">
                <div class="show-room__detail-info-wrap">
                  <div class="show-room__detail-genaral">
                    <div class="show-room__detail-genaral-head">
                      <span>Thông tin phòng</span>
                    </div>
                    <div class="show-room__detail-genaral-body">
                    </div>
                  </div>
                  <div class="show-room-detail-line"></div>
                  <div class="show-room__detail-services">
                    <div class="show-room__detail-services-head">
                      <span>Dịch vụ phòng</span>
                    </div>
                    <div class="show-room__detail-services-body">
                    </div>
                  </div>
                  <div class="show-room-detail-line"></div>
                  <div class="show-room__detail-description">
                    <div class="show-room__detail-description-head">
                      <span>Về phòng này</span>
                    </div>
                    <div class="show-room__detail-description-body">
                    </div>
                  </div>
                </div>
                <div class="choice-room">
                  <div class="choice-room__price">
                    <div>200.000 VND</div>
                    <div> /phòng/đêm</div>
                  </div>
                  <div class="choice-room__button">
                    <div>Thêm lựa chọn phòng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="show__notification">
            <div class="show__notification-wrap">
              <div class="show__notification-head">
                <div class="show__notification-icon">
                  <i class="success__icon fa-solid fa-circle-check"></i>
                  <i class="warning__icon fa-solid fa-circle-exclamation"></i>
                  <i class="error__icon fa-solid fa-circle-xmark"></i>
                </div>
                <div class="show__notification-title">
                  <span></span>
                </div>
              </div>
              <div class="show__notification-body">
                <div class="show__notification-text">

                </div>
              </div>
              <div class="show__notification-footer">
                <div class="confirm-btn show__notification-previous-button">Trở lại</div>
                <div class="confirm-btn show__notification-next-button"></div>
              </div>
            </div>
          </div>
          
          <div class="show__write-review">
            <div class="write-review__wrap">
              <div class="write-review__head">
                <span>Đánh giá của bạn</span>
              </div>
              <div class="write-review__body">
                <div class="write-review__star">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                </div>
                <div class="write-review__text">
                  <textarea name="review" id="review" placeholder="Chia sẻ trải nghiệm của bạn về khách sạn này..."></textarea>
                  <div class="write-review__text-error"></div>
                </div>
              </div>
              <div class="write-review__footer">
                <div class="confirm-btn write-review__cancel-button">Hủy</div>
                <div class="confirm-btn write-review__submit-button">Gửi đánh giá</div>
              </div>
            </div>
          </div>


        </div>
      </div>
    `;
}