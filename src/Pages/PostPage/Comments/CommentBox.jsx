import { AiOutlineSend } from "react-icons/ai";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import PropTypes from 'prop-types';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const CommentBox = ({ post }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const { data: comments = [], refetch } = useQuery({
    queryKey: ['comments', post._id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/post/${post._id}/comments`);
      return res.data;
    },
  });

  const handlePostComment = async (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const form = e.target;
    const newComment = form.comment.value;

    const addComment = {
      postId: post._id,
      commenterName: user?.displayName,
      commenterEmail:user?.email,
      createdAt: formattedDate,
      comment: newComment,   
    };

    const addCommentRes = await axiosSecure.post('/comment', addComment);
    refetch();
  };

  return (
    <div className="flex items-center justify-center py-2">
      <form onSubmit={handlePostComment} className="flex items-center">
        <div className="form-control ">
          <textarea
            type="text"
            name="comment"
            placeholder="Write a comment...."
            className="input-bordered textarea border-cyan-400 bg-cyan-50"
            required
          ></textarea>
        </div>
        <button type="submit" className="-ml-8">
          <AiOutlineSend className="text-cyan-400 text-2xl overflow-hidden transition-all hover:text-cyan-600 hover:scale-105  hover:shadow-2xl"></AiOutlineSend>
        </button>
      </form>
    </div>
  );
};

CommentBox.propTypes = {
  post: PropTypes.object,
};

export default CommentBox;
