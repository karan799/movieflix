import { useEffect, useRef,useState } from "react";
import useMovies from "./useMovies";




const average = (arr) =>
arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
 
 
export default function App() {
  console.log("render");
  

  const [query, setQuery] = useState("");
  const [selectedId, setselectedId] = useState("");
  // const [watched, setWatched] = useState([]);

  
  const initialData = JSON.parse(localStorage.getItem('watched') || []);
  const [watched, setWatched] = useState(initialData);
  
  


  function handleClick(id){
      if(selectedId===id)
      setselectedId(null);
      else
      {setselectedId(id);
      
      }
      console.log(`click${id}`);
  }

  function handleCloseMovie(){
    console.log("close");
    setselectedId(null);
    
}
const {loading,errorr,movies}=useMovies(query,handleCloseMovie);

function handleAddWatched(movie){
  setWatched((watched)=>[...watched,movie])

  // localStorage.setItem("watched",JSON.stringify([...watched,movie]));
}

function handleDleteWatched(id){
  setWatched(
     (watched)=>{
      return watched.filter((movie)=>movie.imdbID!==id)
    }
  )
}

useEffect(function(){
  localStorage.setItem("watched",JSON.stringify(watched));
}
,[watched])
   




  return (
    <>
       <Navbar >
       
        <Search query={query} setQuery={setQuery}/>
        <Results movies={movies}/>
       </Navbar>
       <main className="main">
         <Box>
          {(loading && <Loader/>)||(errorr && <Errorr err={errorr} />)}
          {!errorr &&!loading&&<Movie movies={movies} handleClick={handleClick} />}
          
         </Box>
         <Box>
          {selectedId?<SelectedMovie id={selectedId}  handleAddWatched={ handleAddWatched}handleCloseMovie={handleCloseMovie} />:<><Watched  watched={watched} />
          <List watched={watched}  handleDleteWatched={ handleDleteWatched} /></>}
         </Box>
        </main>
        
    </>
  );
}
function Navbar({children}){
  
  
  return (
    <nav className="nav-bar">
      <Logo/>
       {children}
        
        
      </nav>
  )
}
function Logo(){
  return(
  <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcornnn</h1>
</div>)
}

function Search({query,setQuery}){

  const inputEl = useRef(null);

  useEffect(function(){
    function callback(e){
      if(document.activeElement===inputEl.current)
      return;

      if(e.code==='Enter')
      inputEl.current.focus();
      setQuery('')
    }
    document.addEventListener('keydown',callback)
    return ()=>document.removeEventListener('keydown',callback);
    

  },[setQuery])
 
  return (
    <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputEl}
        />
  )
}

function Results({movies})
{
  return(
    <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
  )
}

function Box({children}){
  const [isOpen1, setIsOpen1] = useState(true);
  return(
    
        <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen1((open) => !open)}
          >
            {isOpen1 ? "–" : "+"}
          </button>
          {isOpen1 && 
            children
          }
        </div>
  )
}

function Errorr({err}){
  return(
    <p className="loader">{err}</p>
  )
}

function Loader(){
  return(
    <p className="loader">loading...</p>
  )
}

function Movie({movies,handleClick}){
  console.log(movies[0].imdbID);
  return(
    <ul className="list list-movies">
              {movies?.map((movie) => (
                <li key={movie.imdbID} onClick={()=>handleClick(movie.imdbID)}>
                  <img src={movie.Poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓</span>
                      <span>{movie.Year}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
  )
}

function SelectedMovie({id ,handleCloseMovie,handleAddWatched}){
  const [dataa,setdataa]=useState({})
  const {
    Title:title,
    Year:year,
     Rated: rated,
      Released: released,
      imdbID,
       Runtime: runtime,
       Plot: plot ,
       Poster: poster,
       imdbRating,
       Genre:genre,
       Director:director,
       Actors:actors

  }=dataa

  function handleAdd(){

    const movie={
      Title:title,
    Year:year,
     Rated: rated,
     imdbID,
      Released: released,
       runtime:Number(runtime.split(" ".at(0))[0]) ,
       Plot: plot ,
       Poster: poster,
       imdbRating,
       Genre:genre,
       Director:director,
       Actors:actors
      
    }
    console.log(movie);

    handleAddWatched(movie)
    handleCloseMovie()
    

  }
  useEffect(() => {
    return () => {

      const controller=new AbortController();
      async function  fetchMovie({id}){ 
        try{
          console.log(id);
       const res=await fetch(`http://www.omdbapi.com/?apikey=dc795fd6&i=${id}`
       ,{signal:controller.signal});
       console.log(res);
    
       if(!res.ok) throw new Error("could not fetch");
       
    
       const data=await res.json();
       setdataa(data);
       console.log(data);
       console.log(dataa.Title);
    
       if(data.Response==='False')
       throw new Error(data.Error);
        }
    
         catch(err){
             console.log(err.message);
            
         }
        }fetchMovie({id});
        return function(){
          controller.abort();
        }
     
    };
     
  }, [id,dataa.Title]);
  
  useEffect(
    ()=>{
      if(!dataa.Title)
      return;
     
      document.title=dataa.Title;

      return function(){
        document.title='usePopcorn'
      }
    },[dataa.Title]
  )


  return(
    <>
    <div className="details">
    <header>
    <button className="btn-back" onClick={handleCloseMovie}>&larr;</button>
    <img src={poster} alt="alt"/>
    <div className="details-overview">
      <h2>{title}</h2>
      <p>{released}&bull;{runtime}</p>
      <p>{genre}</p>
      <p>{imdbRating}</p>
    </div>
   
    </header>
    <section>
      <div>
        <button className="btn-add" onClick={handleAdd}>add to watched</button>
      </div>
      <p>{plot}</p>
      <p> starring: {actors} </p>
      <p> director: {director}</p>
    </section>
    </div>
   </>
  );
}

function Watched({watched} ){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  
  return(

    <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
  )
}
function List({watched, handleDleteWatched}){
  return (
    watched.len!==0?
    <ul className="list">
                {watched.map((movie) => (
                  <li key={movie.imdbID}>
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>
                      <button onClick={ ()=>handleDleteWatched(movie.imdbID)}>X</button>
                    </div>
                  </li>
                ))}
              </ul>:<></>
  )
}

