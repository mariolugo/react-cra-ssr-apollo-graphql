const geolib = require("geolib");

async function feed(parent, args, ctx, info) {
  const { filter, first, skip, latLng, radius, orderBy, maxPrice, amenities, bed } = args; // destructure input arguments
  const where = filter;


  if(orderBy === ''){
    orderBy = 'createdAt_DESC';
  }

  const queriedLinkes = await ctx.db.query.rooms({
    where,
    orderBy: orderBy
  });

  let rooms = [];

  if (typeof latLng !== 'undefined'){
    queriedLinkes.map(room => {
      if (geolib.isPointInCircle(
          room.latLng,
          JSON.parse(latLng),
          radius
      )) {
        rooms.push(room);
      }
    });
  } else {
    rooms = queriedLinkes;
  }

  return {
    count: rooms.length,
    amenities: amenities,
    orderBy: orderBy,
    maxPrice: maxPrice,
    bed: bed,
    roomsIds: rooms.map(room => room.id)
  };
}

async function getRoom(parent, args, ctx, info) {
  const { id } = args;

  if (typeof id === "undefined") {
    throw new Error("Invalid params error");
  }
  const room = await ctx.db.query.room(
    {
      where: {
        id: id
      }
    },
    info
  );

  if (!room) {
    throw new Error("No room found");
  }

  return room;
}

module.exports = {
  feed,
  getRoom
};
