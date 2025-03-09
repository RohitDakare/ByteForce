
import { supabase } from './supabase';

/**
 * Generates personalized course recommendations based on a user's skills and profile
 */
export async function getRecommendations() {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      throw new Error('User not authenticated');
    }
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-recommendations', {
      body: { userId: user.user.id }
    });
    
    if (error) {
      console.error('Error generating recommendations:', error);
      return getFallbackRecommendations();
    }
    
    return data;
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return getFallbackRecommendations();
  }
}

/**
 * Fallback recommendations if the AI service is unavailable
 */
function getFallbackRecommendations() {
  return [
    {
      id: 'fallback-1',
      title: 'Introduction to Data Science',
      partner: 'Stanford University',
      description: 'Learn the basics of data analysis, visualization, and machine learning.',
      enrollmentCount: 25000,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692'
    },
    {
      id: 'fallback-2',
      title: 'Advanced JavaScript Patterns',
      partner: 'MIT',
      description: 'Master advanced JavaScript concepts and design patterns.',
      enrollmentCount: 18000,
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    },
    {
      id: 'fallback-3',
      title: 'Machine Learning Fundamentals',
      partner: 'University of California',
      description: 'An introduction to core ML algorithms and applications.',
      enrollmentCount: 30000,
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb'
    }
  ];
}

/**
 * Get AI-powered insights about a user's learning progress
 */
export async function getAIInsights() {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      throw new Error('User not authenticated');
    }
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: { userId: user.user.id }
    });
    
    if (error) {
      console.error('Error getting AI insights:', error);
      return getFallbackInsights();
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAIInsights:', error);
    return getFallbackInsights();
  }
}

/**
 * Fallback insights if the AI service is unavailable
 */
function getFallbackInsights() {
  return {
    currentProgress: 'You\'re making steady progress in your learning journey.',
    recommendation: 'Consider focusing more on practical exercises to reinforce your theoretical knowledge.',
    skillGaps: ['Data Structures', 'System Design', 'Cloud Architecture']
  };
}

/**
 * Search for courses using the AI-powered search function
 */
export async function searchCourses(query: string) {
  try {
    if (!query) {
      return [];
    }
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('search-courses', {
      body: { query }
    });
    
    if (error) {
      console.error('Error searching courses:', error);
      return getFallbackSearchResults(query);
    }
    
    return data;
  } catch (error) {
    console.error('Error in searchCourses:', error);
    return getFallbackSearchResults(query);
  }
}

/**
 * Fallback search results if the AI service is unavailable
 */
function getFallbackSearchResults(query: string) {
  // Simple string matching for fallback functionality
  const courses = [
    {
      id: 'search-1',
      title: 'Web Development Bootcamp',
      partner: 'Udacity',
      description: 'Complete web development course covering HTML, CSS, JavaScript, React, and Node.js',
      enrollmentCount: 45000,
      rating: 4.8
    },
    {
      id: 'search-2',
      title: 'Data Science and Machine Learning',
      partner: 'Coursera',
      description: 'Comprehensive course on data analysis, visualization, and machine learning algorithms',
      enrollmentCount: 38000,
      rating: 4.9
    },
    {
      id: 'search-3',
      title: 'Mobile App Development with Flutter',
      partner: 'Google',
      description: 'Learn to build native mobile applications for iOS and Android with Flutter',
      enrollmentCount: 22000,
      rating: 4.7
    }
  ];
  
  return courses.filter(course => 
    course.title.toLowerCase().includes(query.toLowerCase()) || 
    course.description.toLowerCase().includes(query.toLowerCase())
  );
}
