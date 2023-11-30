import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { MdOutlineAdminPanelSettings } from "react-icons/md"



const ManageUsers = () => {
    const axiosPublic = useAxiosPublic()
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosPublic.get('/users');
            return res.data
        }
    });

    const handleMakeAdmin = user => {
        axiosPublic.patch(`/users/admin/${user._id}`)
            .then(res => {
                console.log(res.data);
                refetch();
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `You made ${user.name} as an admin `,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    };
    return (
        <div >
            <div className="hero min-h-screen overflow-x-auto mt-12 ">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr className="bg-cyan-400 text-sm font-bold  text-cyan-950 text-center">
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Subscription Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-cyan-100 text-center text-cyan-800 font-semibold text-xs">
                        {
                            users.map((user, index) => <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className="flex justify-center items-center">
                                    {
                                        user.role === 'admin' ?
                                            <div className="text-2xl text-cyan-600 rounded-lg">
                                                <MdOutlineAdminPanelSettings ></MdOutlineAdminPanelSettings>
                                            </div>

                                            :
                                            <button onClick={() => handleMakeAdmin(user)} className="overflow-hidden transition-all hover:scale-105 p-1 hover:bg-cyan-200  hover:shadow-2xl hover:font-bold text-cyan-600 rounded-lg">Make Admin</button>

                                    }
                                </td>
                                <td>Subscription</td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;