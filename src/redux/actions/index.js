// Coloque aqui suas actions
const URL_CURRENCIES = 'https://economia.awesomeapi.com.br/json/all';
export const SAVE_EMAIL = 'SAVE_EMAIL';
export const SAVE_CURRENCIES = 'SAVE_CURRENCIES';
export const SAVE_EXPENSES = 'SAVE_EXPENSES';
export const CHANGE_EXPENSES = 'CHANGE_EXPENSES';
export const ADD_EXPENSE_VALUE = 'ADD_EXPENSE_VALUE';
export const TOGGLE_EDIT = 'TOGGLE_EDIT';

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

export const changeExpenses = (data) => ({
  type: CHANGE_EXPENSES,
  payload: data,
});

export const addExpenseValue = (expense) => ({
  type: ADD_EXPENSE_VALUE,
  payload: expense,
});

export const toggleEdit = (id) => ({
  type: TOGGLE_EDIT,
  payload: id,
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

export const findTotalExpense = (array) => {
  const valueArray = array.map((item) => {
    const { value, currency, exchangeRates } = item;
    const quotation = parseFloat(exchangeRates[currency].ask);
    return parseFloat(value) * quotation;
  });
  return valueArray.reduce((total, number) => total + number, 0);
};

export const fetchQuotation = (expenses, expenseObj) => async (dispatch) => {
  const data = await fetchAPI(URL_CURRENCIES);
  dispatch(saveExpenses(expenseObj));
  expenseObj.exchangeRates = data;
  const { value, currency } = expenseObj;
  const quotationValue = parseFloat(value) * parseFloat(data[currency].ask);
  const prevSum = findTotalExpense(expenses);
  dispatch(addExpenseValue(quotationValue + prevSum));
};
