function rooms(parent, args, context, info) {
  const { roomsIds } = parent
  return context.db.query.rooms({ where: { id_in: roomsIds } }, info)
}

module.exports = {
  rooms,
}
