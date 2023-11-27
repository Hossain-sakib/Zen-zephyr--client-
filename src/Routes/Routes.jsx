import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home/Home";
import SignUp from "../Pages/SignUp/SignUp";
import SignIn from "../Pages/SignIn/SignIn";
import Dashboard from "../Layouts/Dashboard";
import MyProfile from "../Pages/Dashboard/Myprofile/Myprofile";
import PrivateRoutes from "../Routes/PrivateRoutes"
import AddPost from "../Pages/Dashboard/AddPost/AddPost";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: "/",
                element:<Home></Home>
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
        ]
    }
]);