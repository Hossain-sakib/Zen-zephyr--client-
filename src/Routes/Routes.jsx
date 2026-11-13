import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import CommunityApp from '../Community/Community';
import PrivateRoutes from './PrivateRoutes';
import AdminRoutes from './AdminRoutes';
import {
  Dashboard,
  ManageUsers,
  MakeAnnouncement,
  Reports,
  AdminProfile,
} from './DashboardScreens';
const pending = <p role="status">Loading dashboard…</p>;
export const router = createBrowserRouter([
  { path: '/*', element: <CommunityApp /> },
  {
    path: '/dashboard',
    element: (
      <PrivateRoutes>
        <Suspense fallback={pending}>
          <Dashboard />
        </Suspense>
      </PrivateRoutes>
    ),
    children: [
      { path: 'profile', element: <Navigate to="/profile/me" replace /> },
      { path: 'addPost', element: <Navigate to="/?compose=1" replace /> },
      { path: 'myPost', element: <Navigate to="/profile/me" replace /> },
      {
        path: 'manageUsers',
        element: (
          <AdminRoutes>
            <Suspense fallback={pending}>
              <ManageUsers />
            </Suspense>
          </AdminRoutes>
        ),
      },
      {
        path: 'adminProfile',
        element: (
          <AdminRoutes>
            <Suspense fallback={pending}>
              <AdminProfile />
            </Suspense>
          </AdminRoutes>
        ),
      },
      {
        path: 'makeAnnouncement',
        element: (
          <AdminRoutes>
            <Suspense fallback={pending}>
              <MakeAnnouncement />
            </Suspense>
          </AdminRoutes>
        ),
      },
      {
        path: 'reports',
        element: (
          <AdminRoutes>
            <Suspense fallback={pending}>
              <Reports />
            </Suspense>
          </AdminRoutes>
        ),
      },
    ],
  },
]);
