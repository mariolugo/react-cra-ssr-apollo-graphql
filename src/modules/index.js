import { combineReducers } from 'redux';

import auth from './auth';
import profile from './profile';
import room from './room';

export default combineReducers({
  auth,
  profile,
  room
});
