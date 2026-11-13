import PropTypes from "prop-types";
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
    return <Navigate to='/signin' state={{from: location}} replace></Navigate>
};

PrivateRoutes.propTypes = { children: PropTypes.node.isRequired };
export default PrivateRoutes;