import { ADD_EXPENSE_VALUE, SAVE_CURRENCIES, SAVE_EXPENSES } from '../actions';

const INITIAL_STATE = {
  sumExpense: '0',
  currency: 'BRL',
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
};

const walletReducer = (state = INITIAL_STATE, action) => {
  console.log(action);
  console.log(state);
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
  default:
    return state;
  }
};

export default walletReducer;
