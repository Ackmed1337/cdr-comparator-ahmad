import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import { connect } from 'react-redux'
import moment from 'moment'
import { cleanConout } from '../../store/conout/actions'
import _ from 'lodash'

const ConsolePanel = (props) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-4 border-blue-500 transition-all duration-200"
      >
        <span style={{ fontSize: 16 }} className="text-slate-500 dark:text-slate-400">{'>'}_</span>
        <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Console</span>
        {props.conout.actions.length > 0 && (
          <span className="ml-2 px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-full">
            {props.conout.actions.length}
          </span>
        )}
        <svg
          className={`ml-auto w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isExpanded && (
        <div className="transition-all duration-300">
          <div className="max-h-72 overflow-y-auto bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-700 p-4 font-mono text-xs text-slate-600 dark:text-slate-400" style={{ fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace", lineHeight: 1.8 }}>
            {props.conout.actions.length === 0 && (
              <span className="text-slate-400 dark:text-slate-500">No output yet. Load some data sources to see API calls.</span>
            )}
            {props.conout.actions.slice(-100).map((msg, i) => (
              <div key={i} className="flex gap-3 border-b border-slate-200 dark:border-slate-800 py-1 last:border-b-0">
                <span className="text-slate-400 dark:text-slate-600 flex-shrink-0">{moment(msg.timestamp).format('HH:mm:ss.SSS')}</span>
                <div className="flex-1">
                  {msg.payload.html
                    ? <span className={msg.payload.lvl === 'error' ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'} dangerouslySetInnerHTML={{ __html: msg.payload.html }} />
                    : <span className={msg.payload.lvl === 'error' ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}>{msg.payload.txt}</span>
                  }
                  {msg.payload.obj && <TreeView data={msg.payload.obj} />}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 flex justify-end">
            <button
              onClick={props.cleanConout}
              title="Clear console"
              aria-label="Clear console"
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              <DeleteIcon style={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const TreeView = ({ data, toggled = false, name = null, isLast = true, isChildElement = false, isParentToggled = true }) => {
  const [isToggled, setIsToggled] = React.useState(toggled)
  const isArray = data && Array.isArray(data)
  const plain = !data || (!isArray && (data instanceof Error || typeof data !== 'object'))

  return (
    <div className={`tree-element${isParentToggled ? '' : ' collapsed'} ${isChildElement || isToggled ? 'child' : 'parent'}`}>
      {!_.isEmpty(data) && (
        <>
          <span
            className={`tree-toggler${isToggled ? ' open' : ''}${plain ? ' collapsed' : ''}`}
            onClick={() => setIsToggled(!isToggled)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setIsToggled(!isToggled))}
            role="button"
            tabIndex={0}
            aria-expanded={isToggled}
            aria-label={isToggled ? 'Collapse node' : 'Expand node'}
          />
          <>&nbsp;&nbsp;</>
        </>
      )}
      {name && <strong style={{ color: '#60a5fa' }}>{name}: </strong>}
      {plain
        ? (data ? String(data) : data === null ? 'null' : data)
        : (
          <>
            {isArray ? '[' : '{'}
            {!isToggled && !_.isEmpty(data) && '...'}
            {Object.keys(data).map((v, i, a) =>
              typeof data[v] === 'object'
                ? <TreeView key={`${name}-${v}-${i}`} data={data[v]} isLast={i === a.length - 1} name={isArray ? null : v} isChildElement isParentToggled={isParentToggled && isToggled} />
                : <p key={`${name}-${v}-${i}`} className={`tree-element${isToggled ? '' : ' collapsed'}`}>
                    {!isArray && <strong style={{ color: '#60a5fa' }}>{v}: </strong>}
                    <Print val={data[v]} />
                    {i !== a.length - 1 ? ',' : ''}
                  </p>
            )}
            {isArray ? ']' : '}'}
          </>
        )
      }
      {!isLast ? ',' : ''}
    </div>
  )
}

const Print = ({ val }) => {
  const q = typeof val === 'string' ? '"' : ''
  const color = typeof val === 'string' ? '#4ade80' : typeof val === 'number' ? '#fbbf24' : '#ef4444'
  return <span style={{ color }}>{q + val + q}</span>
}

const mapStateToProps = state => ({ conout: state.conout })

export default connect(mapStateToProps, { cleanConout })(ConsolePanel)
