import { AiOutlineBook, AiOutlineCrown, AiOutlineFileAdd, AiOutlineHome, AiOutlineNotification, AiOutlineUser } from "react-icons/ai";
import { Link, NavLink
 } from "react-router-dom";


const Sidebar = () => {
    return (
        <div className="menu w-64 min-h-screen bg-cyan-400">
                <div className="flex items-center justify-center py-8">
                    <Link to='/'><img className=" btn btn-ghost" src="https://i.ibb.co/BLHYRbG/zz1.png" alt="" /></Link>
                </div>

                <ul className="menu p-4 space-y-4 text-xl font-semibold">
                    <li className="border-2">
                        <NavLink to={`/dashboard/profile`}><AiOutlineUser></AiOutlineUser> Profile</NavLink>
                    </li>
                    <li className="border-2">
                        <NavLink to='/dashboard/addPost'><AiOutlineFileAdd></AiOutlineFileAdd> Add Post</NavLink>
                    </li>
                    <li className="border-2">
                        <NavLink to='/dashboard/myPost'><AiOutlineBook></AiOutlineBook> My Posts </NavLink>
                    </li>
                </ul>

                <div className="divider p-4 "></div>
                <ul className="menu p-4 space-y-4 text-xl font-semibold">
                    <li className="border-2">
                        <NavLink to='/'><AiOutlineHome></AiOutlineHome>Home</NavLink>
                    </li>
                    <li className="border-2">
                        <NavLink to='/membership'><AiOutlineCrown></AiOutlineCrown>Membership</NavLink>
                    </li>
                    <li className="border-2">
                        <NavLink to='/notifications'><AiOutlineNotification></AiOutlineNotification>Notifications</NavLink>
                    </li>
                </ul>
            </div>
    );
};

export default Sidebar;