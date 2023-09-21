import React, { useEffect, useRef, useState } from 'react'
import StarRating from './StarRating'
import Loader from './Loader'
import useKey from '../hooks/useKey'

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched
}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')

  const countRef = useRef(0)

  useEffect(
    function () {
      if (userRating) countRef.current++
    },
    [userRating]
  )

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating

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
    Genre: genre
  } = movie

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating,
      runtime: Number(runtime.split(' ').at(0)),
      countRaitingDecisions: countRef.current
    }

    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  useKey('Escape', onCloseMovie)

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true)
        const APIKEY = '15b09322'
        const URL = `http://www.omdbapi.com/?apikey=${APIKEY}&i=${selectedId}`
        const res = await fetch(URL)
        const data = await res.json()
        setMovie(data)
        setIsLoading(false)
      }

      getMovieDetails()
    },
    [selectedId]
  )

  useEffect(
    function () {
      if (!title) return
      document.title = `Selected: ${title}`

      return function () {
        document.title = 'usePopcorn'
      }
    },
    [title]
  )


  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <p>
              <div className="rating">
                {!isWatched ? (
                  <>
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button className="btn-add" onClick={handleAdd}>
                        Add to List
                      </button>
                    )}
                  </>
                ) : (
                  <p>You rated this movie {watchedUserRating} </p>
                )}
              </div>
              <em>{plot}</em>
              <p>Staring {actors}</p>
              <p>Directed by {director}</p>
            </p>
          </section>
        </>
      )}
    </div>
  )
}
