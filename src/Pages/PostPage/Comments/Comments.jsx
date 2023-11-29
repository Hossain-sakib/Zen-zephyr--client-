import { AiOutlineSend } from "react-icons/ai";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import PropTypes from 'prop-types';


const Comments = ({post}) => {
    const {user} = useAuth();
    const axiosPublic = useAxiosPublic();


    const handlePostComment = async(e)=>{
        e.preventDefault();
        const currentDate = new Date(); 
        const formattedDate = currentDate.toISOString();
        const form = e.target;
        const newComment = form.comment.value;
        
        const addComment = {
            postId : post._id,
            commenterEmail : user?.email,
            createdAt: formattedDate,
            comment: newComment
        }
        console.log(addComment);

        const addCommentRes = await axiosPublic.post('/comment', addComment);
        console.log(addCommentRes);
    }
    return (
        <div className="flex items-center justify-center py-2">
            <form onSubmit={handlePostComment} className="flex items-center">
                <div className="form-control">
                    <textarea type="text" name="comment" placeholder="Write a comment...." className="input-bordered textarea border-cyan-400" required ></textarea>
                </div>
                <button type="submit" className="-ml-8"><AiOutlineSend className="text-cyan-400 text-2xl"></AiOutlineSend></button>
            </form>
        </div>
    );
};

Comments.propTypes = {
    post: PropTypes.object
}

export default Comments;