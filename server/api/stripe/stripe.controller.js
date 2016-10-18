'use strict';

import stripe from 'stripe';

// Creates a new Artist in the DB
export function create(req, res) {
  	stripe.customers.create({
	  email: 'foo-customer@example.com'
	}).then(function(customer) {
	  return stripe.charges.create({
	    amount: 1600,
	    currency: 'usd',
	    customer: customer.id
	  });
	}).then(function(charge) {
	  // New charge created on a new customer
	  console.log('charge');
	}).catch(function(err) {
	  // Deal with an error
	  console.log('error');
	});
}