import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchQuotation } from '../redux/actions';

class WalletForm extends Component {
  constructor() {
    super();
    this.state = {
      valueInput: '',
      descriptionInput: '',
      currencyInput: 'USD',
      methodInput: 'Dinheiro',
      tagInput: 'Alimentação',
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  handleClick = async (event) => {
    event.preventDefault();
    const {
      valueInput,
      descriptionInput,
      currencyInput,
      methodInput,
      tagInput,
    } = this.state;
    const { expenses, dispatch } = this.props;
    const expenseObj = {
      id: expenses.length,
      value: valueInput,
      description: descriptionInput,
      currency: currencyInput,
      method: methodInput,
      tag: tagInput,
      exchangeRates: {},
    };
    dispatch(fetchQuotation(parseFloat(valueInput), currencyInput, expenseObj));
    this.setState({
      valueInput: '',
      descriptionInput: '',
      currencyInput: 'USD',
      methodInput: 'Dinheiro',
      tagInput: 'Alimentação',
    });
  };

  render() {
    const {
      valueInput,
      descriptionInput,
      currencyInput,
      methodInput,
      tagInput,
    } = this.state;
    const { currencies } = this.props;
    const renderCurrencyList = currencies.map((currency) => (
      <option
        key={ currency }
      >
        {currency}
      </option>
    ));
    return (
      <form action="">
        <fieldset>
          <legend>Wallet Form</legend>
          <label htmlFor="valueInput">
            Valor da Despesa
            <input
              type="text"
              id="valueInput"
              name="valueInput"
              value={ valueInput }
              onChange={ this.handleChange }
              data-testid="value-input"
            />
          </label>
          <label htmlFor="descriptionInput">
            Descrição da Despesa
            <input
              type="text"
              name="descriptionInput"
              id="descriptionInput"
              value={ descriptionInput }
              onChange={ this.handleChange }
              data-testid="description-input"
            />
          </label>
          <label htmlFor="currencyInput">
            Moeda
            <select
              name="currencyInput"
              id="currencyInput"
              value={ currencyInput }
              data-testid="currency-input"
              onChange={ this.handleChange }
            >
              { renderCurrencyList }
            </select>
          </label>
          <label htmlFor="methodInput">
            Método de Pagamento
            <select
              name="methodInput"
              id="methodInput"
              value={ methodInput }
              data-testid="method-input"
              onChange={ this.handleChange }
            >
              <option>Dinheiro</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
            </select>
          </label>
          <label htmlFor="tagInput">
            Método de Pagamento
            <select
              name="tagInput"
              id="tagInput"
              value={ tagInput }
              data-testid="tag-input"
              onChange={ this.handleChange }
            >
              <option>Alimentação</option>
              <option>Lazer</option>
              <option>Trabalho</option>
              <option>Transporte</option>
              <option>Saúde</option>
            </select>
          </label>
          <button
            onClick={ this.handleClick }
          >
            Adicionar Despesas
          </button>
        </fieldset>
      </form>
    );
  }
}

const mapStateToProps = ({ user, wallet }) => ({
  ...user,
  ...wallet,
});

export default connect(mapStateToProps)(WalletForm);

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      valueInput: PropTypes.string.isRequired,
      descriptionInput: PropTypes.string.isRequired,
      currencyInput: PropTypes.string.isRequired,
      methodInput: PropTypes.string.isRequired,
      tagInput: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  dispatch: PropTypes.func.isRequired,
};
