import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { translateFeatureType } from '../../utils/dict'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 16,
    borderRadius: 6,
    overflow: 'hidden',
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 700,
    marginBottom: 16,
    color: '#1e293b',
  },
  matrix: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.75rem',
  },
  featureName: {
    padding: '8px 12px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#475569',
    backgroundColor: '#f1f5f9',
    borderRight: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    minWidth: 120,
    position: 'sticky',
    left: 0,
    zIndex: 1,
  },
  productName: {
    padding: '8px 12px',
    textAlign: 'center',
    fontWeight: 700,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    minWidth: 100,
  },
  cell: {
    padding: '8px 12px',
    textAlign: 'center',
    borderRight: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    minWidth: 100,
  },
  checkmark: {
    fontSize: '1.2rem',
    color: '#10b981',
    fontWeight: 700,
  },
  cross: {
    fontSize: '1rem',
    color: '#d1d5db',
  },
}))

const FeatureMatrix = ({ products, dataSources }) => {
  const classes = useStyles()

  const allFeatures = useMemo(() => {
    const features = new Map()
    products.forEach(pd => {
      (pd.product.features || []).forEach(f => {
        if (!features.has(f.featureType)) {
          features.set(f.featureType, f.featureType)
        }
      })
    })
    return Array.from(features.keys()).sort()
  }, [products])

  const hasFeature = (product, featureType) => {
    return product.features?.some(f => f.featureType === featureType) ?? false
  }

  if (allFeatures.length === 0) return null

  return (
    <Card className={classes.root}>
      <CardContent style={{ padding: '16px 12px' }}>
        <div className={classes.title}>Feature Matrix</div>
        <div className={classes.matrix}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.featureName}>Feature</th>
                {products.map((pd, idx) => (
                  <th key={idx} className={classes.productName}>
                    {dataSources[pd.dataSourceIdx]?.name && (
                      <div style={{ fontSize: '0.65rem', color: '#6366f1' }}>
                        {dataSources[pd.dataSourceIdx].name}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem' }}>{pd.product.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map(featureType => (
                <tr key={featureType}>
                  <td className={classes.featureName}>
                    {translateFeatureType(featureType)}
                  </td>
                  {products.map((pd, idx) => (
                    <td
                      key={idx}
                      className={classes.cell}
                      style={{
                        backgroundColor: hasFeature(pd.product, featureType) ? '#f0fdf4' : '#fafafa',
                      }}
                    >
                      {hasFeature(pd.product, featureType) ? (
                        <span className={classes.checkmark}>✓</span>
                      ) : (
                        <span className={classes.cross}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default React.memo(FeatureMatrix)
