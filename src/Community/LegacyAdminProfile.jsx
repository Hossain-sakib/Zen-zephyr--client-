import { lazy, Suspense } from 'react';
const Profile = lazy(() => import('../Pages/Dashboard/AdminDashboard/AdminProfile'));
export default function LegacyAdminProfile() {
  return <Suspense fallback={<p role="status">Loading dashboard…</p>}><Profile /></Suspense>;
}
