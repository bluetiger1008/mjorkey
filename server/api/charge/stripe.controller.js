'use strict';
var stripe = require('stripe')('sk_test_JfliVks9eGKRKSJ56nefh31z');
import User from '../user/user.model';

export function getCardInfo(req, res) {
  var customerId = req.user.stripeId;

  stripe.customers.retrieve(customerId, function(err, customer) {
    if(err) throw err;
    else {
      console.log(customer);
      res.json(customer);
    }

  });
}

export function createCard(req,res) {
  var stripeToken = req.body.token;
  var customerId = req.user.stripeId;

  console.log(stripeToken, customerId);
  stripe.customers.createSource(
    customerId,
    {source: stripeToken},
    function(err, card) {
      if(err) throw err;
      console.log(card);
      res.json(card);
    }
  );
}

export function createCharge(req, res) {
  var totalPrice = req.body.totalPrice;
  var customerId = req.user.stripeId;
  var cardId = req.body.cardId;

  console.log(req.user);
  stripe.charges.create({
    amount: totalPrice * 100,
    currency: "usd",
    customer: customerId,
    source: cardId,
    description: "charge for test"
  }, function(err, charge) {
    if(err) throw err;
    console.log('charge', charge);
    res.json(charge);
  });
}
