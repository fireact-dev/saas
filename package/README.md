# @fireact.dev/saas

SaaS components and utilities for Fireact applications.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Setup](#project-setup)
  - [Configuration Setup](#configuration-setup)
  - [Stripe Configuration](#stripe-configuration)
  - [Application Setup](#application-setup)
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

## Installation

```bash
npm install @fireact.dev/saas
```

Install the required peer dependencies (if not already installed from @fireact.dev/core):

```bash
npm install @fireact.dev/core @headlessui/react@^1.7.15 @heroicons/react firebase i18next react-i18next react-router-dom tailwindcss
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

### Application Setup

Update your `src/App.tsx` to include SaaS components:

```tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
