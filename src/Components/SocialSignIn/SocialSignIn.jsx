import { AiFillGoogleCircle } from "react-icons/ai";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const SocialSignIn = () => {
    const {googleSignIn} = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();


    const handleGoogleSignIn = () =>{
        googleSignIn()
        .then(result=>{
            console.log(result);
            const badge = 'bronze'
            const userInfo = {
                email: result.user?.email,
                name: result.user?.displayName,
                userImage:result.user?.photoURL,
                badge: badge

            }
            axiosPublic.post('/users',userInfo)
            .then(res=>{
                console.log(res.data);
                navigate('/');
            })
            Swal.fire({
                title: "Successfully signed in",
                showClass: {
                    popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                  `
                },
                hideClass: {
                    popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `
                }
            });
            navigate('/');
        });

    }


    return (
        <div>
        <hr className="mx-8" />
        <p className="mt-4 text-center text-lg font-semibold">Or,<br />Continue with</p>
        <div className="py-4 flex items-center justify-center">
            <button onClick={handleGoogleSignIn} className="btn btn-circle btn-outline font-bold text-cyan-500 text-2xl overflow-hidden transition-all hover:scale-105  hover:shadow-2xl"><AiFillGoogleCircle className="text-cyan-500"></AiFillGoogleCircle></button>
        </div>
    </div>
    );
};

export default SocialSignIn;