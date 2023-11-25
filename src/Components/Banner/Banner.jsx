import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { AiOutlineSearch } from "react-icons/ai";



const Banner = () => {
    return (
        <div >
            <Carousel>
                <div className="hero w-full h-[640px] " style={{ backgroundImage: 'url(https://i.ibb.co/4gSDCxn/banner1.jpg)' }}>
                    <div className="hero-overlay bg-opacity-60"></div>
                    <div className="hero-content text-center text-neutral-content">
                    </div>
                </div>
                <div className="hero w-full h-[640px]" style={{ backgroundImage: 'url(https://i.ibb.co/3SBC4zq/banner2.jpg)' }}>
                    <div className="hero-overlay bg-opacity-60"></div>
                    <div className="hero-content text-center text-neutral-content">
                    </div>
                </div>
                <div className="hero w-full h-[640px]" style={{ backgroundImage: 'url(https://i.ibb.co/vhzHXmL/banner3.jpg)' }}>
                    <div className="hero-overlay bg-opacity-60"></div>
                    <div className="hero-content text-center text-neutral-content">
                    </div>
                </div>
                <div className="hero w-full h-[640px]" style={{ backgroundImage: 'url(https://i.ibb.co/F89mQf0/banner4.jpg)' }}>
                    <div className="hero-overlay bg-opacity-60"></div>
                    <div className="hero-content text-center text-neutral-content">
                    </div>
                </div>

            </Carousel>
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col justify-center items-center max-w-lg  relative -mt-[640px] space-y-4">
                    <h1 className="text-cyan-200 text-5xl font-bold">Search & Discover</h1>
                    <p className="text-white text-center">Explore a world of knowledge and diverse conversations. Enter keywords below to uncover discussions that match your interests.</p>
                    <div className="flex border-2 border-cyan-300 rounded-lg">
                        <div>
                        <input type="text" placeholder="Enter Tags" className="input w-full " />

                        </div>
                        <button className="rounded-r-lg -ml-2 px-4 text-2xl text-cyan-100 font-bold bg-cyan-500 hover:bg-cyan-600"><AiOutlineSearch></AiOutlineSearch></button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Banner;