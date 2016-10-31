'use strict';
var stripe = require('stripe')('sk_test_JfliVks9eGKRKSJ56nefh31z');
import User from '../user/user.model';

export function charge(req, res, next) {
	console.log('charge');
	var stripeToken = req.body.token;
  var userID = req.body.userID;
  var userEmail = req.body.userEmail;
  var totalPrice = req.body.totalPrice;

  console.log(userEmail);
  stripe.customers.create({
    email: userEmail,
  }, function(err, customer) {
    console.log(customer);
    console.log(userID);

    User.findByIdAndUpdate(userID, {stripeId: customer.id}, function(err, user) {
      if(err) throw err;
      console.log(user);
      stripe.customers.createSource(
        customer.id,
        {source: stripeToken},
        function(err, card) {
          if(err) throw err;
          console.log(card);
          stripe.charges.create({
            amount: totalPrice,
            currency: "usd",
            customer: customer.id,
            source: card.id,
            description: "charge for test"
          }, function(err,charge) {
            if(err) throw err;
            console.log('success');
          });
        }
      );
    })
  });
}

export function getCardInfo(req, res) {
  var customerId = req.params.id;

  stripe.customers.retrieve(customerId, function(err, customer) {
    if(err) throw err;
    else {
      console.log(customer);
      res.json(customer);
    }

  });
}

export function createCustomer(req, res) {
  var userEmail = req.body.userEmail;
  var userID = req.body.userId;

  stripe.customers.create({
    email: userEmail,
  }, function(err, customer) {
    console.log(customer);

    User.findByIdAndUpdate(userID, {stripeId: customer.id}, function(err, user) {
      if(err) throw err;
      console.log(user);
    });
  });

}

export function createCard(req,res) {
  var stripeToken = req.body.token;
  var customerId = req.body.customerId;

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
  var customerId = req.body.customerId;
  var cardId = req.body.cardId;

  stripe.charges.create({
    amount: totalPrice,
    currency: "usd",
    customer: customerId,
    source: cardId,
    description: "charge for test"
  }, function(err, charge) {
    if(err) throw err;
    console.log('success');
  });
}
