import React from 'react'

const Geography = ({geography}) => {
  const {excludedPostcodes, includedPostcodes, distributors} = geography
  return (
    <div className="bg-slate-800/30 p-2 rounded border-l-2 border-cyan-500 mb-1">
      {excludedPostcodes && excludedPostcodes.length > 0 && (
        <div className="text-sm text-slate-200 mb-1">Excluded Postcodes: <span className="text-slate-100">{excludedPostcodes.join(', ')}</span></div>
      )}
      {includedPostcodes && includedPostcodes.length > 0 && (
        <div className="text-sm text-slate-200 mb-1">Included Postcodes: <span className="text-slate-100">{includedPostcodes.join(', ')}</span></div>
      )}
      {distributors && (
      <>
        <div className="text-sm text-slate-200 mb-1">Distributors:</div>
        <ul className="mt-0 mb-0 pl-5 text-sm">
          {distributors.map((distributor, idx) => <li key={idx} className="text-slate-100">{distributor}</li>)}
        </ul>
      </>
      )}
    </div>
  )
}

export default Geography
