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

export function getHotelBranches() {
    const data = localStorage.getItem("hotelData");
    if(!data) return [];

    const parse = JSON.parse(data);
    if( !parse || !parse.branches || parse.branches.length === 0) return [];

    return parse.branches.map(branch => {

        const cheapestRoom = branch.rooms.reduce((minRoom, currentRoom) => {
            return currentRoom.price < minRoom.price ? currentRoom : minRoom; 
        });

        return {
            id: branch.id,
            address: branch.address,
            phoneNumber: branch.phoneNumber,
            locationName: branch.locationName,
            averageStar: branch.averageStar,
            services: branch.services,
            cheapestRoom: {
                price: cheapestRoom.price
            }
        }
    });
    
}