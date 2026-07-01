import React from 'react'

const Rate = ({rate, defaultUnit = 'KWH'}) => {
  const {unitPrice, measureUnit, volume} = rate
  return (
    <li className="text-xs text-slate-300 mb-1">
      <div className="bg-slate-700/20 p-1 rounded">
        1{measureUnit || defaultUnit}:
        <span className="text-slate-100 font-medium"> ${unitPrice} (exclusive of GST)</span>
        {volume && (
          <span className="text-slate-400"> - up to: {volume}{measureUnit || defaultUnit}</span>
        )}
      </div>
    </li>
  )
}

export default Rate
