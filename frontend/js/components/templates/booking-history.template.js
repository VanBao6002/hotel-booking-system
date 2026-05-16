export function bookingHistoryTemplate() {
    return `
    <div class="booking-history">
        <div class="grid">
          <div class="booking-history__head">
            <div class="booking-history-title">
              <span>Lịch sử đặt phòng</span>
            </div>
          </div>
          <div class="booking-history__body">
            <table class="history-table">
              <thead>
                <tr>
                  <th>Mã đặt phòng</th>
                  <th>Khách sạn</th>
                  <th>Phòng đã đặt</th>
                  <th>Ngày nhận phòng</th>
                  <th>Ngày trả phòng</th>
                  <th>Tổng tiền</th>
                  <th>Thời gian đặt phòng</th>
                  <th>Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PH001</td>
                  <td>Khách sạn ABC</td>
                  <td>Phòng đơn</td>
                  <td>12/4/2026</td>
                  <td>13/4/2026</td>
                  <td>400.000 VND</td> 
                  <td>12/4/2026 10:00 AM</td>
                  <td>da danh gia</td>
              </tbody>
            </table>
          </div>
        </div>
    `;
}