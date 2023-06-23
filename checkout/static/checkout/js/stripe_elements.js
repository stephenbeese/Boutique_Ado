/**
 * Core logic/payment flow for this comes from here:
 * https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements
 * 
 * CSS from here:
 * https://stripe.com/docs/stripe-js
 */

var stripePublicKey = $('#id_stripe_public_key').text().slice(1, -1);
var clientSecret = $('#id_client_secret').text().slice(1, -1);
var stripe = Stripe(stripePublicKey);
var elements = stripe.elements();

var style = {
    base: {
        color: "#000",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
            color: "#aab7c4"
        }
    },
    invalid: {
        //   fontFamily: 'Arial, sans-serif',
        color: "#dc35545",
        iconColor: "#dc3545"
    }
};

var card = elements.create('card', {
    style: style
});

card.mount('#card-element');

// Handle realtime validation errors on the card element

card.addEventListener('change', function (event) {
    var errorDiv = document.getElementById('card-errors');
    if (event.error) {
        var html = `
            <span class="icon" role="alert">
                <i class="fas fa-times"></i>
            </span>
            <span>${event.error.message}</span>
        `;
        $(errorDiv).html(html);
    } else {
        errorDiv.textContent = '';
    }
});

// Handle form submit 
const form = document.getElementById('payment-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    card.update({
        'disabled': true
    });
    $('#submit-button').attr('disabled', true);
    const {
        error
    } = await stripe.confirmPayment(clientSecret, {
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
            return_url: 'https://example.com/order/123/complete',
        },
    });

    if (error) {
        var errorDiv = document.getElementById('card-errors');
        var html = `
            <span class="icon" role="alert">
                <i class="fas fa-times"></i>
            </span>
            <span>${error.message}</span>
        `;
        $(errorDiv).html(html);
        card.update({'disabled': false});
        $('#submit-button').attr('disabled', false);
    } else {

        if (paymentIntent.status === 'succeeded') {
            form.submit()
        }
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
    }
});