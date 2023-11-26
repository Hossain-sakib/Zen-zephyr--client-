import { Helmet } from "react-helmet-async";
import Banner from "../../Components/Banner/Banner";
import Tags from "./Tags/Tags";
import Announcements from "./Announcements/Announcements.Jsx";


const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Zen Zephyr | Home</title>
            </Helmet>
            <Banner></Banner>
            <Tags></Tags>
            <Announcements></Announcements>
        </div>
    );
};

export default Home;