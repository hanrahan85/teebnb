import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    navigate('/search-results', {
      state: { location, checkIn, checkOut, guests },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main search bar */}
      <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-2 items-stretch md:items-center">
        {/* Location */}
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200">
          <MapPin className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Where</p>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Golf destination or course..."
              className="border-0 p-0 h-auto text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus-visible:ring-0 bg-transparent"
            />
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-neutral-200" />

        {/* Check In */}
        <Popover>
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
              onSelect={setCheckIn}
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <div className="hidden md:block w-px h-10 bg-neutral-200" />

        {/* Check Out */}
        <Popover>
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
              onSelect={setCheckOut}
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
            onClick={() => {
              setLocation(dest);
              navigate('/search-results', { state: { location: dest, checkIn, checkOut, guests } });
            }}
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
