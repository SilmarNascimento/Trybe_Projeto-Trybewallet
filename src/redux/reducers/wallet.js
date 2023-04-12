import {
  ADD_EXPENSE_VALUE,
  DELETE_EXPENSES,
  SAVE_CURRENCIES,
  SAVE_EXPENSES,
  TOGGLE_EDIT,
} from '../actions';

const INITIAL_STATE = {
  sumExpense: '0',
  currency: 'BRL',
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
};

const walletReducer = (state = INITIAL_STATE, action) => {
  const prevSum = state.sumExpense === '' ? 0 : parseFloat(state.sumExpense);
  switch (action.type) {
  case ADD_EXPENSE_VALUE:
    return ({
      ...state,
      sumExpense: (prevSum + parseFloat(action.payload)).toFixed(2),
    });
  case SAVE_CURRENCIES:
    return ({
      ...state,
      currencies: action.payload,
    });
  case SAVE_EXPENSES:
    return ({
      ...state,
      expenses: [...state.expenses, action.payload],
    });
  case DELETE_EXPENSES:
    return ({
      ...state,
      expenses: action.payload,
    });
  case TOGGLE_EDIT:
    return ({
      ...state,
      editor: state.editor === false,
    });
  default:
    return state;
  }
};

export default walletReducer;
