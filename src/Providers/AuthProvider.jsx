import { app } from "../Configs/firebase.config";
import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth"

import PropTypes from "prop-types";
import { removeLocal } from "../utils/storage";
import { useQueryClient } from "@tanstack/react-query";
export const AuthContext = createContext(null);
const auth = getAuth(app)
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    const signUpUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password).finally(() => setLoading(false))
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password).finally(() => setLoading(false));
    }

    const googleProvider = new GoogleAuthProvider();

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider).finally(() => setLoading(false));
    }

    const signOutUser = () => {
        setLoading(true);
        queryClient.clear();
        return signOut(auth).finally(() => setLoading(false));
    }

    const updateUser = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            removeLocal('access-token');
            setLoading(false);

        });
        return () => {
            return unsubscribe;
        }


    }, [])




    const authInfo = {
        user,
        loading,
        signUpUser,
        signInUser,
        googleSignIn,
        signOutUser,
        updateUser
    }




    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = { children: PropTypes.node.isRequired };
export default AuthProvider;