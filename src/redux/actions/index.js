// Coloque aqui suas actions
export const URL_CURRENCIES = 'https://economia.awesomeapi.com.br/json/all';
export const SAVE_EMAIL = 'SAVE_EMAIL';
export const SAVE_CURRENCIES = 'SAVE_CURRENCIES';
export const SAVE_EXPENSES = 'SAVE_EXPENSES';
export const ADD_EXPENSE_VALUE = 'ADD_EXPENSE_VALUE';

export const saveEmail = (email) => ({
  type: SAVE_EMAIL,
  payload: email,
});

export const saveCurrencies = (data) => ({
  type: SAVE_CURRENCIES,
  payload: data,
});

export const saveExpenses = (data) => ({
  type: SAVE_EXPENSES,
  payload: data,
});

export const addExpenseValue = (expense) => ({
  type: ADD_EXPENSE_VALUE,
  payload: expense,
});

const fetchAPI = async (URL) => {
  const response = await fetch(URL);
  const data = await response.json();
  return data;
};

export const fetchCurrencies = () => async (dispatch) => {
  const data = await fetchAPI(URL_CURRENCIES);
  const arrayCurrencies = Object.keys(data).filter((key) => key !== 'USDT');
  dispatch(saveCurrencies(arrayCurrencies));
};

export const fetchQuotation = (value, currency, expenseObj) => async (dispatch) => {
  const data = await fetchAPI(URL_CURRENCIES);
  expenseObj.exchangeRates = data;
  const quotationValue = value * data[currency].ask;
  dispatch(saveExpenses(expenseObj));
  dispatch(addExpenseValue(quotationValue));
};
