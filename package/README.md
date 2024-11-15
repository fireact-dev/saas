# @fireact.dev/saas

SaaS components and utilities for Fireact applications.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup Firebase](#setup-firebase)
- [Installation](#installation)
- [Project Setup](#project-setup)
  - [Configuration Setup](#configuration-setup)
  - [Stripe Configuration](#stripe-configuration)
  - [Internationalization Setup](#internationalization-setup)
  - [Application Setup](#application-setup)
- [Install the Cloud Functions](#install-the-cloud-functions)
- [Components Reference](#components-reference)
- [License](#license)

## Prerequisites

This package requires a Fireact application set up with @fireact.dev/core. Please follow the setup instructions at:
https://www.npmjs.com/package/@fireact.dev/core

Ensure you have completed the following steps from the core setup:
1. Tailwind CSS configuration
2. Firebase configuration
3. Internationalization setup
4. Basic application structure

## Setup Firebase

1. **Initialise Firebase Cloud Functions

Run `firebase init` to include Cloud Functions in your Firebase setup.

2. **Update Firestore rules**:
   - Navigate to "Firestore Database" in the Firebase Console.
   - Copy the Firestore rules from the example below.

   Example Firestore rules:
   ```plaintext
    rules_version = '2';

    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow authenticated users to read and write their own user document
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }

        // Subscription document rules
        match /subscriptions/{docId} {
          // Allow listing subscriptions for authenticated users
          allow list: if request.auth != null;
          
          // Allow get (individual document read) only to users in permissions.access array
          allow get: if request.auth != null 
            && get(/databases/$(database)/documents/subscriptions/$(docId)).data.permissions.access.hasAny([request.auth.uid]);
          
          // Only allow updates to settings fields if user's UID is in permissions.admin array
          allow update: if request.auth != null 
            && get(/databases/$(database)/documents/subscriptions/$(docId)).data.permissions.admin.hasAny([request.auth.uid])
            && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['settings']);
          
          // Block all other write operations
          allow create, delete: if false;

          // Invoices subcollection rules
          match /invoices/{invoiceId} {
            // Allow reading invoices to subscription admins
            allow read: if request.auth != null 
              && get(/databases/$(database)/documents/subscriptions/$(docId)).data.permissions.admin.hasAny([request.auth.uid]);
            
            // Block direct writes - only allow through cloud functions
            allow write: if false;
          }
        }

        // Invites collection rules
        match /invites/{inviteId} {
          // Allow reading invites to:
          // 1. Subscription admins
          // 2. Users whose email matches the invite email
          allow read: if request.auth != null && (
            get(/databases/$(database)/documents/subscriptions/$(resource.data.subscription_id)).data.permissions.admin.hasAny([request.auth.uid])
            || (request.auth.token.email != null && request.auth.token.email.lower() == resource.data.email)
          );
          
          // Block direct writes - only allow through cloud functions
          allow write: if false;
        }
      }
    }
   ```

## Installation

```bash
npm install @fireact.dev/saas
```

Install the required peer dependencies:

```bash
npm install @stripe/stripe-js
```

## Project Setup

### Configuration Setup

Create `src/saasConfig.json` with your SaaS configuration:

```json
{
    "stripe": {
        "public_api_key": "your-stripe-public-key"
    },
    "plans": [
        {
            "id": "free",
            "titleKey": "plans.free.title",
            "popular": false,
            "priceIds": ["your-stripe-price-id"],
            "currency": "$",
            "price": 0,
            "frequency": "week",
            "descriptionKeys": [
                "plans.free.feature1",
                "plans.free.feature2",
                "plans.free.feature3",
                "plans.free.feature4"
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
        "editor": {
            "label": "Editor",
            "default": false,
            "admin": false
        },
        "admin": {
            "label": "Administrator",
            "default": false,
            "admin": true
        }
    },
    "settings": {
        "name": {
            "type": "string",
            "required": true,
            "label": "subscription.name",
            "placeholder": "subscription.namePlaceholder"
        }
    },
    "pages": {
        "billing": "/subscription/:id/billing",
        "createPlan": "/create-plan",
        "subscription": "/subscription/:id",
        "users": "/subscription/:id/users",
        "invite": "/subscription/:id/users/invite",
        "settings": "/subscription/:id/settings",
        "changePlan": "/subscription/:id/billing/change-plan",
        "cancelSubscription": "/subscription/:id/billing/cancel",
        "managePaymentMethods": "/subscription/:id/billing/payment-methods",
        "updateBillingDetails": "/subscription/:id/billing/update-details",
        "transferOwnership": "/subscription/:id/billing/transfer-ownership"
    }
}
```

### Stripe Configuration

1. Create a Stripe account at https://stripe.com
2. Get your publishable key from the Stripe Dashboard
3. Create products and prices in Stripe:
   - Navigate to Products in your Stripe Dashboard
   - Create products for each plan
   - Create prices for each product
   - Copy the price IDs to use in your saasConfig.json

### Internationalization Setup

1. Create the i18n directory structure:
```
src/
  i18n/
    locales/
      saas/
        en.ts
        zh.ts
```

2. Download the base language files from:
https://github.com/fireact-dev/saas/tree/main/src/i18n/locales/saas

### Update TailwindCSS

Modify the `tailwind.config.js` file to support the `@fireact.dev/saas` package.

```tsx
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@fireact.dev/core/dist/**/*.{js,mjs}",
    "./node_modules/@fireact.dev/saas/dist/**/*.{js,mjs}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Application Setup

Update your `src/App.tsx` to include SaaS components:

```tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './i18n/locales/en';
import zh from './i18n/locales/zh';
import enSaas from './i18n/locales/saas/en';
import zhSaas from './i18n/locales/saas/zh';
import {
  AuthProvider,
  ConfigProvider,
  LoadingProvider,
  PublicLayout,
  AuthenticatedLayout,
  SignIn,
  SignUp,
  ResetPassword,
  Profile,
  EditName,
  EditEmail,
  ChangePassword,
  DeleteAccount,
  Logo
} from '@fireact.dev/core';
import {
  CreatePlan,
  Home,
  SubscriptionDashboard,
  SubscriptionLayout,
  SubscriptionDesktopMenu,
  SubscriptionMobileMenu,
  SubscriptionProvider,
  MainDesktopMenu,
  MainMobileMenu,
  Billing,
  SubscriptionSettings,
  ProtectedSubscriptionRoute,
  UserList,
  InviteUser,
  ChangePlan,
  CancelSubscription,
  ManagePaymentMethods,
  UpdateBillingDetails,
  TransferSubscriptionOwnership
} from '@fireact.dev/saas';
import config from './config.json';
import saasConfig from './saasConfig.json';

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          ...en,
          ...enSaas
        }
      },
      zh: {
        translation: {
          ...zh,
          ...zhSaas
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Combine paths from both config files
const paths = {
  ...config.pages,
  ...saasConfig.pages
};

// Combine configs and include combined paths
const combinedConfig = {
  ...config,
  ...saasConfig,
  pages: paths
};

function App() {
  return (
    <Router>
      <ConfigProvider config={combinedConfig}>
        <AuthProvider>
          <LoadingProvider>
            <Routes>
              <Route element={
                <AuthenticatedLayout 
                  desktopMenuItems={<MainDesktopMenu />}
                  mobileMenuItems={<MainMobileMenu />}
                  logo={<Logo className="w-10 h-10" />}
                />
              }>
                <Route path={paths.home} element={<Navigate to={paths.dashboard} />} />
                <Route path={paths.dashboard} element={<Home />} />
                <Route path={paths.profile} element={<Profile />} />
                <Route path={paths.editName} element={<EditName />} />
                <Route path={paths.editEmail} element={<EditEmail />} />
                <Route path={paths.changePassword} element={<ChangePassword />} />
                <Route path={paths.deleteAccount} element={<DeleteAccount />} />
                <Route path={paths.createPlan} element={<CreatePlan />} />
              </Route>
              
              <Route path={paths.subscription} element={
                <SubscriptionProvider>
                  <SubscriptionLayout 
                    desktopMenu={<SubscriptionDesktopMenu />}
                    mobileMenu={<SubscriptionMobileMenu />}
                    logo={<Logo className="w-10 h-10" />}
                  />
                </SubscriptionProvider>
              }>
                <Route index element={
                  <ProtectedSubscriptionRoute requiredPermissions={['access']}>
                    <SubscriptionDashboard />
                  </ProtectedSubscriptionRoute>
                } />
                <Route path={paths.users} element={
                  <ProtectedSubscriptionRoute requiredPermissions={['admin']}>
                    <UserList />
                  </ProtectedSubscriptionRoute>
                } />
                <Route path={paths.invite} element={
                  <ProtectedSubscriptionRoute requiredPermissions={['admin']}>
                    <InviteUser />
                  </ProtectedSubscriptionRoute>
                } />
                <Route path={paths.billing} element={
                  <ProtectedSubscriptionRoute requiredPermissions={['admin']}>
                    <Billing />
                  </ProtectedSubscriptionRoute>
                } />
                <Route path={paths.settings} element={
                  <ProtectedSubscriptionRoute requiredPermissions={['admin']}>
                    <SubscriptionSettings />
                  </ProtectedSubscriptionRoute>
                } />
                <Route path={paths.changePlan} element={
                  <ProtectedSubscriptionRoute requiredPermissions={['owner']}>
                    <ChangePlan />
                  </ProtectedSubscriptionRoute>
                } />
                <Route path={paths.cancelSubscription} element={
                  <ProtectedSubscriptionRoute requiredPermissions={['owner']}>
                    <CancelSubscription />
                  </ProtectedSubscriptionRoute>
                } />
                <Route path={paths.managePaymentMethods} element={
                  <ProtectedSubscriptionRoute requiredPermissions={['owner']}>
                    <ManagePaymentMethods />
                  </ProtectedSubscriptionRoute>
                } />
                <Route path={paths.updateBillingDetails} element={
                  <ProtectedSubscriptionRoute requiredPermissions={['owner']}>
                    <UpdateBillingDetails />
                  </ProtectedSubscriptionRoute>
                } />
                <Route path={paths.transferOwnership} element={
                  <ProtectedSubscriptionRoute requiredPermissions={['owner']}>
                    <TransferSubscriptionOwnership />
                  </ProtectedSubscriptionRoute>
                } />
              </Route>

              <Route element={<PublicLayout logo={<Logo className="w-20 h-20" />} />}>
                <Route path={paths.signIn} element={<SignIn />} />
                <Route path={paths.signUp} element={<SignUp />} />
                <Route path={paths.resetPassword} element={<ResetPassword />} />
              </Route>
            </Routes>
          </LoadingProvider>
        </AuthProvider>
      </ConfigProvider>
    </Router>
  );
}

export default App;
```

## Install the Cloud Functions

Follow the instructions (https://www.npmjs.com/package/@fireact.dev/saas-cloud-functions) to install the cloud functions

## Components Reference

### Subscription Components
- Billing - Subscription billing management
- BillingForm - Billing information form
- CancelSubscription - Subscription cancellation interface
- ChangePlan - Plan change interface
- CreatePlan - Plan creation interface
- ManagePaymentMethods - Payment methods management
- Plans - Plan listing and selection
- SubscriptionDashboard - Subscription overview
- SubscriptionSettings - Subscription settings management
- TransferSubscriptionOwnership - Ownership transfer interface
- UpdateBillingDetails - Billing details update form

### User Management Components
- EditPermissionsModal - User permissions editor
- InviteUser - User invitation interface
- UserList - User listing and management
- UserTable - User data display

### Navigation Components
- MainDesktopMenu - Main desktop navigation
- MainMobileMenu - Main mobile navigation
- SubscriptionDesktopMenu - Subscription desktop navigation
- SubscriptionMobileMenu - Subscription mobile navigation

### Layout Components
- SubscriptionLayout - Layout for subscription pages

### Context Providers
- SubscriptionProvider - Subscription data context
- useSubscription - Subscription context hook

### Protection Components
- ProtectedSubscriptionRoute - Route protection with permission checks

### Hooks
- useSubscriptionInvoices - Invoice data management

## License

MIT
