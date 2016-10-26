'use strict';
var stripe = require('stripe')('sk_test_JfliVks9eGKRKSJ56nefh31z');
import User from '../user/user.model';


export function charge(req, res, next) {
	console.log('charge');
	var stripeToken = req.body.token;
  var userID = req.body.userID;
  var userEmail = req.body.userEmail;

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
            amount: 200000,
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

  	// var charge = {
   //    amount: 1500,
   //    currency: 'USD',
   //    card: stripeToken
   //  };
   //  stripe.charges.create(charge, function(err, charge) {
   //    if(err) {
   //      return next(err);
   //    } else {
   //      req.flash('message', {
   //        status: 'success',
   //        value: 'Thanks for purchasing!'
   //      });
   //    }
   //  });
}
