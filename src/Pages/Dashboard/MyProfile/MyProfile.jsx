import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import { FaMedal } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";


const MyProfile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: userData = [], } = useQuery({
        queryKey: ['userData'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data
        }
    })

    return (
        <div className="hero min-h-screen">
            <Helmet>
                <title>Zen Zephyr | My Profile</title>
            </Helmet>
            <div className="hero-content flex-col lg:flex-row space-y-8 bg-cyan-100 p-8 rounded-lg border-2 border-cyan-600">
                <img src={userData?.userImage} className="w-96 h-96 rounded-lg shadow-2xl" />
                <div className="space-y-2">
                    <div className="flex items-center gap-6">
                        <h1 className="text-4xl font-semibold text-cyan-600 ">{userData?.name}</h1>
                        {
                            userData?.badge === 'bronze' ?
                                <div className="text-slate-500 text-2xl flex flex-col items-center text-center overflow-hidden transition-all hover:scale-105  hover:shadow-2xl"><FaMedal className="text-slate-500 "></FaMedal><span className="text-xs font-light">Bronze</span></div> :
                                <div className="text-amber-500 text-2xl flex flex-col items-center text-center overflow-hidden transition-all hover:scale-105  hover:shadow-2xl"><FaMedal className="text-amber-500"></FaMedal><span className="text-xs font-light">Gold</span></div>
                        }
                    </div>
                    <p className="font-light">{userData?.email}</p>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;