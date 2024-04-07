import { lazy, ReactElement } from 'react';
import { Navigate, RouteObject, useRoutes, useLocation } from 'react-router-dom';
import { UiLayout } from './ui/ui-layout';
import AppResponseFeature from './ui/app-response-feature';

const AccountListFeature = lazy(() => import('./account/account-list-feature'));
const AccountDetailFeature = lazy(
  () => import('./account/account-detail-feature')
);
const ClusterFeature = lazy(() => import('./cluster/cluster-feature'));
const DashboardFeature = lazy(() => import('./dashboard/dashboard-feature'));

const MonsDotRehabFeature = lazy(
  () => import('./mons-dot-rehab/mons-dot-rehab-feature')
);
const links: { label: string; path: string }[] = [
  { label: 'program', path: '/mons-dot-rehab' },
  { label: 'account', path: '/account' },
];

const routes: (query: string) => RouteObject[] = (query) => [
  { path: '/account/', element: <AccountListFeature /> },
  { path: '/account/:address', element: <AccountDetailFeature /> },
  { path: '/clusters', element: <ClusterFeature /> },
  { path: 'mons-dot-rehab/*', element: <MonsDotRehabFeature /> },
  { path: '/app-response', element: <Navigate to={`/${query}`} replace={true} /> },
];

export function AppRoutes() {
  const location = useLocation();
  const query = location.search;
  return (
    <UiLayout links={links}>
      {useRoutes([
        { index: true, element: <DashboardFeature /> },
        { path: '/', element: <DashboardFeature /> },
        ...routes(query),
        { path: '*', element: <Navigate to={'/${query}'} replace={true} /> },
      ])}
    </UiLayout>
  );
}