import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useState } from "react";
import { RiChatDeleteLine } from "react-icons/ri";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import Swal from "sweetalert2";


const Reports = () => {
    const [selectedComment, setSelectedComment] = useState(null);
    const axiosSecure = useAxiosSecure();

    const { data: allReport = [], refetch } = useQuery({
        queryKey: ['allReport'],
        queryFn: async () => {
            const res = await axiosSecure.get('/reports');
            return res.data
        }
    });
    console.log(allReport);


    const handleReadMore = (comment) => {
        setSelectedComment(comment);
    };

    const handleDeleteComment = (report) => {
        const commentID = report.commentId;
        const reportID = report._id;
        Swal.fire({
            title: "Are you sure?",
            text: "You want to remove this comment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove !"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/comment/${commentID}`)
                    .then(res => {
                        axiosSecure.delete(`/reports/${reportID}`)
                            .then(res => {
                                refetch();
                                console.log(res.data);
                            })

                        if (res.data.deletedCount > 0) {
                            Swal.fire({
                                title: "Removed!",
                                text: "The Comment has been removed.",
                                icon: "success"
                            });
                        }
                    });

            }
        });
    };

    const handleDeleteReport = (report) => {
        const reportID = report._id;
        Swal.fire({
            title: "Are you sure?",
            text: "You want to remove this report?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove !"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/reports/${reportID}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            Swal.fire({
                                title: "Removed!",
                                text: "The report has been removed.",
                                icon: "success"
                            });
                            refetch();
                        }
                    });

            }
        });
    };






    return (
        <div >
            <div className="hero min-h-screen overflow-x-auto mt-12 ">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr className="bg-cyan-400 text-sm font-bold  text-cyan-950 text-center">
                            <th></th>
                            <th>Report Type</th>
                            <th>Comment</th>
                            <th>Commenter Email</th>
                            <th>Delete Comment</th>
                            <th>Delete Report</th>
                        </tr>
                    </thead>
                    <tbody className="bg-cyan-100 text-center text-cyan-800 font-semibold text-xs">
                        {
                            allReport.map((report, index) => <tr key={report._id}>
                                <th>{index + 1}</th>
                                <td>{report.report}</td>
                                <td>{report.comment.length > 20 ? (
                                    <>
                                        {report.comment.slice(0, 20)}...
                                        <span
                                            className="text-cyan-600 cursor-pointer underline"
                                            onClick={() => handleReadMore(report.comment)}
                                        >
                                            Read More
                                        </span>
                                    </>
                                ) : (
                                    report.comment
                                )}</td>
                                <td>{report.commenterEmail}</td>
                                <td className="overflow-hidden transition-all hover:scale-105  hover:shadow-2xl ">
                                    <button onClick={() => handleDeleteComment(report)} className=" btn-sm text-red-600 hover:bg-cyan-300 rounded-lg "><RiChatDeleteLine></RiChatDeleteLine></button>
                                </td>
                                <td className="overflow-hidden transition-all hover:scale-105  hover:shadow-2xl ">
                                    <button onClick={() => handleDeleteReport(report)} className=" btn-sm text-red-600 hover:bg-cyan-300 rounded-lg "><MdOutlineRemoveCircleOutline></MdOutlineRemoveCircleOutline></button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
                {selectedComment && (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <p className="text-gray-600">{selectedComment}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={() => setSelectedComment(null)}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;