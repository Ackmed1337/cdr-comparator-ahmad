import React from 'react'
import DateTime from '../DateTime'
import Duration from '../Duration'
import { connect } from 'react-redux'
import { translateDiscoveryStatus } from '../../../utils/dict'

const STATUS = {
  OK:               { bg: '#dcfce7', text: '#166534', dot: '#16a34a' },
  PARTIAL_FAILURE:  { bg: '#fef3c7', text: '#92400e', dot: '#d97706' },
  SCHEDULED_OUTAGE: { bg: '#dbeafe', text: '#1e40af', dot: '#2563eb' },
  UNAVAILABLE:      { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
}

const StatusBadge = ({ status }) => {
  const c = STATUS[status] || { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: c.bg,
      color: c.text,
      fontSize: '0.78rem',
      fontWeight: 600,
      padding: '3px 12px',
      borderRadius: 20,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {translateDiscoveryStatus(status)}
    </span>
  )
}

const row = { fontSize: '0.82rem', color: '#374151', marginBottom: 3 }
const lbl = { color: '#9ca3af', fontWeight: 500, marginRight: 4 }

const StatusOutages = ({ statusDetails, outagesDetails }) => (
  <div style={{ paddingTop: 4 }}>
    {statusDetails && (
      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <StatusBadge status={statusDetails.status} />
        </div>
        {statusDetails.explanation && <div style={row}><span style={lbl}>Note:</span>{statusDetails.explanation}</div>}
        {statusDetails.detectionTime && <div style={row}><span style={lbl}>Detected:</span><DateTime rfc3339={statusDetails.detectionTime} /></div>}
        {statusDetails.expectedResolutionTime && <div style={row}><span style={lbl}>Expected resolution:</span><DateTime rfc3339={statusDetails.expectedResolutionTime} /></div>}
        {statusDetails.updateTime && <div style={row}><span style={lbl}>Updated:</span><DateTime rfc3339={statusDetails.updateTime} /></div>}
      </div>
    )}
    {outagesDetails?.outages?.length > 0 && (
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
          Scheduled Outages ({outagesDetails.outages.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {outagesDetails.outages.map((outage, i) => (
            <div key={i} style={{ background: '#fef3c7', borderLeft: '3px solid #d97706', borderRadius: '0 6px 6px 0', padding: '8px 12px', fontSize: '0.8rem' }}>
              <div style={row}><span style={lbl}>Time:</span><DateTime rfc3339={outage.outageTime} /></div>
              {outage.duration && <div style={row}><span style={lbl}>Duration:</span><Duration value={outage.duration} alwaysShowNumber /></div>}
              {outage.isPartial && <div style={row}><span style={lbl}>Type:</span>Partial outage</div>}
              {outage.explanation && <div style={{ ...row, fontStyle: 'italic', color: '#92400e' }}>"{outage.explanation}"</div>}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

export default connect()(StatusOutages)
