import React from 'react'
import { Terminal, Trash2, ChevronDown } from 'lucide-react'
import { connect } from 'react-redux'
import moment from 'moment'
import { cleanConout } from '../../store/conout/actions'
import _ from 'lodash'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

const ConsolePanel = (props) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <Card>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 border-l-4 border-primary transition-all duration-200"
      >
        <Terminal className="w-4 h-4 text-muted-foreground" />
        <span className="font-semibold text-sm text-foreground/90">Console</span>
        {props.conout.actions.length > 0 && <Badge>{props.conout.actions.length}</Badge>}
        <ChevronDown className={cn('ml-auto w-5 h-5 text-muted-foreground transition-transform duration-300', isExpanded && 'rotate-180')} />
      </button>

      {isExpanded && (
        <div className="transition-all duration-300">
          <div className="max-h-72 overflow-y-auto bg-muted/30 border-t border-border p-4 font-mono text-xs text-muted-foreground" style={{ fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace", lineHeight: 1.8 }}>
            {props.conout.actions.length === 0 && (
              <span className="text-muted-foreground/70">No output yet. Load some data sources to see API calls.</span>
            )}
            {props.conout.actions.slice(-100).map((msg, i) => (
              <div key={i} className="flex gap-3 border-b border-border/60 py-1 last:border-b-0">
                <span className="text-muted-foreground/60 flex-shrink-0">{moment(msg.timestamp).format('HH:mm:ss.SSS')}</span>
                <div className="flex-1">
                  {msg.payload.html
                    ? <span className={msg.payload.lvl === 'error' ? 'text-destructive' : 'text-muted-foreground'} dangerouslySetInnerHTML={{ __html: msg.payload.html }} />
                    : <span className={msg.payload.lvl === 'error' ? 'text-destructive' : 'text-muted-foreground'}>{msg.payload.txt}</span>
                  }
                  {msg.payload.obj && <TreeView data={msg.payload.obj} />}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3 flex justify-end">
            <Button
              onClick={props.cleanConout}
              size="icon"
              title="Clear console"
              aria-label="Clear console"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
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
