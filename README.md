# Fireact SaaS

Fireact SaaS is a comprehensive React-based Software-as-a-Service (SaaS) framework that provides essential features for building subscription-based web applications. Built with TypeScript, TailwindCSS, and Firebase, it offers complete solutions for user management, subscription handling, and multi-tenant architecture.

![Fireact SaaS Demo](https://fireact.dev/img/demos/saas-demo.png)

## Using Fireact SaaS in Your Project

Instead of forking this repository, we recommend using our npm packages in your web application:

- **@fireact.dev/saas**: The main package containing React components and client-side functionality
- **@fireact.dev/saas-cloud-functions**: The package containing Firebase Cloud Functions for handling subscriptions and other server-side operations

Please refer to our [official documentation](https://docs.fireact.dev/saas/) for detailed installation and usage instructions for both packages.

## Contributing

We welcome contributions from the community! Here's how you can help:

### Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. We expect all participants to adhere to our Code of Conduct:

- Be respectful and inclusive of differing viewpoints and experiences
- Use welcoming and inclusive language
- Be collaborative and constructive in your communication
- Focus on what is best for the community
- Show empathy towards other community members

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your PR:
- Includes a clear description of the changes
- Updates relevant documentation
- Adds tests if applicable
- Follows the existing code style
- Passes all tests

## Local Development Setup

To develop Fireact SaaS locally, follow these steps:

### Prerequisites
- Node.js (v14 or later)
- npm (Node Package Manager)
- Firebase account
- Stripe account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/fireactjs/saas.git
   cd saas
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration
Create a `config.json` file in the `src` directory with your Firebase configuration:

```json
{
  "firebase": {
    "apiKey": "YOUR_API_KEY",
    "authDomain": "YOUR_AUTH_DOMAIN",
    "projectId": "YOUR_PROJECT_ID",
    "storageBucket": "YOUR_STORAGE_BUCKET",
    "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
    "appId": "YOUR_APP_ID"
  },
  "stripe": {
    "publicKey": "YOUR_STRIPE_PUBLIC_KEY"
  }
}
```

### Firebase Setup
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   Select Firestore, Functions, and Hosting, and follow the prompts.

### Development Server

You have two options for local development:

#### Quick Development Mode
For rapid development with hot reloading:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

#### Full Testing Mode with Firebase Emulators
For testing with Firebase services:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the Firebase emulators for Authentication, Firestore, Functions, and Hosting:
   ```bash
   firebase emulators:start --only auth,firestore,functions,hosting
   ```

This will serve the built application through Firebase Hosting emulator while providing local Authentication, Firestore, and Cloud Functions services.

For detailed information about developing components for the @fireact.dev/saas and @fireact.dev/saas-cloud-functions packages, please visit our [official documentation](https://docs.fireact.dev/saas/).

### Building for Production
Create a production build:
```bash
npm run build
```

## License
This project is open source and available under the MIT License.
