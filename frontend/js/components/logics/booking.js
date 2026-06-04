import { navigation } from "../../router/router.js";
import { bookingRoom, getReviewsHotel } from "../../services/hotel.js";
import { formatDateToDisplay, HotelService, safeJsonParse, resolveMediaUrl } from "../../utils/utils.js";

let isShowRoomDetailInit = false;


function renderHotelGenaral(hotelName, price, address, phoneNumber){
    document.querySelector(".booking__info-genaral-name span").innerText = hotelName;
    document.querySelector(".booking__info-genaral-price-current").innerText= price.toLocaleString("vi-VN") + " VNĐ";
    document.querySelector(".booking__info-genaral-contact-body span:nth-child(1)").innerText = "Địa chỉ: " + address;
    document.querySelector(".booking__info-genaral-contact-body span:nth-child(2)").innerText = "Số điện thoại: " + phoneNumber;
}

function renderBookingGallery(hotel, rooms) {
    const mainImg = document.querySelector(".booking__picture-main-img img");
    const thumbs = document.querySelectorAll(".booking__picture-add-img img");
    if (!mainImg || thumbs.length === 0) return;

    const mainSrc = resolveMediaUrl(hotel.imageUrl) || "assets/images/example-room.jpg";
    mainImg.src = mainSrc;
    mainImg.alt = hotel.locationName || hotel.address || "Hình phòng";

    const roomImages = rooms
        .map(room => resolveMediaUrl(room.roomIMG))
        .filter(src => src)
        .slice(0, thumbs.length);

    thumbs.forEach((thumb, index) => {
        thumb.src = roomImages[index] || mainSrc;
        thumb.alt = `Hình phòng ${index + 1}`;
    });
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



function calculateDuring() {
    const searchInfoData = safeJsonParse(localStorage.getItem("searchInfoData"), {});

    const checkIn = new Date(searchInfoData.checkInDate);
    const checkOut = new Date(searchInfoData.checkOutDate);

    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return dayDiff;
}

let confirmDetail = {
    singleRoomsId: [],
    doubleRoomsId: [],
    totalPrice: 0,
}


function updateConfirmTable() {

    const confirmTable = document.querySelector(".booking__info-confirm .booking__info-room-table");
    const cells = confirmTable.querySelectorAll("td");
    
    cells[0].innerText = confirmDetail.singleRoomsId.length;
    cells[1].innerText = confirmDetail.doubleRoomsId.length;
    cells[2].querySelector(".room-total-price").innerText = confirmDetail.totalPrice.toLocaleString("vi-VN") + " VNĐ";
}

function updateConfirmDetail(roomId, typeCode, roomPrice , choice = true){
    if(choice) {
        if(typeCode === "SINGLE") confirmDetail.singleRoomsId.push(roomId);
        else confirmDetail.doubleRoomsId.push(roomId);
        confirmDetail.totalPrice += roomPrice*calculateDuring();
    }
    else {
        if(typeCode === "SINGLE") {
            confirmDetail.singleRoomsId = confirmDetail.singleRoomsId.filter(id => id !== roomId);
        } 
        else {
            confirmDetail.doubleRoomsId = confirmDetail.doubleRoomsId.filter(id => id !== roomId);
        }
        confirmDetail.totalPrice -= roomPrice*calculateDuring();
    }
    console.log(confirmDetail);
}

function renderConfirm() {
    const choiceRoomButtons = document.querySelectorAll(".booking__info-room-body .room-choice__button");
    choiceRoomButtons.forEach((choice) => {
        choice.onclick = () => {
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

        };
    })
}

function showRoomDetail() {
    const modal = document.querySelector(".modal");
    const showRoomModal = modal.querySelector(".show-room");
    const detailButtons = document.querySelectorAll(".room-detail__button");
    

    if(!isShowRoomDetailInit) {
        const showRoomChoiceButton = showRoomModal.querySelector(".choice-room__button");
        if(showRoomChoiceButton) {
            showRoomChoiceButton.onclick = () => {
    
                if(!showRoomChoiceButton.classList.contains("active")) {
                    updateConfirmDetail(Number(showRoomModal.dataset.roomId), showRoomModal.dataset.typeCode, Number(showRoomModal.dataset.roomPrice), true);
                    syncChoiceButton(Number(showRoomModal.dataset.roomId), true);
                }
                else {
                    updateConfirmDetail(Number(showRoomModal.dataset.roomId), showRoomModal.dataset.typeCode, Number(showRoomModal.dataset.roomPrice), false);
                    syncChoiceButton(Number(showRoomModal.dataset.roomId), false);
                }
    
                updateConfirmTable();
    
            };
        }
        const showRoomExit = showRoomModal.querySelector(".show-room__exit");
        if(showRoomExit) {
            showRoomExit.onclick = () => {
                showRoomModal.classList.remove("show");
                modal.classList.remove("active");
            };
        }

        isShowRoomDetailInit = true;
    }



    detailButtons.forEach(detail => {
        detail.onclick = () => {
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

            const showRoomImg = showRoomModal.querySelector(".show-room__detail-img");
            if (showRoomImg) {
                const imageSrc = resolveMediaUrl(roomDetail.roomIMG) || "assets/images/example-room.jpg";
                showRoomImg.innerHTML = `
                    <img src="${imageSrc}" alt="Phòng ${roomDetail.roomNumber}">
                `;
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
                
        }; 
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
                                    <span>${review.rating}</span><i class="fa-solid fa-star star"></i>
                                </div>
                                <div class="convervation__chat-time">
                                    ${formatDateToDisplay(review.createdAt)}
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
    const allRooms = [...singleRooms, ...doubleRooms];

    renderHotelGenaral(hotel.id, hotel.cheapestRoom.price, hotel.address, hotel.phoneNumber);
    renderBookingGallery(hotel, allRooms);
    document.querySelector(".booking__info-room-body").innerHTML = renderRoomType(singleRooms, "SINGLE")+ renderRoomType(doubleRooms, "DOUBLE");
    document.querySelector(".booking__info-service-body").innerHTML = renderService(hotel.services);
    renderConfirm();
    showRoomDetail();
    renderReviews();

}

function handleBooking() {

    const confirmButton = document.querySelector(".room-confirm__button");
    const modal = document.querySelector(".modal");
    const showNotification = modal.querySelector(".show__notification");
    const notificationTitle = showNotification.querySelector(".show__notification-title span");
    const notificationText = showNotification.querySelector(".show__notification-text");
    const backButton = showNotification.querySelector(".show__notification-previous-button");
    const nextButton = showNotification.querySelector(".show__notification-next-button");

    confirmButton.onclick = () => {
        if(confirmDetail.singleRoomsId.length === 0 && confirmDetail.doubleRoomsId.length === 0) {
            modal.classList.add("active");
            nextButton.innerText = "";
            nextButton.style.display = "none";
            backButton.style.display = "block"
            showNotification.classList.remove("error", "warning", "success", "qrcode");
            showNotification.classList.add("show", "error");  
            notificationTitle.innerText = "Xác nhận đặt phòng";
            notificationText.innerText = "Bạn chưa chọn phòng nào";
        }
        else {
            modal.classList.add("active");
            showNotification.classList.remove("error", "warning", "success", "qrcode");
            showNotification.classList.add("show", "warning");  
            notificationTitle.innerText = "Xác nhận đặt phòng";
            notificationText.innerHTML = `
                Bạn đã đặt <strong>${confirmDetail.singleRoomsId.length} phòng đơn</strong> và <strong>${confirmDetail.doubleRoomsId.length} phòng đôi</strong> 
                với tổng số tiền cần thanh toán là <strong>${confirmDetail.totalPrice.toLocaleString("vi-VN")} VND</strong>. Thời gian check in: <strong>${formatDateToDisplay(JSON.parse(localStorage.getItem("searchInfoData")).checkInDate)}</strong>, check out: <strong>${formatDateToDisplay(JSON.parse(localStorage.getItem("searchInfoData")).checkOutDate)}</strong>. <br> 
                Vui lòng xác nhận nếu thông tin trên là chính xác.
            `;
            nextButton.innerText = "Thanh toán";
            nextButton.style.display = "block";
            backButton.style.display = "block"
            nextButton.onclick = () => {
                showNotification.classList.remove("error", "warning", "success", "qrcode");
                showNotification.classList.add("qrcode");
                notificationTitle.innerText = "QR Code";
                notificationText.innerHTML = `
                    <img style="width: 100%;" src="./assets/images/qrcode.png" atl="QR pyament">
                `
                backButton.style.display = "none"
                nextButton.style.display = "none"
                
                if(showNotification.classList.contains("qrcode")) {
                    setTimeout(() => {
                        if(modal.classList.contains("active")) {
                            navigation("home");
                            showNotification.classList.remove("error", "warning", "success", "qrcode");
                            showNotification.classList.add("success");
                            notificationTitle.innerText = "Đăt phòng thành công";
                            notificationText.innerText = "Cảm ơn bạn đã đặt phòng của chúng tôi";


                            const searchInfoData = safeJsonParse(localStorage.getItem("searchInfoData"), {});
                            const currentUser = safeJsonParse(localStorage.getItem("userData"), {});
                            const bookingData  = {
                                checkInDate: searchInfoData.checkInDate,
                                checkOutDate: searchInfoData.checkOutDate,
                                bookingPrice: confirmDetail.totalPrice,
                                userId: currentUser.id,
                                hotelBranchId : Number(localStorage.getItem("choicedHotelId")),
                                roomIds: [...confirmDetail.singleRoomsId, ...confirmDetail.doubleRoomsId]
                            }

                            bookingRoom(bookingData);
                        }
                    },3000);
                }
            };

        }

        backButton.onclick = () => {
            showNotification.classList.remove("show", "error", "warning", "success", "qrcode");
            notificationText.innerText = "";
            notificationTitle.innerText = "";
            modal.classList.remove("active");
        };
    };

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
    document.querySelector(".booking__info-genaral-button").onclick = () => {
        main.querySelector(".booking__info-room").scrollIntoView({behavior: "smooth", block: "center"});
    };


    renderBooking();
    handleBooking();
} 