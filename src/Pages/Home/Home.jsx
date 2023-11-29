import { Helmet } from "react-helmet-async";
import Banner from "../../Components/Banner/Banner";
import Tags from "./Tags/Tags";
import Announcements from "./Announcements/Announcements.Jsx";
import AllPosts from "./AllPosts/AllPosts";


const Home = () => {
    return (
        <div className="mb-24">
            <Helmet>
                <title>Zen Zephyr | Home</title>
            </Helmet>
            <Banner></Banner>
            <Tags></Tags>
            <Announcements></Announcements>
            <AllPosts></AllPosts>
        </div>
    );
};

export default Home;