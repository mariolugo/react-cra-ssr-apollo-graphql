async function feed(parent, args, ctx, info) {
  const { filter, first, skip } = args // destructure input arguments
  const where = filter
    ? { OR: [{ title_contains: filter }, { description_contains: filter }] }
    : {}

  const allRooms = await ctx.db.query.rooms({})
  const count = allRooms.length

  const queriedLinkes = await ctx.db.query.rooms({ first, skip, where })

  return {
    roomsIds: queriedLinkes.map(link => link.id),
    count
  }
}

async function getRoom(parent, args, ctx, info){
    const { id } = args;

    if (typeof id === 'undefined'){
        throw new Error('Invalid params error');
    }
    const room = await ctx.db.query.room({
        where: {
            id: id
        }
    }, info);

    if(!room) {
        throw new Error('No room found');
    }

    return room;
}



module.exports = {
  feed,
  getRoom
}
