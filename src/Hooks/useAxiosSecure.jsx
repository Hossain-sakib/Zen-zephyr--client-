import useAxiosPublic from "./useAxiosPublic";

// Firebase refreshes the ID token; both clients share one interceptor.
export default useAxiosPublic;
