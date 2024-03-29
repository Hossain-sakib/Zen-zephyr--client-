import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialSignIn from "../../Components/SocialSignIn/SocialSignIn";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const SignIn = () => {
    const { signInUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";
    const handleSignIn = e => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        signInUser(email, password)
            .then(result => {
                const user = result.user;
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

                navigate(from, { replace: true })

            });
    }

    return (
        <div className="hero min-h-screen mb-24">
            <Helmet>
                <title>Zen Zephyr | Sign In</title>
            </Helmet>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="h-80 w-80">
                    <img src="https://i.ibb.co/Lr7v0LQ/Login.jpg" alt="" />
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 rounded-lg border-2 border-cyan-600">
                    <form onSubmit={handleSignIn} className="card-body bg-cyan-50">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-cyan-500">Email</span>
                            </label>
                            <input type="email" placeholder="email" name="email" className="input border-cyan-400 input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-cyan-500">Password</span>
                            </label>
                            <input type="password" placeholder="password" name="password" className="input border-cyan-400 input-bordered" required />
                            <label className="label">
                                <a href="#" className="label-text-alt text-cyan-600 hover:underline hover:font-semibold hover:text-cyan-400">Forgot password?</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn bg-cyan-300 hover:bg-cyan-400 font-bold overflow-hidden transition-all hover:scale-105  hover:shadow-2xl">Sign In</button>
                        </div>
                    </form>
                    <SocialSignIn></SocialSignIn>
                    <p className='text-center text-cyan-500 font-semibold py-4'><small>New Here? Please </small><Link to='/signup' className='hover:underline hover:font-bold'>Sign Up.</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;