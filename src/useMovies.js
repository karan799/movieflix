import { useState,useEffect } from "react";
export default function useMovies(query,callback){

    const [movies, setMovies] = useState([]);
  
    const [loading,setloading]=useState(true)
    const [errorr, seterrorr] = useState(false);


    useEffect(function(){
        callback?.();
        
        async function  fetchMovies (){ 
         try{
          seterrorr(false);
          if(!query)
          {
            throw new Error("type somethig");
          }

          setloading(true);
        const res=await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=dc795fd6&s=${query}`);
        console.log(res);
    
        if(!res.ok) throw new Error("could not fetch");
        
    
        const data=await res.json();
        console.log(data);
    
        if(data.Response==='False')
        throw new Error(data.Error);
    
    
    
    
        setMovies(data.Search);
          console.log(data.Search);
          
        }
    
          catch(err){
              console.log(err.message);
              console.log(seterrorr(err.message));
          }
    
          finally{
            setloading(false);
            
    
          }
        }
        fetchMovies();
    
      },[query])

      return {loading,errorr,movies}

      
}