import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Briefcase, Clock, ArrowRight } from 'lucide-react';

const courses = [
  {
    title: "Machine Learning Fundamentals",
    progress: 75,
    timeLeft: "2 weeks left",
    image: "https://images.unsplash.com/photo-1527430253228-e93688616381?w=300&h=200&fit=crop"
  },
  {
    title: "Advanced Python Programming",
    progress: 45,
    timeLeft: "1 month left",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=200&fit=crop"
  }
];

const colleges = [
  {
    name: "Stanford University",
    program: "MS in Computer Science",
    deadline: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=300&h=200&fit=crop"
  },
  {
    name: "MIT",
    program: "MS in Artificial Intelligence",
    deadline: "April 1, 2024",
    image: "https://images.unsplash.com/photo-1565034946487-077786996e27?w=300&h=200&fit=crop"
  }
];

const internships = [
  {
    company: "Google",
    position: "ML Engineer Intern",
    location: "Mountain View, CA",
    deadline: "Rolling"
  },
  {
    company: "Microsoft",
    position: "Data Science Intern",
    location: "Redmond, WA",
    deadline: "March 30, 2024"
  }
];

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
      />
    </div>
  );
}

function CourseCard({ course }: { course: typeof courses[0] }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img src={course.image} alt={course.title} className="w-full h-32 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{course.title}</h3>
        <div className="mt-2">
          <ProgressBar progress={course.progress} />
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{course.timeLeft}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CollegeCard({ college }: { college: typeof colleges[0] }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img src={college.image} alt={college.name} className="w-full h-32 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{college.name}</h3>
        <p className="text-sm text-gray-600">{college.program}</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-primary-600">
          <Clock className="w-4 h-4" />
          <span>Deadline: {college.deadline}</span>
        </div>
      </div>
    </motion.div>
  );
}

function InternshipCard({ internship }: { internship: typeof internships[0] }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-4 rounded-lg shadow-md"
    >
      <h3 className="font-semibold text-gray-900">{internship.company}</h3>
      <p className="text-sm text-gray-600">{internship.position}</p>
      <p className="text-sm text-gray-500">{internship.location}</p>
      <div className="flex items-center gap-2 mt-2 text-sm text-primary-600">
        <Clock className="w-4 h-4" />
        <span>Deadline: {internship.deadline}</span>
      </div>
    </motion.div>
  );
}

function Section({ title, icon: Icon, children }: {
  title: string;
  icon: typeof BookOpen;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center gap-1 text-sm text-primary-600"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
      {children}
    </div>
  );
}

function EducationPanel() {
  return (
    <div className="space-y-6">
      <Section title="Current Courses" icon={BookOpen}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </Section>

      <Section title="College Applications" icon={GraduationCap}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colleges.map((college, index) => (
            <CollegeCard key={index} college={college} />
          ))}
        </div>
      </Section>

      <Section title="Internship Opportunities" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((internship, index) => (
            <InternshipCard key={index} internship={internship} />
          ))}
        </div>
      </Section>
    </div>
  );
}

export default EducationPanel;