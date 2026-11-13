import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";


const Error = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
            <Helmet>
                <title>Zen Zephyr | Error</title>
            </Helmet>
            <img className="max-w-xs" src="https://res.cloudinary.com/wiooqx7y/image/upload/v1794474382/zen-zephyr/site-assets/562c7ac1978544cee034.jpg" alt="" />
            <Link to='/'><p className="text-4xl text-red-500 font-medium hover:underline hover:font-bold">Back to homepage</p></Link>
        </div>
    );
};

export default Error;