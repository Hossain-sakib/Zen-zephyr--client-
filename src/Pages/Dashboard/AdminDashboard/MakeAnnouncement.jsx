import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";


const MakeAnnouncement = () => {
    const {user} = useAuth();

    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleAnnounce = async (e)=>{
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const currentDate = new Date(); 
        const formattedDate = currentDate.toISOString();

        const addAnnouncement = {
            authorName:user.displayName,
            authorImage: user.photoURL,
            authorEmail: user.email,
            title: title,
            description: description,
            createdAt: formattedDate
        };
        const addAnnouncementRes = await axiosSecure.post('/announcements',addAnnouncement);
        if(addAnnouncementRes.data.insertedId){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Announced successfully.",
                showConfirmButton: false,
                timer: 1000
              });
              navigate('/');
        }
    };
    return (
        <div className="hero min-h-screen">
            <Helmet>
                <title>Zen Zephyr | Create Announcement</title>
            </Helmet>
        <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="h-80 w-80 lg:h-full lg:w-full">
                <img src="https://i.ibb.co/zQGkxS4/Announcement.jpg" alt="" />
            </div>
            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 ">
                <form onSubmit={handleAnnounce} className="card-body bg-cyan-50 rounded-lg border-2 border-cyan-600">
                    <div className="flex items-center gap-2">
                        <div className="avatar ">
                            <div className="w-10 rounded-full overflow-hidden transition-all hover:scale-105  hover:shadow-2xl ">
                                <img src={user?.photoURL} alt={user.displayName} />
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-cyan-600">{user?.displayName}</p>
                            <p className="text-xs font-light">{user?.email}</p>
                        </div>

                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-cyan-500">Title</span>
                        </label>
                        <input type="text" name="title" placeholder="Announcement title" className="input input-bordered border-cyan-400" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-cyan-500">Description</span>
                        </label>
                        <textarea type="text" name="description" placeholder="Announcement description" className="input-bordered textarea border-cyan-400" required ></textarea>

                    </div>
                    <div className="form-control mt-6">
                        <button className="btn bg-cyan-300 hover:bg-cyan-400 font-bold overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">Create Announcement</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
};

export default MakeAnnouncement;