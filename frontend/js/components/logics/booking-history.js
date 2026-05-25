import { getBookingHistory } from "../../services/hotel.js";

function handleData(rawData) {
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`; 
    }

    function formatDate(date) {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`; 
    }

    const roomList = rawData.bookingRooms.map(room => room.roomNumber);

    const formattedData = {
        bookingId: rawData.id,
        hotelBranchId: rawData.hotelBranchId,
        roomList: roomList,
        checkInDate: formatDate(rawData.checkInDate),
        checkOutDate: formatDate(rawData.checkOutDate),
        bookingPrice: rawData.bookingPrice,
        bookedAt: formatDateTime(rawData.bookedAt)
    };
    return formattedData;
}

function renderBooking(userId){
    const bokingHistoryBody = document.querySelector(".booking-history__body");
    const tableHead = document.querySelector(".history-table thead");
    const tableBody = document.querySelector(".history-table tbody");
    tableBody.innerHTML = "";
    getBookingHistory(userId)
    .then(response => {
        if(response.length === 0) {
                bokingHistoryBody.innerHTML = `<p class="no-booking" style="text-align:center; font-size: 1.6rem; color: gray">Bạn chưa có lịch sử đặt phòng nào.</p>`;
                return;
            }
        tableHead.innerHTML = `
                    <tr>
                        <th>Mã đặt phòng</th>
                        <th>Khách sạn</th>
                        <th>Phòng đã đặt</th>
                        <th>Ngày nhận phòng</th>
                        <th>Ngày trả phòng</th>
                        <th>Tổng tiền</th>
                        <th>Thời gian đặt phòng</th>
                        <th>Đánh giá</th>
                    </tr>`;
            response.forEach(rawData => {
                const bookingData = handleData(rawData);

                tableBody.innerHTML += `
                    <tr>
                        <td>${bookingData.bookingId}</td>
                        <td>Khách sạn ${bookingData.hotelBranchId}</td>
                        <td>${bookingData.roomList.join(", ")}</td>
                        <td>${bookingData.checkInDate}</td>
                        <td>${bookingData.checkOutDate}</td>
                        <td>${bookingData.bookingPrice} VND</td>
                        <td>${bookingData.bookedAt}</td>
                        <td>Đã đánh giá</td>
                    </tr>
                `;
                });
        })
        .catch(err => console.error("Lỗi khi lấy booking:", err));

}

export function initBookingHistory() {
    renderBooking(JSON.parse(localStorage.getItem("userData")).id);
}
