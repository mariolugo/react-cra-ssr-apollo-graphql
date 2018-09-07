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
  const password = await bcrypt.hash(args.password, 10);
  args.isVerified = false;
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
    throw new Error('User not found')
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

const makeId = () => {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

async function facebookSignIn(parent, args, ctx, info) {

    let facebookRes;

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
      facebookRes = res;
    return {
      facebookId: res.id,
      email: res.email,
      name: res.name
    };
  });

  const userFound = await ctx.db.query.user({
    where: {
      email: user.email
    }
  });

  if (userFound === null){
    user.facebookId = facebookRes.id;
    const password = await bcrypt.hash(makeId(), 10);
    user.isVerified = false;
    const createdUser = await ctx.db.mutation.createUser({
      data: { ...user, password },
    });

    const token = jwt.sign({ userId: createdUser.id }, APP_SECRET);

    console.log({
      token,
      createdUser,
    });

    return {
      token,
      createdUser,
    }
  }

  if (userFound.facebookId === null){
      const editedUser = await ctx.db.mutation.updateUser({
        data: {
            facebookId: facebookRes.id
        },
        where: { id: userFound.id }
      });

      if (editedUser){
          userFound.facebookId = editedUser.facebookId
      }


  }

  return {
    token: jwt.sign({ userId: userFound.id }, APP_SECRET),
    user: userFound
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

async function editUser(parent, args, ctx, info) {
  const userId = getUserId(ctx);

  const editedUser = await ctx.db.mutation.updateUser({
    data: { ...args },
    where: { id: userId }
  });

  return editedUser;
}

async function facebookConnect(parent, args, ctx, info) {

  let facebookRes;

  const user = await FB.api('oauth/access_token', {
    client_id: '1748924262089537',
    client_secret: '1be7e92c0c8b236665415c1671e528ce',
    code: args.code,
    redirect_uri: 'http://localhost:3000/dashboard/facebook-callback',
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
      facebookRes = res;
    return {
      facebookId: res.id,
      email: res.email,
      name: res.name
    };
  });

  const userFound = await ctx.db.query.user({
    where: {
      email: user.email
    }
  });

  if (userFound.facebookId === null){
      const editedUser = await ctx.db.mutation.updateUser({
        data: {
            facebookId: facebookRes.id
        },
        where: { id: userFound.id }
      });

      if (editedUser){
          userFound.facebookId = editedUser.facebookId
      }
  }

  console.log({userFound})

  return userFound;
}


module.exports = {
  post,
  signup,
  login,
  vote,
  facebookSignIn,
  editUser,
  facebookConnect
}
