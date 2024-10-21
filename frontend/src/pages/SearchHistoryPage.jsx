import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatDate } from "../utils/dateFunction";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

const SearchHistoryPage = () => {
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        const getSearchHistory = async () => {
            try {
                const res = await axios.get("/api/v1/search/history");
                setSearchHistory(res.data.content);
            } catch (error) {
                console.log(error.message);
                setSearchHistory([]);
            }
        };

        getSearchHistory();
    }, []);

    const handleDelete = async (search) => {
        try {
            await axios.delete(`/api/v1/search/history/${search.id}`);
            setSearchHistory(
                searchHistory.filter((item) => item.id !== search.id),
            );
        } catch (error) {
            toast.error("Failed to delete search item");
        }
    };

    if (searchHistory?.length === 0) {
        return (
            <div className="bg-black min-h-screen text-white">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Search History</h1>
                    <div className="flex justify-center items-center h-96">
                        <p className="text-xl">No search history found</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Search History</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {searchHistory?.map((search, idx) => (
                        <div
                            key={search?.id||idx}
                            className="bg-gray-800 p-4 rounded flex items-start"
                        >
                            <img
                                src={SMALL_IMG_BASE_URL + search.image}
                                alt="history image"
                                className="size-16 rounded-full object-cover mr-4"
                            />
                            <div className="flex flex-col">
                                <span className="text-white text-lg">
                                    {search.title}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {formatDate(search.createdAt)}
                                </span>
                            </div>
                            <span
                                className={`py-1 px-3 min-w-20 text-center rounded-full text-sm ml-auto ${
                                    search?.searchType === "movie"
                                        ? "bg-red-600"
                                        : search?.searchType === "tv"
                                        ? "bg-blue-600"
                                        : "bg-green-600"
                                }`}
                            >
                                {search?.searchType}
                            </span>
                            <Trash
                                className="size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600"
                                onClick={() => handleDelete(search)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchHistoryPage;
