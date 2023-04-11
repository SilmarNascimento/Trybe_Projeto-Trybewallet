// Coloque aqui suas actions
export const SAVE_EMAIL = 'SAVE_EMAIL';
export const SAVE_CURRENCIES = 'SAVE_CURRENCIES';
export const SAVE_EXPENSES = 'SAVE_EXPENSES';

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

export const fetchCurrencies = () => async (dispatch) => {
  const URL_CURRENCIES = 'https://economia.awesomeapi.com.br/json/all';
  const response = await fetch(URL_CURRENCIES);
  const data = await response.json();
  const [USD,, ...rest] = Object.keys(data);
  dispatch(saveCurrencies([USD, ...rest]));
};
