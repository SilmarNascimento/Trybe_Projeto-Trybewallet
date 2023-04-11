import { SAVE_EMAIL } from '../actions';

const INITIAL_STATE = {
  userName: '',
  email: '',
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SAVE_EMAIL:
    return({
      ...state,
      
    });
  default:
    return state;
  }
};

export default userReducer;
