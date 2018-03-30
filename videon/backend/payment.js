// jshint esversion: 6
module.exports = (function(){
    "use strict";
    const MAKE_CREATOR_FEE = 25.00;
    const SUBSCRIPTION_FEE = 3.00;
    var payment = {};

    payment.generateMakeCreatorPaymentObject = function(){
        return {
            "intent": "authorize",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/api/payment/makeCreator/success/",
                "cancel_url": "http://localhost:5000/err"
            },
            "transactions": [{
                "amount": {
                    "total": MAKE_CREATOR_FEE,
                    "currency": "USD"
                },
                "description": " Becoming a creator on Videon"
            }]
        }
    }

    payment.generateSubscriptionPaymentObject = function(creator){
        return {
            "intent": "authorize",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/api/payment/subscribe/"+creator+"/success/",
                "cancel_url": "http://localhost:5000/err"
            },
            "transactions": [{
                "amount": {
                    "total": SUBSCRIPTION_FEE,
                    "currency": "USD"
                },
                "description": " Subscription to creator " + creator
            }]
        }
    }

    return payment;
})();