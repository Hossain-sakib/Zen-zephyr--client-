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





export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: "/",
                element:<Home></Home>
            },
            {
                path: "/post/:id",
                element:<PostPage></PostPage>,
                loader: ({params}) => fetch(`http://localhost:5000/post/${params.id}`) 
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
        children:[
            {
                path:'profile',
                element:<MyProfile></MyProfile>
            },
            {
                path:'addPost',
                element:<AddPost></AddPost>
            },
            {
                path:'myPost',
                element:<MyPosts></MyPosts>
            },


            // admin routes
            {
                path:'manageUsers',
                element:<AdminRoutes><ManageUsers></ManageUsers></AdminRoutes>
            },
            {
                path:'makeAnnouncement',
                element:<AdminRoutes><MakeAnnouncement></MakeAnnouncement></AdminRoutes>
            },

           
        ]
    }
]);