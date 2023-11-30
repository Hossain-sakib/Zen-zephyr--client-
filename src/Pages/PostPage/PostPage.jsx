import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineComment, AiOutlineShareAlt, AiOutlineTag } from "react-icons/ai";
import { useLoaderData } from "react-router-dom";
import useAuth from "../../Hooks/useAuth.jsx"
import useAxiosPublic from "../../Hooks/useAxiosPublic.jsx";
import { useState } from "react";
import CommentBox from "./Comments/CommentBox.jsx";
import Comments from "./Comments/Comments.jsx";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure.jsx";
import { Helmet } from "react-helmet-async";
const PostPage = () => {
    const [postData, setPostData] = useState(useLoaderData());
    const [showComments, setShowComments] = useState(false);
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const { data: comments = [] } = useQuery({
        queryKey: ['comments', postData._id],
        queryFn: async () => {
          const res = await axiosPublic.get(`/post/${postData._id}/comments`);
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

    
   


    const handleUpVote = async () => {
        const currentPost = await axiosPublic.get(`/post/${postData._id}`);
        const currentUpVotes = currentPost.data.upVotes || [];
        const currentDownVotes = currentPost.data.downVotes || [];

        if (currentUpVotes.includes(user?.email)) {
            const updatedPost = await axiosSecure.patch(`/post/${postData._id}`, {
                $pull: { upVotes: user?.email },
            });
            console.log('Removed UpVote:', updatedPost.data);
        }
        else if (!currentUpVotes.includes(user?.email) && currentDownVotes.includes(user?.email)) {
            const updatedPost = await axiosSecure.patch(`/post/${postData._id}`, {
                $pull: { downVotes: user?.email },
                $push: { upVotes: user?.email },
            });
            console.log('Removed downVote and added upVote:', updatedPost.data);
        }
        else if (!currentUpVotes.includes(user?.email) && !currentDownVotes.includes(user?.email)) {
            const updatedPost = await axiosSecure.patch(`/post/${postData._id}`, {
                $push: { upVotes: user?.email },
            });
            console.log('added upVote:', updatedPost.data);
        }
        const updatedPostData = await axiosPublic.get(`/post/${postData._id}`);
        setPostData(updatedPostData.data);
    };




    const handleDownVote = async () => {
        const currentPost = await axiosPublic.get(`/post/${postData._id}`);
        const currentUpVotes = currentPost.data.upVotes || [];
        const currentDownVotes = currentPost.data.downVotes || [];

        if (currentDownVotes.includes(user?.email)) {
            const updatedPost = await axiosSecure.patch(`/post/${postData._id}`, {
                $pull: { downVotes: user?.email },
            });
            console.log('Removed DownVote:', updatedPost.data);
        }
        else if (!currentDownVotes.includes(user?.email) && currentUpVotes.includes(user?.email)) {
            const updatedPost = await axiosSecure.patch(`/post/${postData._id}`, {
                $pull: { upVotes: user?.email },
                $push: { downVotes: user?.email },
            });
            console.log('Removed UpVote and added downvote:', updatedPost.data);
        }
        else if (!currentDownVotes.includes(user?.email) && !currentUpVotes.includes(user?.email)) {
            const updatedPost = await axiosSecure.patch(`/post/${postData._id}`, {
                $push: { downVotes: user?.email },
            });
            console.log('added downvote:', updatedPost.data);
        }
        const updatedPostData = await axiosPublic.get(`/post/${postData._id}`);
        setPostData(updatedPostData.data);

    };



    const handleCommentClick = () => {
        setShowComments(!showComments);
    };

    return (
        <div className=" min-h-screen pt-24">
            <Helmet>
                <title>Zen Zephyr | Posts</title>
            </Helmet>
            <div className=" border-2 border-cyan-400 rounded-lg bg-cyan-100 ">
                <div className="">
                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="avatar">
                                <div className="w-10 rounded-full overflow-hidden transition-all hover:scale-105  hover:shadow-2xl ">
                                    <img src={postData.authorImage} />
                                </div>
                            </div>
                            <h1 className="text-sm font-semibold">{postData.authorName}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="badge badge-outline text-xs text-cyan-800 flex items-center justify-center gap-1"><AiOutlineTag></AiOutlineTag>{postData.tag}</button>
                            <h1 className="text-xs font-thin text-cyan-600">{formatDate(postData.createdAt)}</h1>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-cyan-800">{postData.title}</h1>
                            <p className="text-sm font-semibold">{postData.description}</p>
                        </div>
                    </div>
                    <div className="bg-cyan-50 w-full flex justify-around gap-2 px-2 my-2">


                        <div className="w-1/4 flex items-center border border-cyan-400 justify-center overflow-hidden transition-all hover:text-cyan-600 hover:scale-105  hover:shadow-2xl rounded-lg">
                            <button
                                onClick={handleUpVote}
                                className={`flex items-center gap-1 text-xs font-bold ${postData.data?.upVotes.includes(user.email)
                                    ? 'text-green-600 p-1 bg-green-100 border-green-400'
                                    : 'text-cyan-600 p-1 border-cyan-400'
                                    }`}
                            >
                                {postData.upVotes.length}
                                <AiOutlineArrowUp className="text-green-600 text-sm" />

                            </button>
                        </div>


                        <div className="w-1/4 flex items-center border border-cyan-400 justify-center overflow-hidden transition-all hover:text-cyan-600 hover:scale-105  hover:shadow-2xl rounded-lg">
                            <button
                                onClick={handleDownVote}
                                className={`flex items-center gap-1 text-xs font-bold  ${postData.data?.downVotes.includes(user.email)
                                    ? 'text-red-600 p-1 bg-red-100 border-red-400'
                                    : 'text-cyan-600 p-1 border-cyan-400'
                                    }`}
                            >
                                {postData.downVotes.length}
                                <AiOutlineArrowDown className="text-red-600 text-sm" />

                            </button>
                        </div>


                        <div onClick={handleCommentClick} className="w-1/4 flex items-center border border-cyan-400 justify-center overflow-hidden transition-all hover:text-cyan-600 hover:scale-105  hover:shadow-2xl rounded-lg">
                            <button className="flex items-center  gap-1 text-xs font-bold text-cyan-600 p-1">{comments.length} <AiOutlineComment className="text-blue-600 text-sm"></AiOutlineComment> </button>
                        </div>

                        <div className="w-1/4 flex items-center border border-cyan-400 justify-center overflow-hidden transition-all hover:text-cyan-600 hover:scale-105  hover:shadow-2xl rounded-lg">
                            <button className="flex items-center  gap-1 text-xs font-bold text-cyan-600 p-1">do<AiOutlineShareAlt className="text-blue-600 text-sm"></AiOutlineShareAlt></button>
                        </div>
                    </div>

                        {
                            showComments &&
                            <div className="mt-2">
                                <Comments postId={postData._id}></Comments>
                                <CommentBox post={postData}></CommentBox>
                            </div>
                        }

                </div>
            </div>
        </div>
    );
};

export default PostPage;