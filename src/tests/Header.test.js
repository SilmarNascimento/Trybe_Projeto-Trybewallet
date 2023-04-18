import { screen } from '@testing-library/react';
import { renderWithRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';

describe('Testa a página de Wallet', () => {
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

  test('Verifica se os componentes são renderizados na tela', () => {
    renderWithRedux(<Wallet />, { initialState: INITIAL_STATE });

    const headingElement = screen.getByRole('heading', {
      name: /test@test/i,
    });
    const expenseElement = screen.getByTestId('total-field');
    const myCurrencyElement = screen.getByTestId('header-currency-field');
    const formElement = screen.getByRole('group', {
      name: /wallet form/i,
    });
    const tableElement = screen.getByRole('table');

    expect(headingElement).toBeInTheDocument();
    expect(expenseElement).toBeInTheDocument();
    expect(myCurrencyElement).toBeInTheDocument();
    expect(formElement).toBeInTheDocument();
    expect(tableElement).toBeInTheDocument();
  });
});
