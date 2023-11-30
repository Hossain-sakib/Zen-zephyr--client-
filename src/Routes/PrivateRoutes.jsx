import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";



const PrivateRoutes = ({children}) => {
    const {user,loading} = useAuth();
    const location = useLocation();
    if(loading){
        return <span className="loading loading-ring loading-lg"></span>
    }
    if (user){
        return children;
    }
    return <Navigate to='/login' state={{from: location}} replace></Navigate>
};

export default PrivateRoutes;