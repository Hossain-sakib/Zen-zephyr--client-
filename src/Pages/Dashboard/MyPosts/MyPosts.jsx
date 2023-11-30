

import useAuth from "../../../Hooks/useAuth";
import { FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const MyPosts = () => {

    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const userEmail = user?.email;

    const { data: userPosts = [] , refetch} = useQuery({
        queryKey: ['userPosts', userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/${userEmail}/posts`);
            return res.data;
        },
    });

    const handleDelete = item => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to remove this post?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove !"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/post/${item._id}`)
                    .then(res => {
                        refetch();
                        if (res.data.deletedCount > 0) {
                            Swal.fire({
                                title: "Removed!",
                                text: "The post has been removed.",
                                icon: "success"
                            });
                        }
                    })

            }
        });
    }

    return (
        <div className="hero min-h-screen overflow-x-auto mt-12 ">
            <table className="table border-2 border-cyan-500">
                <thead>
                    <tr className="bg-cyan-400 text-sm font-bold  text-cyan-950 text-center">
                        <th>
                            Sl.
                        </th>
                        <th>Title</th>
                        <th>Up Votes</th>
                        <th>Down Votes</th>
                        <th>Comments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="bg-cyan-100 text-center text-cyan-800 font-semibold text-xs">
                    {
                        userPosts.map((item, index) => <tr key={item._id}>
                            <th>
                                {index + 1}
                            </th>
                            <td>
                                {item.title}
                            </td>
                            <td>
                                {item.upVotes?.length}

                            </td>
                            <td>
                                {item.downVotes?.length}
                            </td>
                            <td className="overflow-hidden transition-all hover:scale-105  hover:shadow-2xl hover:font-bold">
                                <Link to={`/post/${item._id}`}>
                                    Show Comments
                                </Link>
                            </td>
                            <td className="overflow-hidden transition-all hover:scale-105  hover:shadow-2xl ">
                                <button onClick={() => handleDelete(item)} className=" btn-sm text-cyan-600 hover:bg-cyan-300 rounded-lg "><FaTrash></FaTrash></button>
                            </td>
                        </tr>)
                    }

                </tbody>
            </table>
        </div>
    );
};

export default MyPosts;