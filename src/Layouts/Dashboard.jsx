import { Link, Outlet } from "react-router-dom";
import Sidebar from "../Components/Dashboard/Sidebar/Sidebar";


const Dashboard = () => {
    return (


        <div>
            <div className="drawer lg:hidden">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content p-4">
                    <div className="flex items-center justify-between">
                        <Link to='/'><img className="btn btn-square btn-ghost w-16 overflow-hidden transition-all hover:scale-105  hover:shadow-2xl" src="https://i.ibb.co/vB6mq30/zz2.png" alt="" /></Link>
                        <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost w-16">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                    </div>
                    <div>
                        <Outlet></Outlet>
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <Sidebar></Sidebar>
                </div>

            </div>
            <div className="lg:flex gap-8 hidden">
                <div className=""><Sidebar></Sidebar></div>
                <div className=""><Outlet></Outlet></div>
            </div>
        </div>





    );
};

export default Dashboard;

