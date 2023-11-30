import { Link, NavLink } from "react-router-dom";
import {
    AiOutlineHome, AiOutlineCrown, AiOutlineLogout, AiOutlineUser, AiOutlineDashboard
} from "react-icons/ai";
import useAuth from "../../Hooks/useAuth";
import { IoMdNotificationsOutline } from "react-icons/io";

const Navbar = () => {

    const navLinks =
        <>
            <li className="font-semibold text-lg overflow-hidden transition-all hover:scale-105  hover:shadow-2xl"><Link to='/'><AiOutlineHome></AiOutlineHome>Home</Link></li>
            <li className="font-semibold text-lg overflow-hidden transition-all hover:scale-105  hover:shadow-2xl"><Link to='/membership'><AiOutlineCrown></AiOutlineCrown>Membership</Link></li>
            <li className="font-semibold text-lg overflow-hidden transition-all hover:scale-105  hover:shadow-2xl"><Link to='/notifications'><IoMdNotificationsOutline></IoMdNotificationsOutline>Notifications</Link></li>

        </>

const { signOutUser, user } = useAuth();

    return (
        <>
            <div className="navbar fixed z-10 bg-cyan-600 text-white bg-opacity-80  max-w-screen-xl mx-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow  rounded-box w-52 bg-cyan-600 bg-opacity-80 space-y-2">
                            {
                                navLinks
                            }
                        </ul>
                    </div>

                    <Link to='/'><img className="btn btn-square btn-ghost w-16 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl" src="https://i.ibb.co/vB6mq30/zz2.png" alt="" /></Link>

                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 space-x-2 ">
                        {
                            navLinks
                        }
                    </ul>
                </div>
                <div className="navbar-end">
                    <div>
                        {user?.email ? (
                            <div className="dropdown dropdown-end ">
                                <label tabIndex={0} className="cursor-pointer">
                                    <div className="avatar">
                                        <div className="w-10 rounded-full overflow-hidden transition-all hover:scale-105  hover:shadow-2xl ">
                                            <img src={user?.photoURL} alt={user.displayName} />
                                        </div>
                                    </div>
                                </label>
                                <div
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow  rounded-box w-52 bg-cyan-600 bg-opacity-80 space-y-2"
                                >
                                    <NavLink
                                        
                                        className="px-4 py-2  rounded-lg flex  font-semibold  items-center gap-2"
                                    >
                                        {user?.displayName}<AiOutlineUser className="text-xl"></AiOutlineUser>
                                    </NavLink>
                                    <NavLink to={`/dashboard/profile`}
                                        
                                        className="px-4 py-2  rounded-lg  font-semibold
                                        hover:bg-base-100 hover:bg-opacity-10 hover:font-bold flex   items-center gap-2"
                                    >
                                        Dashboard<AiOutlineDashboard className="text-xl"></AiOutlineDashboard>
                                    </NavLink>
                                    <div
                                        onClick={signOutUser}
                                        className="cursor-pointer text-red-500 px-4 py-2  rounded-lg font-bold hover:bg-base-100 hover:bg-opacity-10 hover:font-extrabold flex  items-center gap-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl"
                                    >
                                        Sign Out <AiOutlineLogout className="text-xl"></AiOutlineLogout>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <NavLink
                                to="/signin"
                               className="btn bg-cyan-300 hover:bg-cyan-400 font-bold overflow-hidden transition-all hover:scale-105  hover:shadow-2xl"
                            >
                                Join Us
                            </NavLink>
                        )}
                       
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;