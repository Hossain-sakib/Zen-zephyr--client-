import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const Announcements = () => {
    const axiosSecure = useAxiosSecure()
    const { data: announcements = [] } = useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const res = await axiosSecure.get('/announcements');
            return res.data
        }
    });
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        return new Date(dateString).toLocaleString("en-US", options);
    };
    return (
        <div className="text-center bg-cyan-100 border-2 border-cyan-600 rounded-lg  space-y-2 my-12 py-4">
            <div className="flex flex-col-reverse p-4 gap-8 md:flex-row">
                <div className="flex-1">
                    <h3 className="text-center text-3xl font-bold text-cyan-500">Announcements: </h3>
                    <div>
                        {announcements.map((announcement) => (
                            <div key={announcement._id} className="border-2 border-cyan-400 rounded-lg p-2 space-y-2">
                                <div className="flex items-center  gap-2">
                                    <div className="avatar">
                                        <div className="w-10 rounded-full overflow-hidden transition-all hover:scale-105  hover:shadow-2xl ">
                                            <img src={announcement.authorImage} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <h1 className="text-sm font-semibold">{announcement.authorName}</h1>
                                        <h1 className="text-xs font-thin text-cyan-600">{formatDate(announcement.createdAt)}</h1>
                                    </div>
                                </div>
                                <div className="flex flex-col text-left">
                                    <h4 className="text-2xl font-bold text-cyan-800">{announcement.title}</h4>
                                    <p className="text-sm font-semibold">{announcement.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 rounded-lg">
                    <img src="https://i.ibb.co/zQGkxS4/Announcement.jpg" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Announcements;