import { Helmet } from "react-helmet-async";
import Announcements from "../Home/Announcements/Announcements";


const Notifications = () => {
    return (
        <div className="hero min-h-screen">
            <Helmet>
                <title>Zen Zephyr | Notifications</title>
            </Helmet>
            <Announcements></Announcements>
        </div>
    );
};

export default Notifications;