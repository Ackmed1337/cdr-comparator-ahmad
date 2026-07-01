import React from 'react'

const IntrinsicGreenPower = ({intrinsicGreenPower}) => {
  const {greenPercentage} = intrinsicGreenPower
  return (
    <div className="bg-slate-800/30 p-2 rounded border-l-2 border-teal-500 mb-1">
      <div className="text-sm text-slate-200">Green Percentage: <span className="text-slate-100 font-medium">{(greenPercentage * 100).toFixed(2)}%</span></div>
    </div>
  )
}

export default IntrinsicGreenPower
