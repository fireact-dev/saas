import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@fireact.dev/core';
import { useSubscription } from '../contexts/SubscriptionContext';

interface ExtendedConfig {
    permissions: Record<string, {
        label: string;
        default: boolean;
        admin: boolean;
    }>;
    pages: {
        subscription: string;
        users: string;
        billing: string;
        settings: string;
        home: string;
    };
    [key: string]: any;
}

export const SubscriptionDesktopMenu = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { hasPermission, subscription } = useSubscription();
  const config = useConfig() as unknown as ExtendedConfig;
  const plural = t('subscription.plural').charAt(0).toUpperCase() + t('subscription.plural').slice(1);
  
  // Find all permission keys that have admin: true
  const adminPermissions = Object.entries(config.permissions)
    .filter(([_, value]) => value.admin)
    .map(([key]) => key);
  
  // Check if user has any admin permission
  const isAdmin = adminPermissions.some(permission => hasPermission(permission));

  // Get base path from subscription page config
  const basePath = config.pages.subscription.replace(':id', subscription?.id || '');
  
  return (
    <nav className="mt-5 px-2 space-y-4">
      {/* Projects Link */}
      <Link
        to={config.pages.home}
        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
          location.pathname === config.pages.home
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <svg
          className={`[.w-20_&]:mx-auto [.w-64_&]:mr-4 h-6 w-6 ${
            location.pathname === config.pages.home
              ? 'text-indigo-600'
              : 'text-gray-400 group-hover:text-gray-500'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="[.w-20_&]:hidden">{plural}</span>
      </Link>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Dashboard Link */}
      <Link
        to={basePath}
        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
          !location.pathname.includes('/billing') && !location.pathname.includes('/settings') && !location.pathname.includes('/users')
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <svg
          className={`[.w-20_&]:mx-auto [.w-64_&]:mr-4 h-6 w-6 ${
            !location.pathname.includes('/billing') && !location.pathname.includes('/settings') && !location.pathname.includes('/users')
              ? 'text-indigo-600'
              : 'text-gray-400 group-hover:text-gray-500'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className="[.w-20_&]:hidden">{t('dashboard')}</span>
      </Link>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {isAdmin && (
        <div className="space-y-1">
          <Link
            to={config.pages.users.replace(':id', subscription?.id || '')}
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              location.pathname.includes('/users')
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg
              className={`[.w-20_&]:mx-auto [.w-64_&]:mr-4 h-6 w-6 ${
                location.pathname.includes('/users')
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="[.w-20_&]:hidden">{t('subscription.users.menuItem')}</span>
          </Link>

          <Link
            to={config.pages.billing.replace(':id', subscription?.id || '')}
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              location.pathname.includes('/billing')
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg
              className={`[.w-20_&]:mx-auto [.w-64_&]:mr-4 h-6 w-6 ${
                location.pathname.includes('/billing')
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="[.w-20_&]:hidden">{t('subscription.billing')}</span>
          </Link>

          <Link
            to={config.pages.settings.replace(':id', subscription?.id || '')}
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              location.pathname.includes('/settings')
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg
              className={`[.w-20_&]:mx-auto [.w-64_&]:mr-4 h-6 w-6 ${
                location.pathname.includes('/settings')
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="[.w-20_&]:hidden">{t('subscription.settings')}</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export const SubscriptionMobileMenu = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { hasPermission, subscription } = useSubscription();
  const config = useConfig() as unknown as ExtendedConfig;
  const plural = t('subscription.plural').charAt(0).toUpperCase() + t('subscription.plural').slice(1);

  // Find all permission keys that have admin: true
  const adminPermissions = Object.entries(config.permissions)
    .filter(([_, value]) => value.admin)
    .map(([key]) => key);

  // Check if user has any admin permission
  const isAdmin = adminPermissions.some(permission => hasPermission(permission));

  // Get base path from subscription page config
  const basePath = config.pages.subscription.replace(':id', subscription?.id || '');

  return (
    <div className="space-y-4">
      {/* Projects Link */}
      <Link
        to={config.pages.home}
        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
          location.pathname === config.pages.home
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-200 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <svg
          className={`mr-4 h-6 w-6 ${
            location.pathname === config.pages.home
              ? 'text-indigo-600'
              : 'text-gray-400 group-hover:text-gray-300'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>{plural}</span>
      </Link>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Dashboard Link */}
      <Link
        to={basePath}
        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
          !location.pathname.includes('/billing') && !location.pathname.includes('/settings') && !location.pathname.includes('/users')
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-200 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <svg
          className={`mr-4 h-6 w-6 ${
            !location.pathname.includes('/billing') && !location.pathname.includes('/settings') && !location.pathname.includes('/users')
              ? 'text-indigo-600'
              : 'text-gray-400 group-hover:text-gray-300'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span>{t('dashboard')}</span>
      </Link>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {isAdmin && (
        <div className="space-y-1">
          <Link
            to={config.pages.users.replace(':id', subscription?.id || '')}
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              location.pathname.includes('/users')
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-200 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <svg
              className={`mr-4 h-6 w-6 ${
                location.pathname.includes('/users')
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-gray-300'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>{t('subscription.users.menuItem')}</span>
          </Link>

          <Link
            to={config.pages.billing.replace(':id', subscription?.id || '')}
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              location.pathname.includes('/billing')
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-200 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <svg
              className={`mr-4 h-6 w-6 ${
                location.pathname.includes('/billing')
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-gray-300'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{t('subscription.billing')}</span>
          </Link>

          <Link
            to={config.pages.settings.replace(':id', subscription?.id || '')}
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              location.pathname.includes('/settings')
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-200 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <svg
              className={`mr-4 h-6 w-6 ${
                location.pathname.includes('/settings')
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-gray-300'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{t('subscription.settings')}</span>
          </Link>
        </div>
      )}

      {/* Bottom Divider */}
      <div className="mt-4 border-t border-gray-700"></div>
    </div>
  );
};
