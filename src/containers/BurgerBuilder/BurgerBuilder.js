import React, { Component } from "react";
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from  '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as burgerBuilderActions from '../../store/actions/index'

class BurgerBuilder extends Component {
  state = {
    purchaseable: false,
    purchasing: false,
  }

  componentDidMount () {
    this.props.onInitIngredients();
  }

  updatedPurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igkey => {
        return ingredients[igkey]
      })
      .reduce((sum,el) =>{
        return sum + el;
      },0)
    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState({purchasing:true})
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing:false})
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout')
  }

  render () {
    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;
    let burger = this.props.error ? <p>ingredients can't be loaded</p> : <Spinner />

    if(this.props.ings) {
      burger = 
        <Aux>
          <Burger ingredients={this.props.ings}/>
          <BuildControls 
            ingredientAdded = {this.props.onIngredientAdded}
            ingredientRemoved = {this.props.onIngredientRemoved}
            disabled = {disabledInfo}
            price={this.props.price}
            ordered = {this.purchaseHandler}
            purchaseable={this.updatedPurchaseState(this.props.ings)}
          />
        </Aux>
      orderSummary =  <OrderSummary 
      purchaseCancelled={this.purchaseCancelHandler}
      ingredients={this.props.ings}
      purchaseContinued={this.purchaseContinueHandler}
      price={this.props.price}/>
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
    error:state.error
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredients(ingName)),
    onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredients(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));