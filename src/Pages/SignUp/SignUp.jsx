import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialSignIn from "../../Components/SocialSignIn/SocialSignIn";
import { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";


const SignUp = () => {
    const [signUpError, setSignUpError] = useState('');


    const { signUpUser } = useAuth();
    const navigate = useNavigate();

    const handleSignUp = e => {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        if (password.length < 6) {
            setSignUpError('Password should be at least 6 characters.');
            return;
        }
        else if (!/[A-Z]/.test(password)) {
            setSignUpError('Required at least one uppercase character.');
            return;
        }
        else if (!/[a-z]/.test(password)) {
            setSignUpError('Required at least one lowercase character.');
            return;
        }
        else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
            setSignUpError('Required at least one special character.')
        }

        else if (!/[0-9]/.test(password)) {
            setSignUpError('Required at least one numerical character.');
            return;
        }


        setSignUpError('');


        signUpUser(email, password, name)
            .then((result) => {
                const user = result.user;
                console.log(user);
                Swal.fire({
                    title: "Successfully signed up",
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

            })
            .catch(error => console.error(error))


    }
    return (
        <div className="hero min-h-screen mb-24">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="h-80 w-80">
                    <img src="https://i.ibb.co/X802tCb/SignUp.jpg" alt="" />
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSignUp} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-cyan-500">Name</span>
                            </label>
                            <input type="text" placeholder="name" name="name" className="input border-cyan-400 input-bordered" required />
                        </div>
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
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn bg-cyan-300 hover:bg-cyan-400 font-bold">Sign Up</button>
                        </div>
                    </form>
                    {
                        signUpError && <p className="text-xs text-center text-red-600 p-4">{signUpError}</p>
                    }
                    <SocialSignIn></SocialSignIn>
                    <p className='text-center text-cyan-500 font-semibold py-4'><small>Already have an account? Please </small><Link to='/register' className='hover:underline hover:font-bold'>Sign In.</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;