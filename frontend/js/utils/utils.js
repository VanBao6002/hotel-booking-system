export function getUserInfo() {
    const data = localStorage.getItem("userData");
    const userData = safeJsonParse(data, null);
    if(userData && userData.fullName) {
        return {
            signIn: "logged-in",
            fullName: userData.fullName
        }
    }
    
    return { signIn: "", fullName: ""};
}


// export const UserService = {

// }

export const HotelService = {
    getBranches(filterFn,sortFn) {
        const data = localStorage.getItem("hotelData");
        if(!data) return [];
        const parse = safeJsonParse(data, null);
        if( !parse || !parse.branches || parse.branches.length === 0) return [];

        let branches = parse.branches.map(branch => {

            const cheapestRoom = branch.rooms.reduce((minRoom, currentRoom) => {
                return currentRoom.price < minRoom.price ? currentRoom : minRoom; 
            },branch.rooms[0]);

            return {
                id: branch.id,
                address: branch.address,
                phoneNumber: branch.phoneNumber,
                locationName: branch.locationName,
                averageStar: branch.averageStar,
                services: branch.services,
                imageUrl: branch.imageUrl || "",
                cheapestRoom: {
                    price: cheapestRoom.price
                },
                rooms: branch.rooms.map(room => {
                    return {
                        id: room.id,
                        roomNumber: room.roomNumber,
                        floor: room.floor,
                        area: room.area,
                        numberOfBed: room.numberOfBed,
                        price: room.price,
                        description: room.description,
                        roomIMG: room.roomIMG || room.roomImg || "assets/images/example-room.jpg",
                        typeCode: room.typeCode,
                        roomStatus: room.roomStatus,
                        services: room.services
                    };
                })
            };
        });

        if(typeof filterFn === "function") {
            branches = branches.filter(filterFn);
        }

        if(typeof sortFn === "function") {
            branches = branches.sort(sortFn);
        }
        return branches;
    },

    getHotel(hotelId) {
        const hotels = this.getBranches();

        const hotel = hotels.find(h => {
            return h.id === hotelId;
        });

        if(!hotel) return null;

        return hotel;
    },

    getRooms(hotelId, typeCode) {
        const hotels = this.getBranches();

        const hotel = hotels.find(h => {
            return h.id === hotelId;
        });

        if(!hotel) return [];

        let rooms = hotel.rooms.filter(room => {
            return room.typeCode === typeCode;
        });

        rooms = rooms.sort((a, b) => {
            return a.roomNumber - b.roomNumber;
        })

        rooms = rooms.map(room => {
            return {
                id: room.id,
                roomNumber: room.roomNumber,
                floor: room.floor,
                area: room.area,
                numberOfBed: room.numberOfBed,
                price: room.price,
                description: room.description,
                roomIMG: room.roomIMG || room.roomImg || "assets/images/example-room.jpg",
                typeCode: room.typeCode,
                roomStatus: room.roomStatus,
                services: room.services
            };
        });
        return rooms;
    }
}

export function resolveMediaUrl(url) {
    if (!url) return url;
    const trimmed = String(url).trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("/media/")) {
        return `http://localhost:8080${trimmed}`;
    }
    // If value looks like a simple filename (e.g. room1.jpg from seed data),
    // map it to the rooms public path. Try to infer hotel vs room by prefix.
    if (/^[\w\-]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed)) {
        if (/^room/i.test(trimmed)) return `http://localhost:8080/media/rooms/${trimmed}`;
        if (/^hotel/i.test(trimmed) || /^branch/i.test(trimmed)) return `http://localhost:8080/media/hotels/${trimmed}`;
        // fallback to rooms
        return `http://localhost:8080/media/rooms/${trimmed}`;
    }
    return trimmed;
}

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// export function validatePassword(password, confirmPassword) {
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     const isStrong = regex.test(password);
//     const isMatch = password === confirmPassword;
//     return isStrong && isMatch;
// }
export function isValidPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

export function isValidUsername(username) {
    const regex = /^(?![_0-9])[a-zA-Z0-9_]{3,16}$/;
    const forbidden = ["admin", "root", "system"];
    return regex.test(username) && !forbidden.includes(username.toLowerCase());
}

export function isValidPhoneNumber(phone) {
    const regex = /^(0[3|5|7|8|9][0-9]{8}|(\+84)[3|5|7|8|9][0-9]{8})$/;
    return regex.test(phone);
}

export function safeJsonParse(str, fallback = null) {
    if (!str) return fallback;
    try {
        return JSON.parse(str);
    } catch (e) {
        return fallback;
    }
}

export function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}
export function formatDateToDisplay(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}