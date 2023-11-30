import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useState } from "react";
import PropTypes from 'prop-types';

const Comments = ({ postId }) => {
    const axiosPublic = useAxiosPublic();
    const [showAllComments, setShowAllComments] = useState(false);

    const { data: comments = [] } = useQuery({
        queryKey: ['comments', postId],
        queryFn: async () => {
            const res = await axiosPublic.get(`/post/${postId}/comments`);
            return res.data;
        },
    });

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        return new Date(dateString).toLocaleString("en-US", options);
    };

    const displayedComments = showAllComments ? comments : comments.slice(0, 2);

    return (
        <div className="px-4">
            {comments.length > 0 && (
                <div className="overflow-hidden transition-all hover:scale-105  hover:shadow-2xl my-2 bg-cyan-300 bg-opacity-30 flex items-center justify-center rounded-lg">
                    <button onClick={() => setShowAllComments(!showAllComments)} className="text-center text-cyan-700 text-sm font-bold py-1">
                        {showAllComments ? "Show Less" : "Show All"}
                    </button>
                </div>
            )}
            {comments.length === 0 && (
                <p className="text-cyan-500 text-center font-semibold text-sm">No comments available....</p>
            )}
            {displayedComments.map((comment) => (
                <div key={comment._id}>
                    <div className="flex items-center gap-2">
                        <h1 className="text-cyan-700 font-bold">{comment.commenterName}</h1>
                        <h1 className="text-cyan-500 text-xs">{formatDate(comment.createdAt)}</h1>
                    </div>
                    <p className="text-sm ">{comment.comment}</p>
                    <div className="divider divider-info"></div>
                </div>
            ))}
        </div>
    );
};

Comments.propTypes = {
    postId: PropTypes.string,
};

export default Comments;
