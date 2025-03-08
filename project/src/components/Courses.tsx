import React from 'react';
import { Bookmark } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    description: string;
    duration: string;
    level: string;
    image: string;
}

interface CourseCardProps extends Course {
    onAddToWatchlist: (course: Course) => void;
    isInWatchlist: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
    id, title, description, duration, level, image, onAddToWatchlist, isInWatchlist 
}) => {
    const course = { id, title, description, duration, level, image };
    
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <img src={image} alt={title} className="w-full h-48 object-cover rounded-md mb-4"/>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Duration: {duration}</span>
                <span className="text-sm text-gray-500">Level: {level}</span>
            </div>
            <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Start Course
                </button>
                <button 
                    onClick={() => onAddToWatchlist(course)}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center justify-center ${
                        isInWatchlist 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    title={isInWatchlist ? 'Added to watchlist' : 'Add to watchlist'}
                >
                    <Bookmark className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export const courses = [
    {
        id: 1,
        title: "Web Development Fundamentals",
        description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
        duration: "8 weeks",
        level: "Beginner",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29kaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        title: "Data Science Essentials",
        description: "Master the fundamentals of data analysis, visualization, and machine learning.",
        duration: "12 weeks",
        level: "Intermediate",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZGF0YSUyMHNjaWVuY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        title: "Mobile App Development",
        description: "Create cross-platform mobile applications using React Native.",
        duration: "10 weeks",
        level: "Intermediate",
        image: "https://images.unsplash.com/photo-1526925539332-aa3b66e35444?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bW9iaWxlJTIwYXBwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        title: "Cloud Computing",
        description: "Learn AWS, Azure, and cloud architecture principles.",
        duration: "14 weeks",
        level: "Advanced",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdWQlMjBjb21wdXRpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    }
];

interface CoursesProps {
    watchlist: Course[];
    onAddToWatchlist: (course: Course) => void;
}

const Courses: React.FC<CoursesProps> = ({ watchlist, onAddToWatchlist }) => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard 
                        key={course.id} 
                        {...course} 
                        onAddToWatchlist={onAddToWatchlist}
                        isInWatchlist={watchlist.some(item => item.id === course.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Courses;
