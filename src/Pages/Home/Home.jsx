import { Helmet } from "react-helmet-async";
import Banner from "../../Components/Banner/Banner";
import Tags from "./Tags/Tags";
import Announcements from "./Announcements/Announcements.Jsx";
import AllPosts from "./AllPosts/AllPosts";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";


const Home = () => {
    const axiosSecure = useAxiosSecure()
    const { data: announcements = [] } = useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const res = await axiosSecure.get('/announcements');
            return res.data
        }
    });
    return (
        <div className="mb-24">
            <Helmet>
                <title>Zen Zephyr | Home</title>
            </Helmet>
            <Banner></Banner>
            <Tags></Tags>
            {announcements.length > 0 && (
                <Announcements></Announcements>
            )}

            <AllPosts></AllPosts>
        </div>
    );
};

export default Home;