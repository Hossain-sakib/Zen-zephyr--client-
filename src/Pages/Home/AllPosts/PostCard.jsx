import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineComment, AiOutlineTag, } from "react-icons/ai";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';


const PostCard = ({ post }) => {
    const { authorImage, title, tag, upVotes, createdAt,downVotes,_id } = post;
    const formattedDate = new Date(createdAt).toLocaleString();
    return (
        <Link to={`/post/${_id}`}>
            <div className="card  border-2 border-cyan-400 rounded-lg bg-cyan-100  ">
                <div className="">
                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="avatar">
                                <div className="w-10 rounded-full overflow-hidden transition-all hover:scale-105  hover:shadow-2xl ">
                                    <img src={authorImage} />
                                </div>
                            </div>
                            <h1 className="text-sm font-semibold">{title}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="badge badge-outline text-xs text-cyan-800 flex items-center justify-center gap-1"><AiOutlineTag></AiOutlineTag>{tag}</button>
                            <h1 className="text-xs font-thin text-cyan-600">{formattedDate}</h1>
                        </div>
                    </div>
                    <div className="bg-cyan-50 w-full flex justify-around ">
                        <div className="w-1/3 flex items-center border border-cyan-400 justify-center">
                            <button className="flex items-center  gap-1 text-xs font-bold text-cyan-600 p-1">{upVotes?.length}<AiOutlineArrowUp className="text-green-600 text-sm"></AiOutlineArrowUp>UpVotes</button>
                        </div>
                        <div className="w-1/3 flex items-center border border-cyan-400 justify-center">
                            <button className="flex items-center  gap-1 text-xs font-bold text-cyan-600 p-1">{downVotes?.length}<AiOutlineArrowDown className="text-red-600 text-sm"></AiOutlineArrowDown>DownVotes</button>
                        </div>
                        <div className="w-1/3 flex items-center border border-cyan-400 justify-center">
                            <button className="flex items-center  gap-1 text-xs font-bold text-cyan-600 p-1">0 <AiOutlineComment className="text-blue-600 text-sm"></AiOutlineComment> Comments</button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

PostCard.propTypes = {
    post: PropTypes.object
}

export default PostCard;