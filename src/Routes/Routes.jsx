import {
    createBrowserRouter,
} from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home/Home";
import SignUp from "../Pages/SignUp/SignUp";
import SignIn from "../Pages/SignIn/SignIn";


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
]);