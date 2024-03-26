import { useEffect, useState } from "react";
import { Nav, Search, SearchCount } from "./Nav";
import StarRating from "./StarRating";
import { MovieList } from "./Movies";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "122eefd";
const initQuery = "";

export default function App() {
  const [query, setQuery] = useState(initQuery);
  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState(null); //"tt0102690"
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const movieCount = movies.length;

  function handleSelect(id) {
    setSelectedId((c) => (c === id ? null : id));
  }

  function handleDeselect() {
    setSelectedId(null);
  }

  function handleAddWatched(movieToAdd) {
    const isExisting = watched.find((m) => m.imdbID === movieToAdd.imdbID);
    if (!isExisting) {
      setWatched((c) => [...c, movieToAdd]);
    } else alert("Movie already in the list!");
  }

  function handleRemoveWatched(idToRemove) {
    setWatched((c) => c.filter((m) => m.imdbID !== idToRemove));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?&apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong while grabbing movies.");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data?.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handleDeselect();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Nav>
        <Search query={query} onQuery={setQuery} />
        <SearchCount searchCount={movieCount} />
      </Nav>
      <Main>
        <Box>
          {error ? (
            <ErrorMessage message={error} />
          ) : isLoading ? (
            <Loading />
          ) : (
            <MovieList movies={movies} onSelect={handleSelect} />
          )}
        </Box>
        <Box>
          {selectedId && (
            <MovieDetail
              movieId={selectedId}
              onClose={handleDeselect}
              onAddWatched={handleAddWatched}
            />
          )}
          {!selectedId && (
            <>
              <WatchedMovieSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && <>{children}</>}
    </div>
  );
}

function Loading() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🚫</span>
      {message}
    </p>
  );
}

function WatchedMovieList({ watched, onRemoveWatched }) {
  return (
    <ul className="list list-watched">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID}>
          <button
            className="btn-delete"
            onClick={() => onRemoveWatched(movie.imdbID)}
          >
            X
          </button>
        </WatchedMovie>
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, children }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
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
      </div>
      {children}
    </li>
  );
}

function MovieDetail({ movieId, onClose, onAddWatched }) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;

  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          onClose();
          // console.log("Closing");
        }
      }
      document.addEventListener("keydown", callBack);
      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onClose]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: movieId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onClose();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?&apikey=${KEY}&i=${movieId}`
          );

          if (!res.ok) throw new Error("Failed to fetch movie detail data");

          const data = await res.json();
          if (data.Response === "False")
            throw new Error("Unable to fetch movie details");

          setMovieDetails(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [movieId]
  );

  return (
    <>
      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <>
          <div className="details">
            <header>
              <button className="btn-back" onClick={onClose}>
                &larr;
              </button>

              <img src={poster} alt={title} />
              <div className="details-overview">
                <h2>
                  {title} ({year})
                </h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  IMBD Rating
                  <span>⭐</span>
                  {imdbRating}
                </p>
              </div>
            </header>

            <section>
              <div className="rating">
                <StarRating
                  onSetRating={setUserRating}
                  size={24}
                  maxRating={10}
                />
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    Add to List
                  </button>
                )}
              </div>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring: {actors}</p>
              <p>Director: {director}</p>
            </section>
          </div>
        </>
      )}
    </>
  );
}

function WatchedMovieSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
