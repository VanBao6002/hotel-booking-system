import { getReviewsHotel } from "../../services/hotel.js";
import { HotelService } from "../../utils/utils.js";

let isShowRoomDetailInit = false;


function renderHotelGenaral(hotelName, price, address, phoneNumber){
    document.querySelector(".booking__info-genaral-name span").innerText = hotelName;
    document.querySelector(".booking__info-genaral-price-current").innerText= price.toLocaleString("vi-VN") + " VNĐ";
    document.querySelector(".booking__info-genaral-contact-body span:nth-child(1)").innerText = "Địa chỉ: " + address;
    document.querySelector(".booking__info-genaral-contact-body span:nth-child(2)").innerText = "Số điện thoại: " + phoneNumber;
}

function renderRoomType(rooms, roomType) {
    let html = "";
    let rowsHtml = "";
    let roomTitle = "";

    if(roomType === "SINGLE") {
        roomTitle = "Phòng đơn";
    }
    else {
        roomTitle = "Phòng đôi";
    }
    
    if(rooms.length > 0) {
        
        rooms.forEach(room => {
            rowsHtml += `
                <tr data-room-id="${room.id}" data-type-code="${room.typeCode}" data-room-price="${room.price}">
                    <td>${room.roomNumber}</td>
                    <td>Tầng ${room.floor}</td>
                    <td>${room.numberOfBed}</td>
                    <td><div class="room-current__price">${room.price.toLocaleString("vi-VN")} VND</div></td>
                    <td class="detail-button"><button class="room-detail__button">Xem</button></td>
                    <td class="choice-button"><button class="room-choice__button">Chọn</button></td>
                </tr>
            `
        });
        
        html = `
            <div class="booking__info-room-type-code">
                <span class="booking__info-room-type">${roomTitle}</span>
                <div class="booking__info-room-wrap">
                    <table class="booking__info-room-table">
                        <thead>
                            <tr>
                                <th>Số phòng</th><th>Vị trí</th><th>Khách</th><th>Giá/phòng/đêm</th><th>Chi tiết</th><th>Chọn phòng</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
            `
    }

    return html;

}

function renderService(services) {
    let html = "";
    let serviceHtml = "";

    if(services.length > 0) {
        
        services.forEach(service => {
            serviceHtml += `
                <div class="booking__info-service-item">
                    <span>${service}</span>
                </div>
            `
        });

        html = `
        <div class="booking__info-service-list">
            ${serviceHtml}
        </div>
        `;
    }
    return html;

}

let confirmDetail = {
    singleRoomsId: [],
    doubleRoomsId: [],
    totalPrice: 0,
}


function updateConfirmTable() {
    const confirmTable = document.querySelector(".booking__info-confirm .booking__info-room-table");
    confirmTable.innerHTML = `
        <tr>
            <th>Phòng đơn</th>
            <th>Phòng đôi</th>
            <th>Tổng tiền</th>
            <th>Xác nhận</th>
        </tr>
        <tr>
            <td>${confirmDetail.singleRoomsId.length}</td>
            <td>${confirmDetail.doubleRoomsId.length}</td>
            <td><div class="room-total-price">${confirmDetail.totalPrice.toLocaleString("vi-VN")} VND</div></td>
            <td class="choice-button"><button class="room-choice__button">Xác nhận</button></td>
        </tr>
    `

    // document.querySelector(".booking__info-confirm .room-choice__button").addEventListener("click", () => {

    // });
}

function updateConfirmDetail(roomId, typeCode, roomPrice , choice = true){
    if(choice) {
        if(typeCode === "SINGLE") confirmDetail.singleRoomsId.push(roomId);
        else confirmDetail.doubleRoomsId.push(roomId);
        confirmDetail.totalPrice += roomPrice;
    }
    else {
        if(typeCode === "SINGLE") {
            confirmDetail.singleRoomsId = confirmDetail.singleRoomsId.filter(id => id !== roomId);
        } 
        else {
            confirmDetail.doubleRoomsId = confirmDetail.doubleRoomsId.filter(id => id !== roomId);
        }
        confirmDetail.totalPrice -= roomPrice;
    }
}

