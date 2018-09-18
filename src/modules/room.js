export const UPDATE_ROOM = 'UPDATE_ROOM';

const initialState = {
  room: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ROOM:
      console.log({
        ...action.room
      })
      return {
        ...state,
        room: action.room
      };
    default:
      return state;
  }
};

export const setCurrentRoom = room => dispatch =>
  new Promise(resolve => {
    dispatch({
      type: UPDATE_ROOM,
      room
    });
    resolve(room);
  });
