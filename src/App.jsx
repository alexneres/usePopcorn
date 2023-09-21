import { useState } from 'react'
import Navbar from './components/Navbar/NavBar'
import Logo from './components/Navbar/Logo'
import NumResults from './components/Navbar/NumResults'
import Search from './components/Navbar/Search'
import Main from './components/Main'
import Box from './components/Box'
import Loader from './components/Loader'
import MovieList from './components/MovieList'
import ErrorMessage from './components/ErrorMessage'
import MovieDetails from './components/MovieDetails'
import WatchedSummary from './components/WatchedSummary'
import WatchedMoviesList from './components/WatchedMoviesList'
import  useMovies  from './hooks/useMovies'
import  useLocalStorageState  from './hooks/useLocalStorageState'

export default function App() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const { movies, isLoading, error } = useMovies(query)

  const [watched, setWatched] = useLocalStorageState([], 'watched')

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie])

  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }


  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage msg={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}
