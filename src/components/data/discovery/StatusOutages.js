import React from 'react'
import DateTime from '../DateTime'
import Duration from '../Duration'
import { connect } from 'react-redux'
import { translateDiscoveryStatus } from '../../../utils/dict'

const STATUS = {
  OK:               'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  PARTIAL_FAILURE:  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  SCHEDULED_OUTAGE: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  UNAVAILABLE:      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

const DOT = {
  OK: 'bg-green-500',
  PARTIAL_FAILURE: 'bg-amber-500',
  SCHEDULED_OUTAGE: 'bg-blue-500',
  UNAVAILABLE: 'bg-red-500',
}

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${STATUS[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT[status] || 'bg-slate-400'}`} />
    {translateDiscoveryStatus(status)}
  </span>
)

const row = 'text-sm text-slate-700 dark:text-slate-300 mb-1'
const lbl = 'text-slate-400 dark:text-slate-500 font-medium mr-1'

const StatusOutages = ({ statusDetails, outagesDetails }) => (
  <div className="pt-1">
    {statusDetails && (
      <div className="mb-3">
        <div className="mb-2">
          <StatusBadge status={statusDetails.status} />
        </div>
        {statusDetails.explanation && <div className={row}><span className={lbl}>Note:</span>{statusDetails.explanation}</div>}
        {statusDetails.detectionTime && <div className={row}><span className={lbl}>Detected:</span><DateTime rfc3339={statusDetails.detectionTime} /></div>}
        {statusDetails.expectedResolutionTime && <div className={row}><span className={lbl}>Expected resolution:</span><DateTime rfc3339={statusDetails.expectedResolutionTime} /></div>}
        {statusDetails.updateTime && <div className={row}><span className={lbl}>Updated:</span><DateTime rfc3339={statusDetails.updateTime} /></div>}
      </div>
    )}
    {outagesDetails?.outages?.length > 0 && (
      <div>
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-1.5">
          Scheduled Outages ({outagesDetails.outages.length})
        </div>
        <div className="flex flex-col gap-2">
          {outagesDetails.outages.map((outage, i) => (
            <div key={i} className="bg-amber-100 dark:bg-amber-900/20 border-l-2 border-amber-500 rounded-r-md px-3 py-2 text-sm">
              {outage.outageTime && <div className={row}><span className={lbl}>Time:</span><DateTime rfc3339={outage.outageTime} /></div>}
              {outage.duration && <div className={row}><span className={lbl}>Duration:</span><Duration value={outage.duration} alwaysShowNumber /></div>}
              {outage.isPartial && <div className={row}><span className={lbl}>Type:</span>Partial outage</div>}
              {outage.explanation && <div className="text-sm italic text-amber-800 dark:text-amber-300 mb-1">"{outage.explanation}"</div>}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

export default connect()(StatusOutages)
