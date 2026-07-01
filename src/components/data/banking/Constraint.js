import React from 'react'
import {translateConstraintType} from '../../../utils/dict'

const formatAdditionalValue = (constraintType, additionalValue) => {
  if (!additionalValue && additionalValue !== 0) {
    return ''
  }

  const value = additionalValue;

  switch (constraintType) {
    case 'MAX_BALANCE':
    case 'MAX_LIMIT':
    case 'MIN_BALANCE':
    case 'MIN_LIMIT':
    case 'OPENING_BALANCE':
      return `$${value}`
    case 'MIN_LVR':
    case 'MAX_LVR':
      const parsedValue = Number(value)

      if (!Number.isNaN(parsedValue)) {
        const percentageValue = (parsedValue * 100)
          .toFixed(2)
          .replace(/\.0+$/, '')
          .replace(/(\.\d*?)0+$/, '$1')
        return `${percentageValue}%`
      }

      return value
    default:
      return value
  }
}

const Constraint = (props) => {
  const {constraintType, additionalInfo, additionalValue, additionalInfoUri} = props.constraint
  const formattedAdditionalValue = formatAdditionalValue(constraintType, additionalValue)
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-indigo-500 mb-1">
      <div className="text-xs font-semibold text-slate-300">
        {translateConstraintType(constraintType)}
        {!!formattedAdditionalValue && <span className="text-slate-400"> - {formattedAdditionalValue}</span>}
      </div>
      {!!additionalInfo && <div className="text-xs text-slate-400 mt-1">{additionalInfo}</div>}
      {!!additionalInfoUri && <div className="mt-1"><a href={additionalInfoUri} target='_blank' rel='noopener noreferrer' className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">More info</a></div>}
    </li>
  )
}

export default React.memo(Constraint)
