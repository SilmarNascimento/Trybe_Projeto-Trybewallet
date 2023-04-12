import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    const { email, sumExpense, currency } = this.props;
    return (
      <>
        <h1 data-testid="email-field">{ email }</h1>
        <p data-testid="total-field">{ sumExpense }</p>
        <p data-testid="header-currency-field">{ currency }</p>
      </>
    );
  }
}

const mapStateToProps = ({ user, wallet }) => ({
  ...user,
  ...wallet,
});

export default connect(mapStateToProps)(Header);

Header.propTypes = {
  email: PropTypes.string.isRequired,
  sumExpense: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
};
