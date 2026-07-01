import React from 'react'

const ExternalLink = ({link, children}) => (
  <a href={link} target='_blank' rel='noopener noreferrer' className="text-xs text-blue-400 hover:text-blue-300">{children}</a>
)

export default ExternalLink
