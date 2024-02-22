import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home/Home";
import SignUp from "../Pages/SignUp/SignUp";
import SignIn from "../Pages/SignIn/SignIn";
import Dashboard from "../Layouts/Dashboard";
import PrivateRoutes from "../Routes/PrivateRoutes"
import AddPost from "../Pages/Dashboard/AddPost/AddPost";
import MyProfile from "../Pages/Dashboard/MyProfile/MyProfile"
import PostPage from "../Pages/PostPage/PostPage";
import MyPosts from "../Pages/Dashboard/MyPosts/MyPosts";
import ManageUsers from "../Pages/Dashboard/AdminDashboard/ManageUsers";
import AdminRoutes from "../Routes/AdminRoutes"
import MakeAnnouncement from "../Pages/Dashboard/AdminDashboard/MakeAnnouncement";
import Notifications from "../Pages/Notifications/Notifications";
import CommentList from "../Pages/Dashboard/CommentList/CommentList";
import Reports from "../Pages/Dashboard/AdminDashboard/Reports";
import Error from "../Pages/Error/Error";
import AdminProfile from "../Pages/Dashboard/AdminDashboard/AdminProfile";






export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement:<Error></Error>,
        children: [
            {
                path: "/",
                element:<Home></Home>
            },
            {
                path: "/post/:id",
                element:<PostPage></PostPage>,
                loader: ({params}) => fetch(`https://zen-zepyr-server.vercel.app/post/${params.id}`) 
            },
            {
                path: "/notifications",
                element:<PrivateRoutes><Notifications></Notifications></PrivateRoutes>
            },
        ]
    },
    {
        path:"/signup",
        element:<SignUp></SignUp>
    },
    {
        path:"/signin",
        element:<SignIn></SignIn>
    },
    {
        path:'/dashboard',
        element:<PrivateRoutes><Dashboard></Dashboard></PrivateRoutes>,
        errorElement:<Error></Error>,
        children:[
            {
                path:'profile',
                element:<PrivateRoutes><MyProfile></MyProfile></PrivateRoutes>
            },
            {
                path:'addPost',
                element:<PrivateRoutes><AddPost></AddPost></PrivateRoutes>
            },
            {
                path:'myPost',
                element:<PrivateRoutes><MyPosts></MyPosts></PrivateRoutes>
            },
            {
                path:'commentList/:id',
                element:<PrivateRoutes><CommentList></CommentList></PrivateRoutes>,
                loader: ({params}) => fetch(`https://zen-zepyr-server.vercel.app/post/${params.id}/comments`) 
            },


            // admin routes
            {
                path:'manageUsers',
                element:<AdminRoutes><ManageUsers></ManageUsers></AdminRoutes>
            },
            {
                path:'adminProfile',
                element:<AdminRoutes><AdminProfile></AdminProfile></AdminRoutes>
            },
            {
                path:'makeAnnouncement',
                element:<AdminRoutes><MakeAnnouncement></MakeAnnouncement></AdminRoutes>
            },
            {
                path:'reports',
                element:<AdminRoutes><Reports></Reports></AdminRoutes>
            },

           
        ]
    }
]);