function renderConfirm() {
    const choiceRoomButtons = document.querySelectorAll(".booking__info-room-body .room-choice__button");
    choiceRoomButtons.forEach((choice) => {
        choice.addEventListener("click",() => {
            const roomInfo = choice.closest("tr");
            const roomId = Number(roomInfo.dataset.roomId);
            const typeCode = roomInfo.dataset.typeCode;
            const roomPrice = Number(roomInfo.dataset.roomPrice);

            if(!choice.classList.contains("active")) {     
                updateConfirmDetail(roomId, typeCode, roomPrice, true);
                syncChoiceButton(roomId, true);
            }
            else {
                updateConfirmDetail(roomId, typeCode, roomPrice, false);
                syncChoiceButton(roomId, false);
            }

            updateConfirmTable();

        });
    })
}

function showRoomDetail() {
    const modal = document.querySelector(".modal");
    const showRoomModal = modal.querySelector(".show-room");
    const detailButtons = document.querySelectorAll(".room-detail__button");
    

    if(!isShowRoomDetailInit) {
        const showRoomChoiceButton = showRoomModal.querySelector(".choice-room__button");
        if(showRoomChoiceButton) {
            showRoomChoiceButton.addEventListener("click", () => {
    
                if(!showRoomChoiceButton.classList.contains("active")) {
                    updateConfirmDetail(Number(showRoomModal.dataset.roomId), showRoomModal.dataset.typeCode, Number(showRoomModal.dataset.roomPrice), true);
                    syncChoiceButton(Number(showRoomModal.dataset.roomId), true);
                }
                else {
                    updateConfirmDetail(Number(showRoomModal.dataset.roomId), showRoomModal.dataset.typeCode, Number(showRoomModal.dataset.roomPrice), false);
                    syncChoiceButton(Number(showRoomModal.dataset.roomId), false);
                }
    
                updateConfirmTable();
    
            });
        }
        const showRoomExit = showRoomModal.querySelector(".show-room__exit");
        if(showRoomExit) {
            showRoomExit.addEventListener("click", () => {
                showRoomModal.classList.remove("show");
                modal.classList.remove("active");
            })
        }

        isShowRoomDetailInit = true;
    }



    detailButtons.forEach(detail => {
        detail.addEventListener("click", () => {
            const roomInfo = detail.closest("tr");
            const roomId = Number(roomInfo.dataset.roomId);
            const typeCode = roomInfo.dataset.typeCode;
            const rooms = HotelService.getRooms(Number(localStorage.getItem("choicedHotelId")),typeCode);
            
            const roomDetail = rooms.find(room => room.id === roomId);
            
            if(modal && showRoomModal) {
                modal.classList.add("active");
                showRoomModal.classList.add("show");
                showRoomModal.dataset.roomId = roomId;
                showRoomModal.dataset.typeCode = typeCode;
                showRoomModal.dataset.roomPrice = roomDetail.price; 
            }

            const showRoomId = showRoomModal.querySelector(".show-room__id");
            if(showRoomId) {
                showRoomId.innerText = "Phòng " + roomDetail.roomNumber;
            }

            const showRoomGenaral = showRoomModal.querySelector(".show-room__detail-genaral-body");
            if(showRoomGenaral) {
                showRoomGenaral.innerHTML = `
                    <ul>
                        <li>Diện tích: ${roomDetail.area}</li>
                        <li>Khách: ${roomDetail.numberOfBed}</li>
                        <li>Tầng: ${roomDetail.floor}</li>
                    </ul>
                `
            }

            const showRoomServices = showRoomModal.querySelector(".show-room__detail-services-body");
            if(showRoomServices) {
                let html = "";
                roomDetail.services.forEach(service => {
                    html += `<li>${service}</li>`
                })
                showRoomServices.innerHTML = `
                    <ul>
                        ${html}
                    </ul>
                `;
            }

            const showRoomDescription = showRoomModal.querySelector(".show-room__detail-description-body");
            if(showRoomDescription) {
                showRoomDescription.innerHTML = `
                <ul>
                    <li>${roomDetail.description}</li>
                </ul>
                `
            }

            const showRoomPrice = showRoomModal.querySelector(".choice-room__price div:first-child");
            if(showRoomPrice) {
                showRoomPrice.innerText = roomDetail.price.toLocaleString("vi-VN") + "VNĐ";
            }

            const isActive = confirmDetail.singleRoomsId.includes(roomId) ||
                             confirmDetail.doubleRoomsId.includes(roomId);
            const btn = showRoomModal.querySelector(".choice-room__button");
            if (isActive) {
                btn.classList.add("active");
                btn.querySelector("div").innerText = "Hủy lựa chọn phòng";
            } else {
                btn.classList.remove("active");
                btn.querySelector("div").innerText = "Thêm lựa chọn phòng";
            }
                
        }); 
    })
}

