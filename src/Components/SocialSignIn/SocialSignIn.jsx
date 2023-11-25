import { AiFillGoogleCircle } from "react-icons/ai";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SocialSignIn = () => {
    const {googleSignIn} = useAuth();
    const navigate = useNavigate();


    const handleGoogleSignIn = () =>{
        googleSignIn()
        .then(res=>{
            console.log(res);
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
            <button onClick={handleGoogleSignIn} className="btn btn-circle btn-outline font-bold text-cyan-500 text-2xl"><AiFillGoogleCircle className="text-cyan-500"></AiFillGoogleCircle></button>
        </div>
    </div>
    );
};

export default SocialSignIn;