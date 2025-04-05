'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

export default function SocialHub() {
  const { isDarkMode } = useTheme();
  
  // Mock data for events
  const [events] = useState([
    {
      id: 1,
      title: 'Community Cleanup Drive',
      date: 'April 15, 2025',
      time: '9:00 AM - 12:00 PM',
      location: 'Central Park',
      organizer: 'Anonymous #7B32',
      participants: 45,
      description: 'Join us for a cleanup drive to make our park cleaner and greener. Gloves and bags will be provided.',
      category: 'Environment',
    },
    {
      id: 2,
      title: 'Urban Planning Workshop',
      date: 'April 20, 2025',
      time: '2:00 PM - 5:00 PM',
      location: 'Community Center',
      organizer: 'Anonymous #9F14',
      participants: 28,
      description: 'Learn about urban planning principles and contribute ideas for our city\'s development plan.',
      category: 'Education',
    },
    {
      id: 3,
      title: 'Digital Literacy Drive',
      date: 'April 25, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Public Library',
      organizer: 'Anonymous #3C67',
      participants: 32,
      description: 'Volunteers needed to help teach basic digital skills to senior citizens and underprivileged groups.',
      category: 'Digital',
    },
  ]);

  // Mock data for skill sharing
  const [skills] = useState([
    {
      id: 1,
      category: 'Technical',
      skills: [
        { id: 101, name: 'Web Development', users: 24 },
        { id: 102, name: 'Data Analysis', users: 17 },
        { id: 103, name: 'Mobile App Development', users: 11 },
      ]
    },
    {
      id: 2,
      category: 'Environment',
      skills: [
        { id: 201, name: 'Urban Gardening', users: 31 },
        { id: 202, name: 'Waste Management', users: 22 },
        { id: 203, name: 'Composting', users: 19 },
      ]
    },
    {
      id: 3,
      category: 'Community',
      skills: [
        { id: 301, name: 'Event Organization', users: 35 },
        { id: 302, name: 'Conflict Resolution', users: 14 },
        { id: 303, name: 'Public Speaking', users: 27 },
      ]
    },
  ]);

  // Mock data for local groups
  const [groups] = useState([
    {
      id: 1,
      name: 'Green Warriors',
      members: 78,
      description: 'Focused on environmental initiatives and sustainability projects within the city.',
      category: 'Environment',
      recentActivity: 'Planning tree plantation drive for next month',
    },
    {
      id: 2,
      name: 'Tech Innovators',
      members: 42,
      description: 'Group for tech enthusiasts working on innovative solutions for urban challenges.',
      category: 'Technology',
      recentActivity: 'Developing a local water quality monitoring system',
    },
    {
      id: 3,
      name: 'Urban Artists',
      members: 56,
      description: 'Artists collaborating on public art projects to beautify city spaces.',
      category: 'Arts & Culture',
      recentActivity: 'Preparing mural designs for the subway station',
    },
  ]);

  // Selected event
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  // Form state for sending message
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'Anonymous #4F72',
      content: 'Has anyone noticed the improved street lighting on MG Road? It feels much safer to walk there at night now.',
      timestamp: '2 hours ago',
      likes: 12,
      replies: 3,
    },
    {
      id: 2,
      author: 'Anonymous #9E21',
      content: 'I submitted a pothole report last week and it was fixed within 48 hours! Really impressed with the quick response.',
      timestamp: '5 hours ago',
      likes: 24,
      replies: 7,
    },
    {
      id: 3,
      author: 'Anonymous #B67D',
      content: "Anyone else experiencing water supply issues in the Green Valley area? It's been irregular for the past two days.",
      timestamp: '1 day ago',
      likes: 8,
      replies: 15,
    },
    {
      id: 4,
      author: 'Anonymous #F23A',
      content: 'The new park benches installed at Central Park are already breaking. Poor quality materials used it seems.',
      timestamp: '2 days ago',
      likes: 31,
      replies: 12,
    },
    {
      id: 5,
      author: 'Anonymous #7D19',
      content: 'Just voted on the traffic signal proposal. Hope it passes - that intersection is dangerous!',
      timestamp: '3 days ago',
      likes: 16,
      replies: 5,
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'trending', 'my-posts'

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setIsLoading(true);
    
    // Simulate posting delay
    setTimeout(() => {
      const message = {
        id: messages.length + 1,
        author: 'Anonymous #' + Math.random().toString(16).substring(2, 6).toUpperCase(),
        content: newMessage,
        timestamp: 'Just now',
        likes: 0,
        replies: 0,
      };
      
      setMessages([message, ...messages]);
      setNewMessage('');
      setIsLoading(false);
    }, 1000);
  };

  const handleLike = (id: number) => {
    setMessages(
      messages.map(msg => 
        msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Social Hub header */}
        <div className="px-4 py-6 sm:px-0">
          <div className={`rounded-lg shadow px-5 py-6 sm:px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className={`text-2xl font-bold leading-7 sm:text-3xl sm:truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Social Hub
                </h2>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Anonymous community discussions about civic matters
                </p>
              </div>
              <div className="mt-4 flex items-center md:mt-0 md:ml-4">
                <div className={`inline-flex rounded-md shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`} role="group">
                  <button
                    type="button"
                    onClick={() => setActiveTab('feed')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                      activeTab === 'feed' 
                        ? 'bg-primary text-white' 
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'}`
                    }`}
                  >
                    Feed
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('trending')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'trending' 
                        ? 'bg-primary text-white' 
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'}`
                    }`}
                  >
                    Trending
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('my-posts')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                      activeTab === 'my-posts' 
                        ? 'bg-primary text-white' 
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'}`
                    }`}
                  >
                    My Posts
                  </button>
                </div>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  My Conversations
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post a new message */}
        <div className="px-4 sm:px-0 mt-6">
          <div className={`shadow sm:rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="px-4 py-5 sm:p-6">
              <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Post a Message
              </h3>
              <div className={`mt-2 max-w-xl text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                <p>Share your thoughts or ask questions about civic issues in your area.</p>
              </div>
              <form className="mt-5" onSubmit={handleMessageSubmit}>
                <div className="w-full">
                  <div className="mt-1">
                    <textarea
                      rows={3}
                      name="message"
                      id="message"
                      className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border rounded-md ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                      }`}
                      placeholder="What's on your mind about your community?"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <div className={`text-sm mr-4 flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Your post will be anonymous
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !newMessage.trim()}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                      (isLoading || !newMessage.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Posting...' : 'Post Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Messages feed */}
        <div className="mt-6 px-4 sm:px-0">
          <div className={`shadow sm:rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="px-4 py-5 sm:px-6">
              <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeTab === 'feed' && 'Community Discussions'}
                {activeTab === 'trending' && 'Trending Topics'}
                {activeTab === 'my-posts' && 'My Posts'}
              </h3>
              <p className={`mt-1 max-w-2xl text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {activeTab === 'feed' && 'Recent messages from community members'}
                {activeTab === 'trending' && 'Popular discussions in your community'}
                {activeTab === 'my-posts' && 'Posts you have created'}
              </p>
            </div>
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <ul role="list" className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {messages.map((message) => (
                  <li key={message.id} className="px-4 py-4 sm:px-6 transition-all duration-150 hover:bg-opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary">
                        {message.author}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                    <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <p>{message.content}</p>
                    </div>
                    <div className="mt-2 flex space-x-4">
                      <button 
                        onClick={() => handleLike(message.id)}
                        className={`text-sm flex items-center ${isDarkMode ? 'text-gray-300 hover:text-primary' : 'text-gray-500 hover:text-primary'} transition-colors duration-150`}
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {message.likes} Likes
                      </button>
                      <button className={`text-sm flex items-center ${isDarkMode ? 'text-gray-300 hover:text-primary' : 'text-gray-500 hover:text-primary'} transition-colors duration-150`}>
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {message.replies} Replies
                      </button>
                      <button className={`text-sm flex items-center ${isDarkMode ? 'text-gray-300 hover:text-primary' : 'text-gray-500 hover:text-primary'} transition-colors duration-150`}>
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </button>
                      <button className={`text-sm flex items-center ${isDarkMode ? 'text-gray-300 hover:text-primary' : 'text-gray-500 hover:text-primary'} transition-colors duration-150`}>
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        Report
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`border-t px-4 py-4 sm:px-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-center">
                <button className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}>
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 