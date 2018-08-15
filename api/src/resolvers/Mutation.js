const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')
const {
  AuthenticationError,
} = require('apollo-server');
const {FB, FacebookApiException} = require('fb');

function post(parent, { url, description }, ctx, info) {
  const userId = getUserId(ctx);
  return ctx.db.mutation.createLink({
    data: {
      url,
      description,
      postedBy: {
        connect: {
          id: userId
        }
      }
    }
  }, info);
}

async function signup(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password },
  })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, ctx, info) {
  const user = await ctx.db.query.user({ where: { email: args.email } })
  if (!user) {
    throw new AuthenticationError('must authenticate')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

async function facebookSignIn(parent, args, ctx, info) {

  const user = await FB.api('oauth/access_token', {
    client_id: '1748924262089537',
    client_secret: '1be7e92c0c8b236665415c1671e528ce',
    code: args.code,
    redirect_uri: 'http://localhost:3000/login/facebook-callback',
  })
  .then(res => {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }
    const { access_token } = res;

    return FB.api('me', {
      fields: 'id,name,email',
      access_token: access_token
    })
  })
  .then(res => {
    return ctx.db.query.user({ where: { email: res.email } });
  })
  .then(res => {
    return res;
  });

  console.log('user2',user);
  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user: user
  };
}

async function vote(parent, args, ctx, info) {
  const { linkId } = args
  const userId = getUserId(ctx)
  const linkExists = await ctx.db.exists.Vote({
    user: { id: userId },
    link: { id: linkId },
  })
  if (linkExists) {
    throw new Error(`Already voted for link: ${linkId}`)
  }

  return ctx.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: linkId } },
      },
    },
    info,
  )
}

module.exports = {
  post,
  signup,
  login,
  vote,
  facebookSignIn
}
