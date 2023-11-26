import { AiOutlineTag } from "react-icons/ai";


const Tags = () => {
    return (
        <div className="text-center bg-cyan-100 border-2 border-cyan-600 rounded-lg mx-28 space-y-2 my-12 py-4">
            <h3 className="text-center text-3xl font-bold text-cyan-500">Popular Tags</h3>
            <p className="text-sm text-cyan-600">Pick these following tags to search content</p>
            <div className="space-x-2 space-y-2">
                <button className="btn btn-sm bg-cyan-800 text-cyan-50 hover:bg-cyan-500"><AiOutlineTag></AiOutlineTag>Article</button>
               
            </div>
        </div>
    );
};

export default Tags;