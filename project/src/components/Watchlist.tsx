import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface Course {
    id: number;
    title: string;
    description: string;
    duration: string;
    level: string;
    image: string;
}

interface WatchlistProps {
    watchlist: Course[];
    onRemoveFromWatchlist: (courseId: number) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ watchlist, onRemoveFromWatchlist }) => {
    if (watchlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-600">
                <BookOpen className="w-16 h-16 mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
                <p>Save courses to watch later by clicking the "Add to Watchlist" button</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((course) => (
                <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative"
                >
                    <button
                        onClick={() => onRemoveFromWatchlist(course.id)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Remove from watchlist"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                    <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded-md mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Duration: {course.duration}</span>
                        <span className="text-sm text-gray-500">Level: {course.level}</span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        Start Course
                    </button>
                </motion.div>
            ))}
        </div>
    );
};

export default Watchlist;
