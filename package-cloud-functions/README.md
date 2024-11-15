# @fireact.dev/saas-cloud-functions

Cloud Functions for Fireact SaaS applications.

## Prerequisites

- Firebase project with Blaze (pay-as-you-go) plan
- Stripe account for payment processing
- Firebase CLI installed (`npm install -g firebase-tools`)

## Installation

Go to your `functions` folder.

```bash
npm install @fireact.dev/saas-cloud-functions
```

Install the required peer dependencies:

```bash
npm install firebase-admin firebase-functions stripe
```

## Setup

### 1. Initialize Firebase Functions

If you haven't already, initialize Firebase Functions in your project:

```bash
firebase init functions
```

Select TypeScript when prompted.

### 2. Create saasConfig.json

Create `src/saasConfig.json` in your functions directory:

```json
{
    "stripe": {
        "secret_api_key": "your_stripe_secret_key",
        "end_point_secret": "your_stripe_webhook_endpoint_secret"
    },
    "emulators": {
        "enabled": false,
        "useTestKeys": false
    },
    "plans": [
        {
            "id": "free",
            "titleKey": "plans.free.title",
            "popular": false,
            "priceIds": [
                "your_stripe_price_id"
            ],
            "currency": "$",
            "price": 0,
            "frequency": "month",
            "descriptionKeys": [
                "plans.free.feature1",
                "plans.free.feature2",
                "plans.free.feature3"
            ],
            "free": true,
            "legacy": false
        }
    ],
    "permissions": {
        "access": {
            "label": "Access",
            "default": true,
            "admin": false
        },
        "admin": {
            "label": "Administrator",
            "default": false,
            "admin": true
        }
    }
}
```

### 3. Update index.ts

Create or update your functions' `src/index.ts`:

```typescript
import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin
initializeApp();

import type { Plan, Permission } from '@fireact.dev/saas-cloud-functions';
import configFile from './saasConfig.json';

declare global {
    var saasConfig: {
        stripe: {
            secret_api_key: string;
            end_point_secret: string;
        };
        emulators: {
            enabled: boolean;
            useTestKeys: boolean;
        };
        plans: Plan[];
        permissions: Record<string, Permission>;
    };
}

// Initialize global config
global.saasConfig = configFile;

// Import cloud functions after config is initialized
import {
  createSubscription,
  createInvite,
  getSubscriptionUsers,
  acceptInvite,
  rejectInvite,
  revokeInvite,
  removeUser,
  updateUserPermissions,
  stripeWebhook,
  changeSubscriptionPlan,
  cancelSubscription,
  getPaymentMethods,
  createSetupIntent,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  updateBillingDetails,
  getBillingDetails,
  transferSubscriptionOwnership
} from '@fireact.dev/saas-cloud-functions';

// Export cloud functions
export {
  createSubscription,
  createInvite,
  getSubscriptionUsers,
  acceptInvite,
  rejectInvite,
  revokeInvite,
  removeUser,
  updateUserPermissions,
  stripeWebhook,
  changeSubscriptionPlan,
  cancelSubscription,
  getPaymentMethods,
  createSetupIntent,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  updateBillingDetails,
  getBillingDetails,
  transferSubscriptionOwnership
}
```

Rewrite tsconfig.json as the example below.

```
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017",
    "resolveJsonModule": true,
    "esModuleInterop": true
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
```

### 4. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your secret API key from the Stripe Dashboard
3. Set up webhook endpoint:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-region-your-project.cloudfunctions.net/stripeWebhook`
   - Select events to listen for:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
   - Copy the signing secret to use as `end_point_secret` in saasConfig.json

### 5. Deploy to Firebase

1. Build your functions:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy --only functions
```

## Available Functions

### Subscription Management
- `createSubscription` - Create a new subscription
- `changeSubscriptionPlan` - Change subscription plan
- `cancelSubscription` - Cancel subscription
- `transferSubscriptionOwnership` - Transfer subscription ownership

### User Management
- `createInvite` - Create user invitation
- `acceptInvite` - Accept invitation
- `rejectInvite` - Reject invitation
- `revokeInvite` - Revoke invitation
- `removeUser` - Remove user from subscription
- `updateUserPermissions` - Update user permissions
- `getSubscriptionUsers` - Get subscription users

### Payment Management
- `getPaymentMethods` - Get payment methods
- `createSetupIntent` - Create Stripe setup intent
- `setDefaultPaymentMethod` - Set default payment method
- `deletePaymentMethod` - Delete payment method
- `updateBillingDetails` - Update billing details
- `getBillingDetails` - Get billing details

### Webhooks
- `stripeWebhook` - Handle Stripe webhook events

## Testing with Firebase Emulators

1. Update saasConfig.json:
```json
{
    "emulators": {
        "enabled": true,
        "useTestKeys": true
    }
}
```

2. Start emulators:
```bash
firebase emulators:start
```

## License

MIT
