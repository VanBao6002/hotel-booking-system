export function getUserInfo() {
    const data = localStorage.getItem("userData");

    if(data) {
        const userData = JSON.parse(data);
        if(userData && userData.fullName) {
            return {
                signIn: "logged-in",
                fullName: userData.fullName
            }
        }
    };
    return { signIn: "", fullName: ""};
}


// export const UserService = {

// }

export const HotelService = {
    getBranches(filterFn,sortFn) {
        const data = localStorage.getItem("hotelData");
        if(!data) return [];
        const parse = JSON.parse(data);
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
                typeCode: room.typeCode,
                roomStatus: room.roomStatus,
                services: room.services
            };
        });
        return rooms;
    }
}
