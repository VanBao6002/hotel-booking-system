export function bookingTemplate() {
    return `
        <div class="booking">
        <div class="grid">
          <div class="booking__picture-wrap">
            <div class="booking__picture">
              <div class="booking__picture-main">
                <div class="booking__picture-main-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
              </div>
              <div class="booking__picture-add">
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
                <div class="booking__picture-add-img">
                  <img src="assets/images/example-room.jpg" alt="hinh">
                </div>
              </div>  
            </div>
          </div>
          <div class="booing__info">
            <section class="booking__info-genaral">
              <div class="booking__info-genaral-head">
                <div class="booking__info-genaral-name">
                  <span>Ten Khach San</span>
                </div>
                <div class="booking__info-genaral-wrap">
                  <div class="booking__info-genaral-price">
                    <div class="booking__info-genaral-price-text">
                      Giá/phòng/đêm từ:
                    </div>
                    <div class="booking__info-genaral-price-current">
                      3.000.000 VND
                    </div>
                  </div>
                  <div class="booking__info-genaral-button">
                    <span>Chọn phòng</span>
                  </div>
                </div>
              </div>
              <div class="booking__info-genaral-body">
                <div class="booking__info-genaral-location">
                  <div class="booking__info-genaral-location-head">
                    <span>
                      Địa chỉ
                    </span>
                  </div>
                  <div class="booking__info-genaral-location-body">
                    <span>Dia chi khach san</span>
                  </div>
                </div>
                <div class="booking__info-genaral-service">
                  <div class="booking__info-genaral-service-head">
                    <span>Tiện ích chính</span>
                  </div>
                  <div class="booking__info-genaral-service-body">
                    <div class="booking__info-genaral-service-list">
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-wifi"></i>
                        <span>
                          Wifi
                        </span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-utensils"></i>
                        <span>
                          Nhà hàng
                        </span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-wind"></i>
                        <span>
                          Máy lạnh
                        </span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-elevator"></i>
                        <span>
                          Thang máy
                        </span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-phone-volume"></i>
                        <span>
                          Lễ tân 24/24
                        </span>
                      </div>
                      <div class="booking__info-genaral-service-item">
                        <i class="fa-solid fa-square-parking"></i>
                        <span>
                          Chỗ đậu xe
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="booking__info-room">
              <div class="booking__info-room-head">
                <span>Những phòng còn trống tại Ten Khach San</span>
              </div>
              <div class="booking__info-room-body">
                <div class="booking__info-room-wrap">
                  <table class="booking__info-room-table">
                    <thead>
                      <tr>
                        <th>Mã phòng</th>
                        <th>Thể loại phòng</th>
                        <th>Khách</th>
                        <th>Giá/phòng/đêm</th>
                        <th>Phòng</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="room-id">R000</td>
                        <td class="room-type">Vip</td>
                        <td class="room-quantity">2</td>
                        <td class="room-price">
                          <div class="room-current__price">500.000 VND</div>
                        </td>
                        <td>x5</td>
                        <td class="detail-button"><button class="room-detail__button">Xem</button></td>
                      </tr>

                      <tr>
                        <td>R000</td>
                        <td>Vip</td>
                        <td>2</td>
                        <td>
                          <div class="room-current__price">500.000 VND</div>
                        </td>
                        <td>x5</td>
                        <td><button class="room-detail__button">Xem</button></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3">Chi phi thanh toan</td>
                        <td>tien</td>
                        <td>Tong phong</td>
                        <td><button class="booking__button">Đặt phòng</button></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div class="booking__info-room-wrap">
                  <table class="booking__info-room-table">
                    <thead>
                      <tr>
                        <th>Mã phòng</th>
                        <th>Thể loại phòng</th>
                        <th>Khách</th>
                        <th>Giá/phòng/đêm</th>
                        <th>Phòng</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="room-id">R000</td>
                        <td class="room-type">Vip</td>
                        <td class="room-quantity">2</td>
                        <td class="room-price">
                          <div class="room-current__price">500.000 VND</div>
                        </td>
                        <td>x5</td>
                        <td class="detail-button"><button class="room-detail__button">Xem</button></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3">Chi phi thanh toan</td>
                        <td>tien</td>
                        <td>Tong phong</td>
                        <td><button class="booking__button">Đặt phòng</button></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </section>
            <section class="booking__info-location">
              <div class="booking__info-loaction-head">
                <span>Những địa điểm nổi bật quanh Ten Khach San</span>
              </div>
              <div class="booking__info-loaction-body">

              </div>
            </section>
            <section class="booking__info-service">
              <div class="booking__info-service-head">
                <span>Tất cả tiện ích tại Ten Khach San</span>
              </div>
              <div class="booking__info-service-body">
                
              </div>
            </section>



            <section class="booking__info-rate">
              <div class="booking__info-rate-head">
                <span>Đánh giá của khách hàng</span>
              </div>
              <div class="booking__info-rate-body">
                <div class="booking__info-rate-overall">
                  <div class="booking__info-rate-overall-wrap">
                    <div class="booing__info-rate-avg">
                      <div class="rate-avg__box-border">
                        <div class="rate-avg__box">
                          <span>4.5</span>
                        </div>
                      </div>
                      <div class="rate-avg__text">
                        <h2>Từ <span></span> đánh giá của khách hàng</h2>
                      </div>
                    </div>
                    <div class="booking__info-rate-detail">
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div class="rate-detail__box">
                        <div class="rate__row"><div class="rate__row-fill"></div></div>
                        <div class="rate__star">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="booking__info-rate-covervation">
                  <div class="booking__info-rate-covervation-head">
                    <span>Bài đánh giá</span>
                  </div>
                  <div class="booking__info-rate-covervation-body">
                    <div class="booking__info-rate-covervation-wrap">
                      <div class="convervation__box">
                        <div class="convervation__user">
                          <div class="convervation__user-avatar">
                            <img src="assets/images/default-avt.png" alt="">
                          </div>
                          <div class="convervation__user-name">
                            <span>Tran Quang Phuoc</span>
                          </div>
                        </div>
                        <div class="convervation__chat">
                          <div class="convervation__chat-info">
                            <div class="convervation__chat-rate">
                              <span>4.0</span>/5 <i class="fa-solid fa-star star"></i>
                            </div>
                            <div class="convervation__chat-time">
                              12/4/2026
                            </div>
                          </div>
                          <div class="convervation__chat-content">
                            <span>Hai bạn nữ lễ tân ca sáng thường xuyên tỏ thái độ với khách khi được nhận yêu cầu về dịch vụ phòng. Rất khó khăn trong việc nhận phòng sớm.</span>
                          </div>
                        </div>
                      </div>
                      <div class="convervation__box">
                        <div class="convervation__user">
                          <div class="convervation__user-avatar">
                            <img src="assets/images/default-avt.png" alt="">
                          </div>
                          <div class="convervation__user-name">
                            <span>Tran Quang Phuoc</span>
                          </div>
                        </div>
                        <div class="convervation__chat">
                          <div class="convervation__chat-info">
                            <div class="convervation__chat-rate">
                              <span>4.0</span>/5 <i class="fa-solid fa-star star"></i>
                            </div>
                            <div class="convervation__chat-time">
                              12/4/2026
                            </div>
                          </div>
                          <div class="convervation__chat-content">
                            <span>Hai bạn nữ lễ tân ca sáng thường xuyên tỏ thái độ với khách khi được nhận yêu cầu về dịch vụ phòng. Rất khó khăn trong việc nhận phòng sớm.</span>
                          </div>
                        </div>
                      </div>
                      <div class="convervation__box">
                        <div class="convervation__user">
                          <div class="convervation__user-avatar">
                            <img src="assets/images/default-avt.png" alt="">
                          </div>
                          <div class="convervation__user-name">
                            <span>Tran Quang Phuoc</span>
                          </div>
                        </div>
                        <div class="convervation__chat">
                          <div class="convervation__chat-info">
                            <div class="convervation__chat-rate">
                              <span>4.0</span>/5 <i class="fa-solid fa-star star"></i>
                            </div>
                            <div class="convervation__chat-time">
                              12/4/2026
                            </div>
                          </div>
                          <div class="convervation__chat-content">
                            <span>Hai bạn nữ lễ tân ca sáng thường xuyên tỏ thái độ với khách khi được nhận yêu cầu về dịch vụ phòng. Rất khó khăn trong việc nhận phòng sớm.jfsjjfsj jsfjsjfjj sjfsjfjsj sjfhe hsfdhsrh lfskfhskj hrkj hr j</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    `;
}