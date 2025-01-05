# @fireact.dev/saas

The @fireact.dev/saas package provides a starter kit for building SaaS web apps quickly based on the @fireact.dev/core package.

![SaaS Screenshot](https://fireact.dev/img/demos/saas-demo.png)

## Installation

For installation instructions, please visit the [official documentation](https://docs.fireact.dev/saas/getting-started/).

## Key Features

- Multiple subscription plans
- Stripe integration for payments
- Billing portal and invoice management
- Team collaboration and workspaces
- Role-based access control
- Permission level management
- User invitations and team management

## Architecture Overview

The package is built on top of @fireact.dev/core and provides additional SaaS-specific components and utilities. It uses:

- React 18 for UI components
- TailwindCSS for styling
- Firebase for backend services
- React Router for navigation
- i18next for internationalization

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

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (git checkout -b feature/YourFeatureName)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature/YourFeatureName)
5. Create a new Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## License

MIT

## Documentation

For complete documentation, visit [https://fireact.dev/saas](https://fireact.dev/saas)

## Support

For support and questions, please open an issue on [GitHub](https://github.com/fireact-dev/saas/issues)
