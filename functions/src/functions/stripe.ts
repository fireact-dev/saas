import Stripe from 'stripe';

export const stripe = new Stripe(global.saasConfig.stripe.secret_api_key, {
    apiVersion: "2024-10-28.acacia"
});
