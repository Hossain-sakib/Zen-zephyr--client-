import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import PostCard from "./PostCard";



const AllPosts = () => {
    const axiosPublic = useAxiosPublic();
    const { data: allPost = [] } = useQuery({
        queryKey: ['allPost'],
        queryFn: async () => {
            const res = await axiosPublic.get('/post');
            return res.data
        }
    });


    return (
        <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                {
                    allPost?.map((post) => <PostCard key={post._id} post={post}></PostCard>)
                }
            </div>
        </div>
    );
};

export default AllPosts;