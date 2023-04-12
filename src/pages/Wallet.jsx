import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import WalletForm from '../components/WalletForm';
import { fetchCurrencies } from '../redux/actions';
import Table from '../components/Table';

class Wallet extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrencies());
  }

  render() {
    return (
      <>
        <Header />
        { !editor && <WalletForm /> }
        <Table />
      </>
    );
  }
}

export default connect()(Wallet);

Wallet.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
