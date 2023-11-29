import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";


const AddPost = () => {
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const tags = ["art",
        "article",
        "artificial intelligence",
        "business",
        "cooking",
        "crafts",
        "cybersecurity",
        "data science",
        "design",
        "diy",
        "education",
        "event",
        "fashion",
        "fitness",
        "food",
        "gaming",
        "gardening",
        "health",
        "literature",
        "meetup",
        "movies",
        "music",
        "networking",
        "photography",
        "programming",
        "question",
        "science",
        "sports",
        "technology",
        "travel",
        "tv shows",
        "web development"];
    const { user } = useAuth();

    const handlePost = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const tag = form.tag.value;
        const currentDate = new Date(); 
        const formattedDate = currentDate.toISOString(); 


        const addPost = {
            authorName:user.displayName,
            authorImage: user.photoURL,
            authorEmail: user.email,
            title: title,
            description: description,
            tag: tag,
            upVotes:[],
            downVotes:[],
            createdAt: formattedDate
        }
        const addPostRes = await axiosPublic.post('/post', addPost);
        console.log(addPostRes.data);
        if(addPostRes.data.insertedId){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Posted successfully.",
                showConfirmButton: false,
                timer: 1000
              });
              navigate('/dashboard/myPost');
        }
    }

    return (
        <div className="hero min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="h-80 w-80 lg:h-full lg:w-full">
                    <img src="https://i.ibb.co/nz2jy0S/add-post.jpg" alt="" />
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handlePost} className="card-body bg-cyan-50">
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
                            <input type="text" name="title" placeholder="Post title" className="input input-bordered border-cyan-400" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-cyan-500">Description</span>
                            </label>
                            <textarea type="text" name="description" placeholder="Post description" className="input-bordered textarea border-cyan-400" required ></textarea>

                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-cyan-500">Tag</span>
                            </label>
                            <select defaultValue={'default'} name="tag" className="select select-bordered w-full max-w-xs border-cyan-400">
                                <option disabled value={'default'}>Choose a tag</option>
                                {
                                    tags.map((tag, index) => (
                                        <option key={index}>{tag}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn bg-cyan-300 hover:bg-cyan-400 font-bold">Post</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPost;