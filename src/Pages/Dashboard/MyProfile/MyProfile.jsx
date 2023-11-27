import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { FaMedal } from "react-icons/fa";


const MyProfile = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

    const { data: userData = [], } = useQuery({
        queryKey: ['userData'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/${user.email}`);
            return res.data
        }
    })

    console.log(userData);

    return (
        <div className="hero min-h-screen bg-cyan-100">
            <div className="hero-content flex-col lg:flex-row space-y-4">
                <img src={userData?.userImage} className="w-96 h-96 rounded-lg shadow-2xl" />
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-4xl font-semibold text-cyan-600 ">{userData?.name}</h1>
                        {
                            userData?.badge === 'bronze' ?
                                <div className="text-slate-500 text-2xl flex flex-col items-center text-center"><FaMedal></FaMedal><span className="text-xs font-light">Bronze</span></div> :
                                <div ><FaMedal></FaMedal><span className="text-xs font-light">Gold</span></div>
                        }
                    </div>
                    <p className="font-light">{userData?.email}</p>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;