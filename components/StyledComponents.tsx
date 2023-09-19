// components/StyledComponents.js
import React from 'react'

export const StyleBlueBold = ({ children }) => (
  <span className="font-bold text-blue-600">{children}</span>
)

export const StyleImportant = ({ children }) => (
  <span className="font-semibold bg-yellow-100">{children}</span>
)

export const StyleUnderline = ({ children }) => (
  <span className="font-bold underline">{children}</span>
)

export const StyleWarning = ({ children }) => (
  <span className="font-bold text-red-600">{children}</span>
)
