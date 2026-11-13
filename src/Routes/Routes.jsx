import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import CommunityApp from '../Community/Community';
import Dashboard from '../Layouts/Dashboard';
import PrivateRoutes from './PrivateRoutes';
import AdminRoutes from './AdminRoutes';
import ManageUsers from '../Pages/Dashboard/AdminDashboard/ManageUsers';
import MakeAnnouncement from '../Pages/Dashboard/AdminDashboard/MakeAnnouncement';
import Reports from '../Pages/Dashboard/AdminDashboard/Reports';
import AdminProfile from '../Community/LegacyAdminProfile';
import Error from '../Pages/Error/Error';
export const router = createBrowserRouter([
 { path: '/*', element: <CommunityApp /> },
 { path: '/dashboard', element: <PrivateRoutes><Dashboard /></PrivateRoutes>, errorElement: <Error />, children: [
   { path: 'profile', element: <Navigate to="/profile/me" replace /> },
   { path: 'addPost', element: <Navigate to="/?compose=1" replace /> },
   { path: 'myPost', element: <Navigate to="/profile/me" replace /> },
   { path: 'manageUsers', element: <AdminRoutes><ManageUsers /></AdminRoutes> },
   { path: 'adminProfile', element: <AdminRoutes><AdminProfile /></AdminRoutes> },
   { path: 'makeAnnouncement', element: <AdminRoutes><MakeAnnouncement /></AdminRoutes> },
   { path: 'reports', element: <AdminRoutes><Reports /></AdminRoutes> }
 ] }
]);
