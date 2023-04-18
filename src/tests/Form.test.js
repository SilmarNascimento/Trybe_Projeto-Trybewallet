import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../redux/reducers';
import { renderWithRedux } from './helpers/renderWith';
import WalletForm from '../components/WalletForm';
import Wallet from '../pages/Wallet';
import mockData from './helpers/mockData';

describe('Verifica se o form se comporte da maneira esperada', () => {
  const URL = 'https://economia.awesomeapi.com.br/json/all';
  const currencyOptions = ['USD', 'CAD', 'EUR'];
  const methodOptions = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
  const categoryOptions = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
  const INITIAL_STATE = {
    user: {
      email: 'test@test.com',
    },
    wallet: {
      sumExpense: '0',
      currency: 'BRL',
      currencies: [],
      expenses: [],
      editor: false,
      idToEdit: 0,
    },
  };
  const objStore = {
    INITIAL_STATE,
    store: createStore(rootReducer, INITIAL_STATE, applyMiddleware(thunk)),
  };

  afterEach(() => jest.resetAllMocks());

  test('verifica se o campos estão sendo renderizados corretamente', () => {
    renderWithRedux(<WalletForm />, objStore);

    const valueElement = screen.getByLabelText(/valor da despesa/i);
    const descriptionElement = screen.getByLabelText(/descrição da despesa/i);
    const currencyElement = screen.getByLabelText(/moeda/i);
    const methodElement = screen.getByTestId(/method-input/i);
    const tagElement = screen.getByTestId('tag-input');
    const btnElement = screen.getByRole('button', {
      name: /adicionar despesas/i,
    });

    expect(valueElement).toHaveAttribute('name', 'valueInput');
    expect(descriptionElement).toHaveAttribute('name', 'descriptionInput');
    expect(currencyElement).toHaveAttribute('name', 'currencyInput');
    expect(methodElement).toHaveAttribute('name', 'methodInput');
    expect(tagElement).toHaveAttribute('name', 'tagInput');
    expect(btnElement).toBeInTheDocument();
  });

  test('Verifica se ao alterar o valor do campo input o valor esperado é renderizado', () => {
    renderWithRedux(<WalletForm />);

    const valueElement = screen.getByLabelText(/valor da despesa/i);
    userEvent.type(valueElement, '20');
    expect(valueElement).toHaveValue('20');
    userEvent.clear(valueElement);
    expect(valueElement).toHaveValue('');
  });

  test('Verifica se ao alterar o valor do campo do Description o valor esperado é renderizado', () => {
    renderWithRedux(<WalletForm />);

    const descriptionElement = screen.getByLabelText(/descrição da despesa/i);
    userEvent.type(descriptionElement, 'coxinha');
    expect(descriptionElement).toHaveValue('coxinha');
    userEvent.clear(descriptionElement);
    expect(descriptionElement).toHaveValue('');
  });

  test('Verifica se ao alterar o valor do campo Moeda o valor esperado é renderizado', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    renderWithRedux(<Wallet />, objStore);
    await waitFor(async () => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(URL);
    });

    const currencyElement = screen.queryByTestId('currency-input');
    const optionArray = [];
    optionArray[0] = await screen.findByRole('option', {
      name: currencyOptions[0],
    });
    optionArray[1] = await screen.findByRole('option', {
      name: currencyOptions[1],
    });
    optionArray[2] = await screen.findByRole('option', {
      name: currencyOptions[2],
    });

    optionArray.forEach((option, index) => {
      userEvent.selectOptions(currencyElement, currencyOptions[index]);
      expect(option.selected).toBeTruthy();
      expect(currencyElement).toHaveValue(currencyOptions[index]);
    });
  });

  test('Verifica se ao alterar o valor do campo Método o valor esperado é renderizado', () => {
    renderWithRedux(<WalletForm />, objStore);

    const methodElement = screen.getByTestId(/method-input/i);
    const optionArray = [];
    optionArray[0] = screen.getByRole('option', {
      name: methodOptions[0],
    });
    optionArray[1] = screen.getByRole('option', {
      name: methodOptions[1],
    });
    optionArray[2] = screen.getByRole('option', {
      name: methodOptions[2],
    });

    optionArray.forEach((option, index) => {
      userEvent.selectOptions(methodElement, methodOptions[index]);
      expect(option.selected).toBeTruthy();
      expect(methodElement).toHaveValue(methodOptions[index]);
    });
  });

  test('Verifica se ao alterar o valor dos campo Categoria o valor esperado é renderizado', () => {
    renderWithRedux(<WalletForm />, objStore);

    const tagElement = screen.getByTestId('tag-input');
    const optionArray = [];
    optionArray[0] = screen.getByRole('option', {
      name: categoryOptions[0],
    });
    optionArray[1] = screen.getByRole('option', {
      name: categoryOptions[1],
    });
    optionArray[2] = screen.getByRole('option', {
      name: categoryOptions[2],
    });
    optionArray[3] = screen.getByRole('option', {
      name: categoryOptions[3],
    });
    optionArray[4] = screen.getByRole('option', {
      name: categoryOptions[4],
    });

    optionArray.forEach((option, index) => {
      userEvent.selectOptions(tagElement, categoryOptions[index]);
      expect(option.selected).toBeTruthy();
      expect(tagElement).toHaveValue(categoryOptions[index]);
    });
  });

  test('Verifica se ao clicar no botão as informações são salvas no estado global', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    renderWithRedux(<Wallet />, objStore);
    await waitFor(async () => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(URL);
    });

    const valueElement = screen.getByLabelText(/valor da despesa/i);
    const descriptionElement = screen.getByLabelText(/descrição da despesa/i);
    const currencyElement = screen.getByTestId('currency-input');
    const methodElement = screen.getByTestId(/method-input/i);
    const tagElement = screen.getByTestId('tag-input');
    const btnElement = screen.getByRole('button', {
      name: /adicionar despesas/i,
    });

    userEvent.type(valueElement, '10');
    userEvent.type(descriptionElement, 'sorvete');
    userEvent.selectOptions(currencyElement, 'CAD');
    userEvent.selectOptions(methodElement, methodOptions[2]);
    userEvent.selectOptions(tagElement, categoryOptions[4]);

    userEvent.click(btnElement);
    await waitFor(async () => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(URL);
    });

    expect(valueElement).toHaveValue('');
    expect(descriptionElement).toHaveValue('');
    expect(currencyElement).toHaveValue('USD');
    expect(methodElement).toHaveValue('Dinheiro');
    expect(tagElement).toHaveValue('Alimentação');
  });
});
