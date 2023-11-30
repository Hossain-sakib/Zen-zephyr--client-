import { useLoaderData, useNavigate } from "react-router-dom";
import { GoReport } from "react-icons/go";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";

const CommentList = () => {
    const [selectedComment, setSelectedComment] = useState(null);
    const commentData = useLoaderData();
    const navigate = useNavigate();

    const axiosSecure = useAxiosSecure();

    const handleReadMore = (comment) => {
        setSelectedComment(comment);
    };

    const handleReport = async (e, item) => {
        e.preventDefault();
        const form = e.target;
        const feedback = form.feedback.value;
        const reportData = {
            report: feedback,
            commentId: item._id,
            postId: item.postId,
            comment: item.comment,
            commenterEmail: item.commenterEmail
        }
        const reportDataRes = await axiosSecure.post('/reports', reportData);
        console.log(reportDataRes.data);
        if(reportDataRes.data.insertedId){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Reported successfully.",
                showConfirmButton: false,
                timer: 1000
              });
              navigate('/dashboard/myPost');
        }
       

    };

    return (
        <div className="hero min-h-screen overflow-x-auto mt-12">
            <Helmet>
                <title>Zen Zephyr | Comments</title>
            </Helmet>
            <table className="table border-2 border-cyan-500">
                <thead>
                    <tr className="bg-cyan-400 text-sm font-bold text-cyan-950 text-center">
                        <th>Sl.</th>
                        <th>Commenter name</th>
                        <th>Commenter Email</th>
                        <th>Comment</th>
                        <th>Feedback & Report</th>
                    </tr>
                </thead>
                <tbody className="bg-cyan-100 text-center text-cyan-800 font-semibold text-xs">
                    {commentData.map((item, index) => (
                        <tr key={item._id}>
                            <th>{index + 1}</th>
                            <td>{item.commenterName}</td>
                            <td>{item.commenterEmail}</td>
                            <td> {item.comment.length > 20 ? (
                                <>
                                    {item.comment.slice(0, 20)}...
                                    <span
                                        className="text-cyan-600 cursor-pointer underline"
                                        onClick={() => handleReadMore(item.comment)}
                                    >
                                        Read More
                                    </span>
                                </>
                            ) : (
                                item.comment
                            )}</td>
                            <td >
                                <form onSubmit={(e) => handleReport(e, item)} className="flex items-center justify-center gap-1">
                                    <div className="form-control">
                                        <select defaultValue={'default'} name="feedback" className="select select-bordered select-xs w-full max-w-xs border-cyan-400">
                                            <option disabled value={'default'}>what is wrong?</option>
                                            <option >Spam</option>
                                            <option >Hate Speech</option>
                                            <option >Violence</option>
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <button type="submit" className="btn-sm text-cyan-600 hover:bg-cyan-300 rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl">
                                            <GoReport />
                                        </button>
                                    </div>

                                </form>
                            </td>
                        </tr>
                    ))}
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
    );
};

export default CommentList;
