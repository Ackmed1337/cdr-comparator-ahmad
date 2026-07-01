import React from 'react'

function CardArt(props) {
  const {cardArt} = props
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-purple-500 mb-1">
      {!!cardArt.title && <div className="text-xs font-semibold text-slate-400 mb-2">{cardArt.title}</div>}
      <div>
        <a
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          href={cardArt.imageUri}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={cardArt.imageUri}
            alt="Card art"
            className="w-24 h-24 object-contain flex-shrink-0"
          />
          <span className="text-xs text-slate-400 break-all">{cardArt.imageUri}</span>
        </a>
      </div>
    </li>
  )
}

export default React.memo(CardArt)