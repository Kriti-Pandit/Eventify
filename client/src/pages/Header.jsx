import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { RxExit } from 'react-icons/rx';
import { BsFillCaretDownFill } from 'react-icons/bs';

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef();

  // Fetch events from the server
  useEffect(() => {
    axios.get("/events").then((response) => {
      setEvents(response.data);
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, []);

  // Search bar functionality
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setSearchQuery("");
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []); 
  
  // Logout Function
  async function logout() {
    await axios.post('/logout');
    setUser(null);
  }

  // Search input
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="bg-[#00004B]">
      <header className='flex py-2 px-6 sm:px-6 justify-between place-items-center bg-[#00004B] border-b border-cyan-500/20'>
          
          <Link to={'/'} className="flex item-center">
            <img src="../src/assets/logo.png" alt="" className='w-26 h-9'/>
          </Link>
          
          <div className='flex bg-[#000033] rounded py-2.5 px-4 w-1/3 gap-4 items-center shadow-md shadow-cyan-500/10 border border-cyan-500/20'>
            <button className="text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <div ref={searchInputRef}>
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery} 
                onChange={handleSearchInputChange} 
                className='text-sm text-cyan-200 bg-transparent outline-none w-full placeholder-cyan-400/70'
              />
            </div>     
          </div> 

          {/* Search Results */}
          {searchQuery && (
          <div className="p-2 w-144 z-10 absolute rounded left-[28.5%] top-14 md:w-[315px] md:left-[17%] md:top-16 lg:w-[540px] lg:left-[12%] lg:top-16 bg-[#000033] border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            {events
              .filter((event) =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((event) => (
                <div key={event._id} className="p-2 hover:bg-[#00004B] rounded">
                  <Link to={"/event/" + event._id}>
                      <div className="text-cyan-300 text-lg w-full hover:text-cyan-400">{event.title}</div>
                  </Link>
                </div>
              ))}
          </div>
          )}
    
          
          <Link to={'/createEvent'}>
            <div className='hidden md:flex flex-col place-items-center py-1 px-2 rounded text-cyan-400 cursor-pointer hover:text-cyan-300 hover:bg-[#000033] hover:shadow-sm shadow-cyan-500/10 transition-all duration-300'>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 stroke-3 py-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              <div className='font-bold text-sm'>Create Event</div>
            </div>  
          </Link>

          <div className='hidden lg:flex gap-5 text-sm'>
            {/* My Tickets Link */}
            <Link to={'/tickets'}>
              <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer text-cyan-400 hover:text-cyan-300 hover:bg-[#000033] hover:shadow-sm shadow-cyan-500/10 transition-all duration-300'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 py-1">
                  <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-.375.65 2.249 2.249 0 000 3.898.75.75 0 01.375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 17.625v-3.026a.75.75 0 01.374-.65 2.249 2.249 0 000-3.898.75.75 0 01-.374-.65V6.375zm15-1.125a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm-.75 3a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zM5.25 6.75a.75.75 0 00-.75.75v.75a.75.75 0 001.5 0V7.5A.75.75 0 005.25 6.75zm-.75 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.018 1.5H5.25a.75.75 0 01-.75-.75zm1.5 3a.75.75 0 00-.75.75v.75a.75.75 0 001.5 0v-.75a.75.75 0 00-.75-.75zm-.75 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.018 1.5H5.25a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
                <div>My Tickets</div>
              </div>
            </Link>

            {/* Calendar Link */}
            <Link to={'/calendar'}>
              <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer text-cyan-400 hover:text-cyan-300 hover:bg-[#000033] hover:shadow-sm shadow-cyan-500/10 transition-all duration-300'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 py-1">
                  <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                </svg>
                <div>Calendar</div>
              </div>
            </Link>
          </div>
          
          <div>
            <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer text-cyan-400 hover:text-cyan-300 hover:bg-[#000033] hover:shadow-sm shadow-cyan-500/10 transition-all duration-300'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 py-1">
                <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

        {/* User Logged In */}
        {!!user &&(
          <div className="flex flex-row items-center gap-2 sm:gap-8 ">
            <div className="flex items-center gap-2 text-cyan-400">
              <Link to={'/useraccount'}>
                {user.name.toUpperCase()}
              </Link>
              
              <BsFillCaretDownFill 
                className="h-5 w-5 cursor-pointer text-cyan-400 hover:text-cyan-300 transition-all" 
                onClick={() => setisMenuOpen(!isMenuOpen)}
              />
            </div>
            <div className="hidden md:flex">
              <button 
                onClick={logout} 
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
              >
                <div>Log out</div>
                <RxExit className="text-cyan-400"/>
              </button>
            </div>
          </div>  
        )}

        {/* User Not Logged In */}
        {!user &&(
          <div>
            <Link to={'/login'}>
              <button className="px-4 py-2 bg-cyan-500 text-[#00004B] rounded-lg font-bold hover:bg-cyan-400 transition-colors">
                <div>Sign in</div>
              </button>
            </Link>
          </div>
        )}
          
          {/* Mobile Menu */}
          {!!user &&(
            <div className={`absolute z-10 mt-64 flex flex-col w-48 bg-[#000033] right-2 md:right-[160px] rounded-lg shadow-lg border border-cyan-500/20 ${isMenuOpen ? 'block' : 'hidden'}`}>
              <nav>
                <div className="flex flex-col font-semibold text-[16px] text-cyan-400">
                  <Link className="flex hover:bg-[#00004B] hover:text-cyan-300 py-2 pt-3 pl-6 pr-8 rounded-lg" to={'/createEvent'}>
                    Create Event
                  </Link>
                  
                  <Link className="flex hover:bg-[#00004B] hover:text-cyan-300 py-2 pl-6 pr-8 rounded-lg" to={'/tickets'}>
                    My Tickets
                  </Link>

                  <Link className="flex hover:bg-[#00004B] hover:text-cyan-300 py-2 pl-6 pr-8 rounded-lg" to={'/calendar'}>
                    Calendar
                  </Link>

                  <Link className="flex hover:bg-[#00004B] hover:text-cyan-300 py-2 pl-6 pb-3 pr-8 rounded-lg" onClick={logout}>
                    Log out
                  </Link>
                </div>
              </nav>
            </div>
        )}
      </header>
    </div>
  );
}