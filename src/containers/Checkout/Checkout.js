import React, {Component} from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'

class Checkout extends Component {
  state = {
    ingredients: {
      salad:1,
      meat:1,
      cheese:1,
      bacon:1
    }
  }

  componentDidMount () {
    // console.log(new URLSearchParams(this.props.location.search))
    const query = new URLSearchParams(this.props.location.search)
    const ing = {}
    for(let param of query.entries()) {
      ing[param[0]] = +param[1]
    }
    this.setState({ingredients:ing})
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack()
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data')
  }

  render() {
    return (
      <div>
        <CheckoutSummary 
          ingredients={this.state.ingredients} 
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
          />
      </div>
    )
  }
}

export default Checkout;