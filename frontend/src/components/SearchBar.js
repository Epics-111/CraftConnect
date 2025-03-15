import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const suggestionRef = useRef(null);

  const popularServices = ['Plumbing', 'Electrician', 'House Cleaning', 'Babysitting', 'Painting'];

  useEffect(() => {
    if (query.trim()) {
      const filtered = popularServices.filter(service => 
        service.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search/${query}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    navigate(`/search/${suggestion}`);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

return (
    <div className="search-container relative w-full max-w-4xl mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
        <div className="flex items-center">
            <input
                type="text"
                placeholder="Search for services..."
                className="search-input w-full flex-grow mr-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn flex items-center justify-center whitespace-nowrap" onClick={handleSearch}>
                <FaSearch className="mr-2" /> Search
            </button>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
            <div 
                ref={suggestionRef}
                className="suggestions-dropdown absolute left-0 right-0 bg-white mt-2 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
            >
                {suggestions.map((suggestion, index) => (
                    <div 
                        key={index} 
                        className="suggestion-item p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        <FaSearch className="inline mr-2 text-gray-400" /> 
                        {suggestion}
                    </div>
                ))}
            </div>
        )}
    </div>
);
};

export default SearchBar;