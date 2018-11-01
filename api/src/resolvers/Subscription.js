const newLink = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.link(
      // https://github.com/graphcool/prisma/issues/1734
      // { where: { mutation_in: ['CREATED'] } },
      { },
      info,
    )
  },
}

const newVote = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.vote(
      // https://github.com/graphcool/prisma/issues/1734
      // { where: { mutation_in: ['CREATED'] } },
      { },
      info,
    )
  },
}


function newMessageSubscribe (parent, args, context, info) {
  return context.db.subscription.message(
    { where: { mutation_in: ['CREATED'] } },
    info,
  )
}

const newMessage = {
  subscribe: newMessageSubscribe
}

function newRequestSubscribe(parent, args, contexdt, info) {
    return context.db.subscription.request(
        { where: { mutation_in: ['CREATED'] } },
        info,
    )
}

const newRequest = {
    subscribe: newMessageSubscribe
}

module.exports = {
  newLink,
  newVote,
  newMessage,
  newRequest
}
