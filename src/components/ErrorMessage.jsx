import React from 'react'

export default function ErrorMessage({ msg }) {
  return (
    <p className="error">
      <span>{msg}</span>
    </p>
  )
}
