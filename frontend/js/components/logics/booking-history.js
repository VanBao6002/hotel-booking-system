import { getBookingHistory } from "../../services/hotel.js";
import { safeJsonParse } from "../../utils/utils.js";
import { submitReview } from "../../services/hotel.js";

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
        bookedAt: formatDateTime(rawData.bookedAt),
        reviewed: rawData.reviewed
    };
    return formattedData;
}

let selectedRating = 0;
let reviewText = "";

function renderBooking(userId){
    
    const bokingHistoryBody = document.querySelector(".booking-history__body");
    const tableHead = document.querySelector(".history-table thead");
    const tableBody = document.querySelector(".history-table tbody");
    
    tableBody.innerHTML = "";
    
    function writeReview() {

        const modal = document.querySelector(".modal");

        const userId = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).id : null;
        let hotelBranchId = null;

        console.log("User ID:", userId);

        const reviewButtons = document.querySelectorAll(".rating-btn");
        const showWriteReview = modal.querySelector(".show__write-review");
        const reviewStars = modal.querySelectorAll(".write-review__star i");
        const submitReviewButton = modal.querySelector(".write-review__submit-button");
        const cancelReviewButton = modal.querySelector(".write-review__cancel-button");        
        let currentBookingId = null;
       
        
        const now = new Date();
        
        reviewButtons.forEach(button => {

            const checkOutDate = button.closest("tr").querySelector("td:nth-child(5)").textContent;            
            const checkOut = new Date(checkOutDate.split("/").reverse().join("-"));
            
            if(checkOut > now && !button.classList.contains("reviewed")) {
                button.classList.remove("active");
                button.textContent = "Chưa thể đánh giá";
            }
            else {
                button.classList.add("active");
                button.textContent = "Đánh giá";
            }

            if(button.classList.contains("reviewed")) {
                button.classList.remove("active");
                button.textContent = "Đã đánh giá";
            }

        });


        reviewButtons.forEach(button => {
            if(button.classList.contains("active")) {
                button.onclick = () => {
                    modal.classList.add("active");
                    showWriteReview.classList.add("active");  
                    currentBookingId = button.dataset.bookingId;  
                    hotelBranchId = button.closest("tr").querySelector("td:nth-child(2)").textContent.replace("Khách sạn ", "").trim();
                    console.log("Current Booking ID:", currentBookingId);
                    console.log("Hotel Branch ID on Click:", hotelBranchId);
                };
            }
        });

        reviewStars.forEach((star, index) => {
            star.onclick = () => {
                selectedRating = index + 1;
                reviewStars.forEach((s, i) => {
                    s.style.color = i < selectedRating ? "#FFD700" : "#ccc";
                });
            };
        });

        function resetReview() {
            const reviewTextEl = document.querySelector(".write-review__text textarea");
            modal.classList.remove("active");
            showWriteReview.classList.remove("active");
            reviewTextEl.value = "";
            reviewText = "";
            selectedRating = 0;
            reviewStars.forEach(s => s.style.color = "#ccc");
        }
        function isValidReview() {
            const reviewTextEl = document.querySelector(".write-review__text textarea").value;
            if(selectedRating === 0 || (reviewTextEl.trim() ?? "") === "") {
                console.log("false", selectedRating, reviewText);
                return false;
            }
            reviewText = reviewTextEl.trim();
            console.log("true", selectedRating, reviewText);
            return true;
        }

        

        cancelReviewButton.onclick = () => {
            resetReview();
            const errorMessageEl = modal.querySelector(".write-review__text-error");
            errorMessageEl.style.display = "none";
        };



        submitReviewButton.onclick = () => {

            if(isValidReview()) {

                submitReview(hotelBranchId, {
                    bookingId: Number(currentBookingId.replace("B-", "")),
                    userId: userId,
                    rating: selectedRating,
                    comment: reviewText.trim(),
                    createdAt: new Date().toISOString().split("T")[0]
                })
                    .then(() => {

                        const activeButton = document.querySelector(`.rating-btn.active[data-booking-id="${currentBookingId}"]`);
                        if(activeButton) {
                            activeButton.classList.remove("active");
                            activeButton.classList.add("reviewed");
                            activeButton.textContent = "Đã đánh giá";
                        }
                        activeButton.onclick = null;
                    })
                resetReview();
            }
            else {
                const errorMessageEl = modal.querySelector(".write-review__text-error");
                errorMessageEl.style.display = "block";
                errorMessageEl.textContent = "Vui lòng chọn số sao và viết đánh giá.";
            }
        };

    }
    
    
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
                let reviewed = "";
                const bookingData = handleData(rawData);
                if(bookingData.reviewed) {
                    reviewed = "reviewed";
                }

                tableBody.innerHTML += `
                    <tr>
                        <td>${bookingData.bookingId}</td>
                        <td>Khách sạn ${bookingData.hotelBranchId}</td>
                        <td>${bookingData.roomList.join(", ")}</td>
                        <td>${bookingData.checkInDate}</td>
                        <td>${bookingData.checkOutDate}</td>
                        <td>${bookingData.bookingPrice.toLocaleString("vi-VN")} VND</td>
                        <td>${bookingData.bookedAt}</td>
                        <td><div class="rating-btn ${reviewed}" data-booking-id="${bookingData.bookingId}"></div></td>
                    </tr>
                `;
                // console.log(bookingData);
            });
        writeReview();
    })
    // .catch(err => console.error("Lỗi khi lấy booking:", err));

    

    
}

function validateReview() {
    const modal = document.querySelector(".modal");
    const reviewTextEl = modal.querySelector(".write-review__text textarea");
    const errorMessageEl = modal.querySelector(".write-review__text-error");
    reviewTextEl.onblur = () => {
        if(reviewTextEl.value.trim() !== "" && selectedRating !== 0) {
            errorMessageEl.style.display = "none";
        }
        else {
            errorMessageEl.style.display = "block";
            errorMessageEl.textContent = "Vui lòng chọn số sao và viết đánh giá.";  
        }
    }
};

export function initBookingHistory() {
    const user = safeJsonParse(localStorage.getItem("userData"), {});
    renderBooking(user?.id);
    validateReview();
}
