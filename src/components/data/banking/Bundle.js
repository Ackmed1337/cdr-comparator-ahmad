import React from 'react'

const Bundle = (props) => {
  const {bundle} = props
  return (
    <li className="bg-slate-100/30 dark:bg-slate-800/30 p-2 rounded border-l-2 border-pink-500 mb-1">
      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{bundle.name}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{bundle.description}</div>
      {!!bundle.additionalInfo && <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{bundle.additionalInfo}</div>}
      {!!bundle.additionalInfoUri && <div className="mt-1"><a href={bundle.additionalInfoUri} target='_blank' rel='noopener noreferrer' className="text-xs text-pink-400 hover:text-pink-300 transition-colors">More info</a></div>}
    </li>
  )
}

export default React.memo(Bundle)
