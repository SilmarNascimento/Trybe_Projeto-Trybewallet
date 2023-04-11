import { SAVE_EMAIL } from '../actions';

const INITIAL_STATE = {
  userName: '',
  email: '',
};

const userReducer = (state = INITIAL_STATE, action) => {
  console.log(state);
  console.log(action);
  switch (action.type) {
  case SAVE_EMAIL:
    return ({
      ...state,
      email: action.payload,
    });
  default:
    return state;
  }
};

export default userReducer;
