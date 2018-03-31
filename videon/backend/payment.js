// jshint esversion: 6
module.exports = (function(){
    "use strict";
    const MAKE_CREATOR_FEE = 25.00;
    const SUBSCRIPTION_FEE = 3.00;
    const PAYOUT_AMOUNT = 2.75;
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

    payment.createPayoutItem = function(data){
        var sender_batch_id = Math.random().toString(36).substring(9);
        var items = [];
        var sender_item_id = Math.floor(Math.random() * (9999999 - 0));
        data.forEach(function(item){
            items.push({
                "recipient_type": "EMAIL",
                "amount": {
                    "value": PAYOUT_AMOUNT * data.subscriberCount,
                    "currency": "USD"
                },
                "receiver": data.email,
                "note": "Videon payout",
                "sender_item_id": sender_item_id.toString()
            });
            sender_item_id ++;
        });

        var payoutJson = {
            "sender_batch_header": {
                "sender_batch_id": sender_batch_id,
                "email_subject": "You have a payment from Videon"
            }, items
        };

        return payoutJson;
    }


    return payment;
})();