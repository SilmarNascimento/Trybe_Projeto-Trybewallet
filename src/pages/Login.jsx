import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveEmail } from '../redux/actions';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      inputEmail: '',
      password: '',
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  handleClick = () => {
    const { inputEmail } = this.state;
    const { dispatch, history } = this.props;
    console.log(this.props);
    dispatch(saveEmail(inputEmail));
    history.push('/carteira');
  };

  render() {
    const { inputEmail, password } = this.state;
    const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/g;
    const minLength = 6;
    const isValid = regex.test(inputEmail) && (password.length >= minLength);
    return (
      <>
        <label htmlFor="inputEmail">
          Email
          <input
            type="email"
            id="inputEmail"
            name="inputEmail"
            value={ inputEmail }
            placeholder="Digite aqui o seu Email"
            onChange={ this.handleChange }
            data-testid="email-input"
          />
        </label>
        <label htmlFor="password">
          Senha
          <input
            type="password"
            id="password"
            name="password"
            value={ password }
            placeholder="Digite aqui a sua Senha"
            onChange={ this.handleChange }
            data-testid="password-input"
          />
        </label>
        <button
          disabled={ !isValid }
          onClick={ this.handleClick }
        >
          Entrar
        </button>
      </>
    );
  }
}

export default connect()(Login);

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
