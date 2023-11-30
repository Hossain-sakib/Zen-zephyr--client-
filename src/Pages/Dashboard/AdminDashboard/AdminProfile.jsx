import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaMedal } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import DataPieChart from "./DataPieChart";


const AdminProfile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();

    const { data: userData = [], } = useQuery({
        queryKey: ['userData'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data
        }
    });


    const { data: allPost = [] } = useQuery({
        queryKey: ['allPost'],
        queryFn: async () => {
            const res = await axiosPublic.get('/post');
            return res.data
        }
    });
    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data
        }
    });
    const { data: comments = [] } = useQuery({
        queryKey: ['comments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/comment');
            return res.data
        }
    });

    const totalVotes = allPost.reduce((acc, post) => {
        const upVotesCount = post.upVotes ? post.upVotes.length : 0;
        const downVotesCount = post.downVotes ? post.downVotes.length : 0;
        return acc + upVotesCount - downVotesCount;
    }, 0);

    return (
        <div className="hero min-h-screen">
            <div >
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
                <div className="flex flex-col items-center justify-center space-y-2 mt-16">
                    <h1 className="text-6xl font-semibold text-cyan-800 mb-4">Site Statistics</h1>
                    <div className="text-center space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="badge bg-blue-500 badge-md"></div>
                            <h1 className="text-2xl font-semibold text-cyan-600">Total Users:  {users.length}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="badge bg-emerald-500 badge-md"></div>
                            <h1 className="text-2xl font-semibold text-cyan-600">Total Site Post:  {allPost.length}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="badge bg-orange-500 badge-md"></div>
                            <h1 className="text-2xl font-semibold text-cyan-600">Total Votes:  {totalVotes}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="badge bg-yellow-500 badge-md"></div>
                            <h1 className="text-2xl font-semibold text-cyan-600">Total Comments:  {comments.length}</h1>
                        </div>
                    </div>
                </div>
                <div className="-mt-24">
                    <DataPieChart
                        totalUsers={users.length}
                        totalPosts={allPost.length}
                        totalComments={comments.length}
                        totalVotes={totalVotes}
                    >
                    </DataPieChart>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;