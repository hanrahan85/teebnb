import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { MapPin, Calendar as CalendarIcon, Users, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const QUICK_DESTINATIONS = [
  'St Andrews',
  'Algarve',
  'Marbella',
  'Gleneagles',
  'Pebble Beach',
];

const ALL_SUGGESTIONS = [
  // Ireland
  'Portmarnock, Dublin, Ireland',
  'The K Club, Kildare, Ireland',
  'Druids Glen, Wicklow, Ireland',
  'Ballybunion, Kerry, Ireland',
  'Lahinch, Clare, Ireland',
  'Waterville, Kerry, Ireland',
  'Old Head of Kinsale, Cork, Ireland',
  'Adare Manor, Limerick, Ireland',
  'Killarney, Kerry, Ireland',
  'Doonbeg, Clare, Ireland',
  'Tralee, Kerry, Ireland',
  'Powerscourt, Wicklow, Ireland',
  'Mount Juliet, Kilkenny, Ireland',
  'Carton House, Kildare, Ireland',
  'Fota Island, Cork, Ireland',
  'Rathsallagh, Wicklow, Ireland',
  'Rosses Point, Sligo, Ireland',
  'Enniscrone, Sligo, Ireland',
  'Carne, Mayo, Ireland',
  'Connemara, Galway, Ireland',
  'Donegal, Ireland',
  'Dublin, Ireland',
  // Northern Ireland
  'Royal Portrush, Antrim, Northern Ireland',
  'Royal County Down, Down, Northern Ireland',
  'Portstewart, Londonderry, Northern Ireland',
  // Scotland
  'St Andrews, Fife, Scotland',
  'Gleneagles, Perthshire, Scotland',
  'Carnoustie, Angus, Scotland',
  'Turnberry, Ayrshire, Scotland',
  'Muirfield, East Lothian, Scotland',
  'Troon, Ayrshire, Scotland',
  'Kingsbarns, Fife, Scotland',
  'Castle Stuart, Inverness, Scotland',
  'Trump International, Aberdeenshire, Scotland',
  'Loch Lomond, Scotland',
  'Edinburgh, Scotland',
  // England
  'Royal Birkdale, Southport, England',
  'Royal Liverpool (Hoylake), England',
  'Wentworth, Surrey, England',
  'The Belfry, Warwickshire, England',
  'Sunningdale, Berkshire, England',
  'Swinley Forest, Berkshire, England',
  'Rye, East Sussex, England',
  'Sandwich (Royal St George\'s), Kent, England',
  'Woburn, Buckinghamshire, England',
  // Wales
  'Celtic Manor, Newport, Wales',
  'Royal Porthcawl, Glamorgan, Wales',
  // Portugal
  'Algarve, Portugal',
  'Quinta do Lago, Algarve, Portugal',
  'Vale do Lobo, Algarve, Portugal',
  'Vilamoura, Algarve, Portugal',
  'Penha Longa, Sintra, Portugal',
  'Troia, Setubal, Portugal',
  'Oitavos, Cascais, Portugal',
  // Spain
  'Marbella, Andalucia, Spain',
  'Costa del Sol, Spain',
  'Valderrama, Sotogrande, Spain',
  'La Manga Club, Murcia, Spain',
  'PGA Catalunya, Girona, Spain',
  'Mallorca, Spain',
  'Madrid, Spain',
  // USA
  'Pebble Beach, California, USA',
  'Scottsdale, Arizona, USA',
  'Kiawah Island, South Carolina, USA',
  'Augusta, Georgia, USA',
  'Pinehurst, North Carolina, USA',
  'Bandon Dunes, Oregon, USA',
  'Whistling Straits, Wisconsin, USA',
  'Bethpage Black, New York, USA',
  'Torrey Pines, San Diego, USA',
  'TPC Sawgrass, Ponte Vedra, Florida, USA',
  'Hilton Head, South Carolina, USA',
  // Rest of world
  'Dubai, UAE',
  'Cape Town, South Africa',
  'Mauritius',
  'Queenstown, New Zealand',
  'Singapore',
  'Tokyo, Japan',
];

const SearchBar = () => {
  const navigate = useNavigate();
  const [locationInput, setLocationInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const trimmed = locationInput.trim();
  const matched = trimmed.length > 0
    ? ALL_SUGGESTIONS.filter(s => s.toLowerCase().includes(trimmed.toLowerCase()))
    : [];
  // Always show something: matched results + a free-text fallback if no exact match
  const filteredSuggestions = trimmed.length === 0
    ? [] // will show "popular" panel instead
    : matched.length > 0
      ? matched
      : [`Search near "${trimmed}"`]; // fallback so user is never stuck

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckIn(date);
    setCheckInOpen(false);
    // Auto-open check-out picker after selecting check-in
    if (date) {
      setTimeout(() => setCheckOutOpen(true), 150);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    setCheckOut(date);
    setCheckOutOpen(false);
  };

  const handleSearch = () => {
    navigate('/search-results', {
      state: { location: locationInput, checkIn, checkOut, guests },
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocationInput(suggestion);
    setShowSuggestions(false);
  };

  const handleQuickDestination = (dest: string) => {
    setLocationInput(dest);
    navigate('/search-results', { state: { location: dest, checkIn, checkOut, guests } });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main search bar */}
      <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-2 items-stretch md:items-center">

        {/* Location */}
        <div className="flex-1 relative" ref={locationRef}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200">
            <MapPin className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Where</p>
              <input
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSuggestions(false);
                    handleSearch();
                  }
                }}
                placeholder="Golf destination or course..."
                className="w-full border-0 p-0 h-auto text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && (filteredSuggestions.length > 0 || locationInput.trim().length === 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden">
              {/* Empty input: show popular destinations */}
              {locationInput.trim().length === 0 ? (
                <>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Popular destinations</p>
                  {QUICK_DESTINATIONS.map((dest) => (
                    <button
                      key={dest}
                      onMouseDown={() => handleSuggestionClick(dest)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left"
                    >
                      <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">{dest}</span>
                    </button>
                  ))}
                </>
              ) : (
                /* Typing: show matches or free-text fallback */
                filteredSuggestions.slice(0, 8).map((suggestion) => {
                  const isFallback = suggestion.startsWith('Search near');
                  return (
                    <button
                      key={suggestion}
                      onMouseDown={() => {
                        // For free-text fallback, store just what the user typed
                        const value = isFallback ? locationInput.trim() : suggestion;
                        handleSuggestionClick(value);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left"
                    >
                      <MapPin className={`h-4 w-4 flex-shrink-0 ${isFallback ? 'text-neutral-400' : 'text-emerald-500'}`} />
                      <span className={`text-sm ${isFallback ? 'text-neutral-500 italic' : 'text-neutral-700'}`}>
                        {suggestion}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="hidden md:block w-px h-10 bg-neutral-200" />

        {/* Check In */}
        <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200 text-left">
              <CalendarIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Check in</p>
                <p className={cn("text-sm font-medium", checkIn ? "text-neutral-800" : "text-neutral-400")}>
                  {checkIn ? format(checkIn, "d MMM") : "Add date"}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={handleCheckInSelect}
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <div className="hidden md:block w-px h-10 bg-neutral-200" />

        {/* Check Out */}
        <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200 text-left">
              <CalendarIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Check out</p>
                <p className={cn("text-sm font-medium", checkOut ? "text-neutral-800" : "text-neutral-400")}>
                  {checkOut ? format(checkOut, "d MMM") : "Add date"}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={handleCheckOutSelect}
              disabled={(date) => date < (checkIn || new Date())}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <div className="hidden md:block w-px h-10 bg-neutral-200" />

        {/* Guests */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200">
          <Users className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Guests</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="text-neutral-400 hover:text-neutral-600 font-bold text-lg leading-none"
              >
                −
              </button>
              <span className="text-sm font-medium text-neutral-800 w-4 text-center">{guests}</span>
              <button
                onClick={() => setGuests(Math.min(20, guests + 1))}
                className="text-neutral-400 hover:text-neutral-600 font-bold text-lg leading-none"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 font-semibold shrink-0"
        >
          <Search className="h-5 w-5" />
          Search
        </Button>
      </div>

      {/* Quick destination pills */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {QUICK_DESTINATIONS.map((dest) => (
          <button
            key={dest}
            onClick={() => handleQuickDestination(dest)}
            className="px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30 transition-all hover:scale-105"
          >
            {dest}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
