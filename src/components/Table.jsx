import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Table extends Component {
  render() {
    const renderContent = () => {
      const { expenses } = this.props;
      const expenseInformation = expenses.map((expense) => {
        const {
          id,
          value,
          description,
          currency,
          method,
          tag,
          exchangeRates,
        } = expense;
        const quotationUsed = exchangeRates[currency].ask;
        console.log(typeof quotationUsed);
        const convertedValue = parseFloat(value) * parseFloat(quotationUsed);
        return (
          <tr key={ id }>
            <td>{ description }</td>
            <td>{ tag }</td>
            <td>{ method }</td>
            <td>{ (parseFloat(value)).toFixed(2) }</td>
            <td>{ exchangeRates[currency].name }</td>
            <td>{ (parseFloat(quotationUsed)).toFixed(2) }</td>
            <td>{ convertedValue.toFixed(2) }</td>
            <td>Real</td>
            <td><button>Editar/Excluir</button></td>
          </tr>
        );
      });
      return expenseInformation;
    };
    return (
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Tag</th>
            <th>Método de pagamento</th>
            <th>Valor</th>
            <th>Moeda</th>
            <th>Câmbio utilizado</th>
            <th>Valor convertido</th>
            <th>Moeda de conversão</th>
            <th>Editar/Excluir</th>
          </tr>
        </thead>
        <tbody>
          { renderContent() }
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = ({ wallet }) => ({
  expenses: wallet.expenses,
});

export default connect(mapStateToProps)(Table);

Table.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      exchangeRates: PropTypes.objectOf(
        PropTypes.shape({
          ask: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  ).isRequired,
};
