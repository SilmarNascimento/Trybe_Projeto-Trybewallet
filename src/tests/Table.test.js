import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import rootReducer from '../redux/reducers';
import { renderWithRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';
import mockData from './helpers/mockData';

describe('Verifica se o componente Table é renderizado corretamente', () => {
  const URL = 'https://economia.awesomeapi.com.br/json/all';
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
  const INITIAL_STATE2 = {
    user: {
      email: 'test@test.com',
    },
    wallet: {
      sumExpense: '0',
      currency: 'BRL',
      currencies: [],
      expenses: [{
        id: 0,
        value: '10',
        description: 'hamburger',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Alimentação',
        exchangeRates: mockData,
      }],
      editor: false,
      idToEdit: 0,
    },
  };
  const objStore = {
    INITIAL_STATE,
    store: createStore(rootReducer, INITIAL_STATE, applyMiddleware(thunk)),
  };

  afterEach(() => jest.resetAllMocks());

  test('Verifica se o cabeçalho contem os headers corretos', () => {
    renderWithRedux(<Wallet />);

    const headersElement = screen.getAllByRole('columnheader');
    expect(headersElement).toHaveLength(9);
    expect(headersElement[0]).toContainHTML('Descrição');
    expect(headersElement[8]).toContainHTML('Editar/Excluir');
  });

  test('Verifica se ao clicar no botão de adicionar os itens do formulário aparecem na tela', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    renderWithRedux(<Wallet />, objStore);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(URL);
    });

    const valueElement = screen.getByLabelText(/valor da despesa/i);
    const descriptionElement = screen.getByLabelText(/descrição da despesa/i);
    const currencyElement = screen.getByTestId('currency-input');
    await screen.findByRole('option', {
      name: /cad/i,
    });
    const methodElement = screen.getByTestId(/method-input/i);
    const tagElement = screen.getByTestId('tag-input');
    const btnElement = screen.getByRole('button', {
      name: /adicionar despesas/i,
    });

    act(() => {
      userEvent.type(valueElement, '10');
      userEvent.type(descriptionElement, 'sorvete');
      userEvent.selectOptions(currencyElement, 'CAD');
      userEvent.selectOptions(methodElement, methodOptions[2]);
      userEvent.selectOptions(tagElement, categoryOptions[4]);
      userEvent.click(btnElement);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(URL);
    });

    const cellDesc = await screen.findByRole('cell', {
      name: /sorvete/i,
    });
    const editBtn = await screen.findByRole('button', {
      name: /editar/i,
    });
    const deleteBtn = await screen.findByRole('button', {
      name: /excluir/i,
    });

    expect(cellDesc).toContainHTML('sorvete');
    expect(editBtn).toContainHTML('Editar');
    expect(deleteBtn).toHaveTextContent('Excluir');
  });

  test('Verifica se o botão Excluir funciona corretamente', async () => {
    const objStore2 = {
      INITIAL_STATE2,
      store: createStore(rootReducer, INITIAL_STATE2, applyMiddleware(thunk)),
    };
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });
    const { store } = renderWithRedux(<Wallet />, objStore2);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(URL);
    });
    await screen.findAllByRole('option', {
      name: /cad/i,
    });

    const deleteBtn = await screen.findByRole('button', {
      name: /excluir/i,
    });
    expect(deleteBtn).toBeInTheDocument();
    userEvent.click(deleteBtn);

    const { wallet: { expenses } } = store.getState();
    expect(expenses[0]).toBeFalsy();
    expect(deleteBtn).not.toBeInTheDocument();
  });

  test('Verifica se o botão Editar está funcionando corretament', async () => {
    const objStore2 = {
      INITIAL_STATE2,
      store: createStore(rootReducer, INITIAL_STATE2, applyMiddleware(thunk)),
    };
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });
    const { store } = renderWithRedux(<Wallet />, objStore2);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(URL);
    });
    const addBtn = screen.getByTestId('add-expense');
    const editBtn = screen.getByTestId('edit-btn');
    expect(addBtn).toBeInTheDocument();
    expect(editBtn).toBeInTheDocument();

    userEvent.click(editBtn);
    const finishEditBtn = await screen.findByTestId('edit-expense');
    expect(finishEditBtn).toBeInTheDocument();

    const valueElement = screen.getByLabelText(/valor da despesa/i);
    userEvent.type(valueElement, '5');
    const currencyElement = screen.getByLabelText(/moeda/i);
    await screen.findByRole('option', {
      name: /USD/i,
    });
    userEvent.selectOptions(currencyElement, 'USD');
    const methodElement = screen.getByTestId(/method-input/i);
    userEvent.selectOptions(methodElement, methodOptions[2]);

    userEvent.click(finishEditBtn);
    const { wallet: { expenses } } = store.getState();

    expect(expenses[0].id).toBe(0);
    expect(expenses[0].value).toBe('5');
    expect(expenses[0].currency).toBe('USD');
    expect(expenses[0].method).toBe('Cartão de débito');

    const valuecell = await screen.findByRole('cell', {
      name: /5\.00/i,
    });
    const currencyCell = await screen.findByRole('cell', {
      name: 'Dólar Americano/Real Brasileiro',
    });
    const methodCell = await screen.findByRole('cell', {
      name: /cartão de débito/i,
    });

    expect(valuecell).toBeInTheDocument();
    expect(currencyCell).toBeInTheDocument();
    expect(methodCell).toBeInTheDocument();
  });
});
