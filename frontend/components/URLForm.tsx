'use client'
import React, {  useState } from 'react'
import axios from "@/utils/axiosInstance";

export default function URLForm({ onShorten }: { onShorten: (slug: string) => void }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const tries = parseInt(localStorage.getItem("tries") || ""); // Set the initial number of tries
  console.log('Initial tries:', tries)

  console.log('Current tries:', tries);
  const isValidUrl = (input: string) => {
    try {
      new URL(input.trim())
      return true
    } catch {
      return false
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUrl = url.trim()

    if (!isValidUrl(trimmedUrl)) {
      setError('Invalid URL')
      return
    }

    const res = await axios.post('/api/v1/url/shorten', {
      url: trimmedUrl
    })

    if (res.status === 200) {
      const data = await res.data
      onShorten(data.slug)
      setUrl('')
      setError('')


    } else {
      setError('Something went wrong. Try again!')
    }

    if (tries > 0) {
      localStorage.setItem("tries", (tries - 1).toString());
    } else {
      setError('No tries left. Please try again later.')
    }
  }

  // if (triesLeft <= 0) {
  //   setError('No tries left. Please try again later.')
  // }


  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 relative">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter your URL"
        className="border border-purple-500 p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-purple-600"
        required
      />
      {tries === 0 ? (
        <button
          type="button"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded hover:brightness-110 transition-all"
          onClick={() => window.location.href = '/login'}
        >
          Login to continue
        </button>
      ) : (
        <button
          type="submit"
          className="w-full bg-purple-400 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition cursor-pointer"
        >
          ✨ Shorten
        </button>
      )}
      {error && <p className="text-red-500 font-medium">{error}</p>}
    </form>
  )
}
