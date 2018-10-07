const geolib = require("geolib");

async function rooms(parent, args, context, info) {
  const { roomsIds, amenities, orderBy, maxPrice, bed } = parent;
  const { latLng } = args;

  const rooms = await context.db.query.rooms(
    {
      where: { id_in: roomsIds },
      orderBy: orderBy
    },
    info
  );

  console.log("amenities", amenities);

  let roomsToSend = [];

  if (rooms && rooms.length > 0) {
    if (typeof maxPrice !== "undefined") {
      rooms.map(room => {
        if (room.price <= maxPrice) {
          roomsToSend.push(room);
        }
      });
    } else {
      roomsToSend = rooms;
    }

    if (typeof bed !== "undefined" && bed.length > 0) {
      let roomsWithBed = [];

      roomsToSend.map(room => {
        if (room.bed === bed) {
          roomsWithBed.push(room);
        }
      });

      roomsToSend = roomsWithBed;
    }

    if (typeof amenities !== 'undefined' && amenities.length > 0) {
      const anyMatchInArray = (array, ams) => {
        "use strict";

        let targetArray, func;

        targetArray = array;
        console.log('targetArray',targetArray, ams);
        func = () => {
          let found = false;
          for (let i = 0, j = ams.length; !found && i < j; i++) {
            if (targetArray.indexOf(ams[i]) > -1) {
              found = true;
            }
          }
          return found;
        };

        return func();
      };
      let roomsWithAmenities = [];

      roomsToSend.map(room => {
        console.log(room);
        if (anyMatchInArray(room.amenities, amenities)) {
          roomsWithAmenities.push(room);
        }
      });

      roomsToSend = roomsWithAmenities;
    }
  }

  return roomsToSend;
}

module.exports = {
  rooms
};
