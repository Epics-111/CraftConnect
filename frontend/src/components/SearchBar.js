import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  // Use useMemo to memoize the popularServices array
  const popularServices = useMemo(() => [
    'Plumbing', 
    'Electrician', 
    'House Cleaning', 
    'Babysitting', 
    'Painting',
    'Gardening',
    'Carpentry',
    'Computer Repair',
    'Pet Care',
    'Moving Service'
  ], []); // Empty dependency array means this will only be created once

  useEffect(() => {
    if (query.trim()) {
      const filtered = popularServices.filter(service => 
        service.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, popularServices]); // popularServices is now memoized, so it won't trigger re-renders

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

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container">
      <div className="search-inner">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for services..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onKeyPress={handleKeyPress}
        />
        <button className="search-btn" onClick={handleSearch}>
          <FaSearch /> <span>Search</span>
        </button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionRef}
          className="suggestions-dropdown"
        >
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <FaSearch className="suggestion-icon" /> 
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;