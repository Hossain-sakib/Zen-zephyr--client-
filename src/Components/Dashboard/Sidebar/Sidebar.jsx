import { AiOutlineBook, AiOutlineCrown, AiOutlineFileAdd, AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { RiSpam2Line } from "react-icons/ri";
import { LuUserCog2 } from "react-icons/lu";
import { IoMdNotificationsOutline, } from "react-icons/io";
import { GrAnnounce } from "react-icons/gr";
import {
    Link, NavLink
} from "react-router-dom";
import useAdmin from "../../../Hooks/useAdmin";


const Sidebar = () => {
    const [isAdmin] = useAdmin();
    return (
        <div className="menu w-64 min-h-screen bg-cyan-400">
            <div className="flex items-center justify-center py-8 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                <Link to='/'><img className=" btn btn-ghost" src="https://i.ibb.co/BLHYRbG/zz1.png" alt="" /></Link>
            </div>

            {
                isAdmin ?
                    <ul className="menu p-1 space-y-4 text-lg font-semibold">
                        <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                            <NavLink to={`/dashboard/adminProfile`}><AiOutlineUser></AiOutlineUser> Admin Profile</NavLink>
                        </li>
                        <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                            <NavLink to='/dashboard/addPost'><AiOutlineFileAdd></AiOutlineFileAdd> Add Post</NavLink>
                        </li>
                        <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                            <NavLink to='/dashboard/makeAnnouncement'>< GrAnnounce ></GrAnnounce>Add Announcement
                            </NavLink>
                        </li>
                        <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                            <NavLink to='/dashboard/myPost'><AiOutlineBook></AiOutlineBook> My Posts </NavLink>
                        </li>
                        <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                            <NavLink to='/dashboard/manageUsers'><LuUserCog2></LuUserCog2> Manage Users</NavLink>
                        </li>
                        <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                            <NavLink to='/dashboard/reports'><RiSpam2Line></RiSpam2Line> Reported Activities</NavLink>
                        </li>
                        
                    </ul>


                    :
                    <ul className="menu p-1 space-y-4 text-lg font-semibold">
                        <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                            <NavLink to={`/dashboard/profile`}><AiOutlineUser></AiOutlineUser> Profile</NavLink>
                        </li>
                        <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                            <NavLink to='/dashboard/addPost'><AiOutlineFileAdd></AiOutlineFileAdd> Add Post</NavLink>
                        </li>
                        <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                            <NavLink to='/dashboard/myPost'><AiOutlineBook></AiOutlineBook> My Posts </NavLink>
                        </li>
                    </ul>
            }

            <div className="divider p-4 "></div>
            <ul className="menu p-1 space-y-4 text-lg font-semibold">
                <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                    <NavLink to='/'><AiOutlineHome></AiOutlineHome>Home</NavLink>
                </li>
                <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                    <NavLink to='/membership'><AiOutlineCrown></AiOutlineCrown>Membership</NavLink>
                </li>
                <li className="border-2 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">
                    <NavLink to='/notifications'><IoMdNotificationsOutline></IoMdNotificationsOutline>Notifications</NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;