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
  Logo,
  FirebaseAuthActions
} from '@fireact.dev/core';
import config from './config.json';
import saasConfig from './saasConfig.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './i18n/locales/en';
import zh from './i18n/locales/zh';
import enSaas from './i18n/locales/saas/en';
import zhSaas from './i18n/locales/saas/zh';
import CreatePlan from './components/CreatePlan';
import Home from './components/Home';
import SubscriptionDashboard from './components/SubscriptionDashboard';
import SubscriptionLayout from './layouts/SubscriptionLayout';
import { SubscriptionDesktopMenu, SubscriptionMobileMenu } from './components/SubscriptionMenuItems';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { MainDesktopMenu, MainMobileMenu } from './components/MainMenuItems';
import Billing from './components/Billing';
import SubscriptionSettings from './components/SubscriptionSettings';
import ProtectedSubscriptionRoute from './components/ProtectedSubscriptionRoute';
import UserList from './components/UserList';
import InviteUser from './components/InviteUser';
import ChangePlan from './components/ChangePlan';
import CancelSubscription from './components/CancelSubscription';
import ManagePaymentMethods from './components/ManagePaymentMethods';
import UpdateBillingDetails from './components/UpdateBillingDetails';
import TransferSubscriptionOwnership from './components/TransferSubscriptionOwnership';

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
                <Route path={config.pages.firebaseActions} element={<FirebaseAuthActions />} />
              </Route>
            </Routes>
          </LoadingProvider>
        </AuthProvider>
      </ConfigProvider>
    </Router>
  );
}

export default App;