function syncChoiceButton(roomId, isActive) {
    const rowButton = document.querySelector(`tr[data-room-id="${roomId}"] .room-choice__button`);
    if(rowButton) {
        if(isActive) {
            rowButton.classList.add("active");
            rowButton.innerHTML = "Hủy";
        }
        else {
            rowButton.classList.remove("active");
            rowButton.innerHTML = "Chọn";

        }
    }

    const showRoomModal = document.querySelector(".show-room");
    const modalButton = showRoomModal.querySelector(".choice-room__button");
    if(showRoomModal && Number(showRoomModal.dataset.roomId) === roomId) {
        if(isActive) {
            modalButton.classList.add("active");
            modalButton.querySelector("div").innerText = "Hủy lựa chọn phòng";
            
        }
        else {
            modalButton.classList.remove("active");
            modalButton.querySelector("div").innerText = "Thêm lựa chọn phòng";
            
        }
    }
}

function renderReviews() {
    const hotelId = Number(localStorage.getItem("choicedHotelId"));
    const rateAvg = document.querySelector(".rate-avg__box span");
    const rateAvgText = document.querySelector(".rate-avg__text span");
    const convervationBox = document.querySelector(".booking__info-rate-covervation-wrap");
    
    const oneStar = document.querySelector(".rate__row-fill-one-star");
    const twoStar = document.querySelector(".rate__row-fill-two-star");
    const threeStar = document.querySelector(".rate__row-fill-three-star");
    const fourStar = document.querySelector(".rate__row-fill-four-star");
    const fiveStar = document.querySelector(".rate__row-fill-five-star");

    getReviewsHotel(hotelId)
        .then(reviewData => {

            let html = "";

            rateAvg.innerText = reviewData.averageStar;
            rateAvgText.innerText = reviewData.reviews.length;

            oneStar.style.transform = `scaleX(${reviewData.oneStarPercent/100})`;
            twoStar.style.transform = `scaleX(${reviewData.twoStarPercent/100})`;
            threeStar.style.transform = `scaleX(${reviewData.threeStarPercent/100})`;
            fourStar.style.transform =  `scaleX(${reviewData.fourStarPercent/100})`;
            fiveStar.style.transform =  `scaleX(${reviewData.fiveStarPercent/100})`;

            reviewData.reviews.forEach(review => {
                html += `
                    <div class="convervation__box">
                        <div class="convervation__user">
                            <div class="convervation__user-avatar">
                                <img src="assets/images/default-avt.png" alt="">
                            </div>
                            <div class="convervation__user-name">
                                <span>${review.userName}</span>
                            </div>
                        </div>
                        <div class="convervation__chat">
                            <div class="convervation__chat-info">
                                <div class="convervation__chat-rate">
                                    <span>${review.rating}</span> <i class="fa-solid fa-star star"></i>
                                </div>
                                <div class="convervation__chat-time">
                                    ${review.createdAt}
                                </div>
                            </div>
                            <div class="convervation__chat-content">
                                <span>${review.comment}</span>
                            </div>
                        </div>
                    </div>
                `
            })

            convervationBox.innerHTML = html;

        })
}


function renderBooking() {
    const hotelId = Number(localStorage.getItem("choicedHotelId"));
    const hotel = HotelService.getHotel(hotelId);

    const singleRooms = HotelService.getRooms(hotelId, "SINGLE");
    const doubleRooms = HotelService.getRooms(hotelId, "DOUBLE");

    renderHotelGenaral(hotel.id, hotel.cheapestRoom.price, hotel.address, hotel.phoneNumber);
    document.querySelector(".booking__info-room-body").innerHTML = renderRoomType(singleRooms, "SINGLE")+ renderRoomType(doubleRooms, "DOUBLE");
    document.querySelector(".booking__info-service-body").innerHTML = renderService(hotel.services);
    renderConfirm();
    showRoomDetail();
    renderReviews();

}




export function initBooking() {

    confirmDetail.singleRoomsId = [];
    confirmDetail.doubleRoomsId = [];
    confirmDetail.totalPrice = 0;

    const modalBtn = document.querySelector(".show-room .choice-room__button");
    if (modalBtn) {
        modalBtn.classList.remove("active");
        modalBtn.querySelector("div").innerText = "Thêm lựa chọn phòng";
    }   

    const main = document.querySelector(".main");
    document.querySelector(".booking__info-genaral-button").addEventListener("click", () => {
        main.querySelector(".booking__info-room").scrollIntoView({behavior: "smooth", block: "center"});
    });


    renderBooking();
} 