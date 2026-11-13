import { lazy } from 'react';
export const Dashboard = lazy(() => import('../Layouts/Dashboard'));
export const ManageUsers = lazy(() => import('../Pages/Dashboard/AdminDashboard/ManageUsers'));
export const MakeAnnouncement = lazy(
  () => import('../Pages/Dashboard/AdminDashboard/MakeAnnouncement'),
);
export const Reports = lazy(() => import('../Pages/Dashboard/AdminDashboard/Reports'));
export const AdminProfile = lazy(() => import('../Pages/Dashboard/AdminDashboard/AdminProfile'));
