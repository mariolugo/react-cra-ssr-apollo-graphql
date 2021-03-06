const geolib = require("geolib");
const { APP_SECRET, getUserId } = require('../utils')

async function feed(parent, args, ctx, info) {
  const {
    filter,
    first,
    skip,
    latLng,
    radius,
    orderBy,
    maxPrice,
    amenities,
    bed
  } = args; // destructure input arguments
  const where = filter;

  if (orderBy === "") {
    orderBy = "createdAt_DESC";
  }

  const queriedLinkes = await ctx.db.query.rooms({
    where,
    orderBy: orderBy
  });

  let rooms = [];

  if (typeof latLng !== "undefined") {
    queriedLinkes.map(room => {
      if (geolib.isPointInCircle(room.latLng, JSON.parse(latLng), radius)) {
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

async function getUserRooms(parent, args, ctx, info) {
  const userId = getUserId(ctx);
  const rooms = await ctx.db.query.rooms({
    where: {
      postedBy: {
        id: userId
      }
    }
  });
  console.log(rooms);
  return {
    rooms
  }
}

async function getRoomRequest(parent, args, ctx, info) {
  const { createdBy, roomId } = args;

  const request = await ctx.db.query.requests(
    {
      where: {
        createdBy: {
            id: createdBy
        },
        roomId: {
            id: roomId
        }
      }
    },
    info
  );

  return request[0];
}

async function getUserRequests(parent, args, ctx, info) {
    const { requestUser, status } = args;

    const requests = await ctx.db.query.requests({
        where: {
            requestUser: requestUser,
            status: status
        }
    }, info);


    return requests;
};

async function getUserSentRequests(parent, args, ctx, info) {
  const { createdBy, status } = args;

  const requests = await ctx.db.query.requests({
      where: {
          createdBy: {
            id: createdBy
          },
          status: status
      }
  }, info);


  return requests;
}

async function getMessages(parent, args, ctx, info) {
  const { chat } = args;

  const messages = await ctx.db.query.messages({
      where: {
          chat: {
            id: chat
          }
      }
  }, info);


  return messages;
}


module.exports = {
  feed,
  getRoom,
  getRoomRequest,
  getUserRooms,
  getUserRequests,
  getUserSentRequests,
  getMessages
};
