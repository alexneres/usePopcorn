import { useEffect, useState } from 'react'

const APIKEY = "15b09322"

console.log(APIKEY)

export default function useMovies(query) {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(
    function () {

      const controller = new AbortController()

      async function fetchMovies() {
        try {
          setIsLoading(true)
          setError('')

          const URL = `http://www.omdbapi.com/?i=tt3896198&apikey=${APIKEY}&S=${query}`
          const res = await fetch(URL, { signal: controller.signal })

          if (!res.ok) throw Error('Something went wrong')

          const data = await res.json()

          if (data.Response === 'False') throw Error('Movie not found')

          setMovies(data.Search)
          setError('')
        } catch (error) {
          if (error.name !== 'AbortError') setError(error.message)
          console.log(error.message)
        } finally {
          setIsLoading(false)
        }
      }
      if (query.length < 3) {
        setMovies([])
        setError('')
        return
      }

      fetchMovies()

      return function () {
        controller.abort()
      }
    },
    [query]
  )

  return { movies, isLoading, error }
}
