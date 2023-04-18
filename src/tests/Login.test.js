import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRedux, renderWithRouterAndRedux } from './helpers/renderWith';
import Login from '../pages/Login';
import App from '../App';

describe('Testa a Página de Login', () => {
  const testString = 'test@test.com';
  test('Verifica se os componentes aparecem na tela', () => {
    renderWithRedux(<Login />);

    const emailElement = screen.getByLabelText(/email/i);
    expect(emailElement).toBeInTheDocument();

    const passwordElement = screen.getByLabelText(/senha/i);
    expect(passwordElement).toBeInTheDocument();

    const btnElement = screen.getByRole('button', {
      name: /entrar/i,
    });
    expect(btnElement).toBeInTheDocument();
  });

  test('Verifica se o que é digitado nos inputs é exibido na tela', () => {
    renderWithRedux(<Login />);

    const emailElement = screen.getByLabelText(/email/i);
    const passwordElement = screen.getByLabelText(/senha/i);

    userEvent.type(emailElement, testString);
    expect(emailElement).toHaveValue(testString);

    userEvent.type(passwordElement, '123456');
    expect(passwordElement).toHaveValue('123456');
  });

  test('Verifica se o botão "entrar" está habilitado com os inputs corretos', () => {
    renderWithRedux(<Login />);

    const emailElement = screen.getByLabelText(/email/i);
    const passwordElement = screen.getByLabelText(/senha/i);
    const btnElement = screen.getByRole('button', {
      name: /entrar/i,
    });

    userEvent.type(passwordElement, '12345');
    expect(btnElement).toHaveAttribute('disabled');

    userEvent.type(passwordElement, 'a');
    expect(btnElement).toHaveAttribute('disabled');
    userEvent.type(emailElement, testString);
    expect(btnElement).not.toHaveAttribute('disabled');

    userEvent.clear(emailElement);
    userEvent.type(emailElement, 'test.com');
    expect(btnElement).toHaveAttribute('disabled');

    userEvent.clear(emailElement);
    userEvent.type(emailElement, 'test@.com');
    expect(btnElement).toHaveAttribute('disabled');
  });

  test('Verifica se ao clicar no botão "Entrar" com os dados válidos a página Wallet é renderizada', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const emailElement = screen.getByLabelText(/email/i);
    const passwordElement = screen.getByLabelText(/senha/i);
    const btnElement = screen.getByRole('button', {
      name: /entrar/i,
    });

    userEvent.type(emailElement, testString);
    userEvent.type(passwordElement, 'abc123');
    expect(btnElement).not.toHaveAttribute('disabled');

    userEvent.click(btnElement);
    expect(history.location.pathname).toBe('/carteira');
  });
});
