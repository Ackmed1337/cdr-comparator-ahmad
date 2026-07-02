import React, { useMemo } from 'react'
import { Check, Minus } from 'lucide-react'
import { translateFeatureType } from '../../utils/dict'
import { Card } from '../ui/Card'

const FeatureMatrix = ({ products, dataSources }) => {
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
    <Card className="mb-4 overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-bold text-foreground/90">Feature Matrix</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted/50 border-b-2 border-primary sticky top-0 z-10">
              <th className="px-3 py-2 text-left font-bold text-foreground/90 bg-card min-w-[120px] sticky left-0 z-20 border-r border-border">
                Feature
              </th>
              {products.map((pd, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 text-center font-bold text-foreground/90 min-w-[100px] border-r border-border last:border-r-0"
                >
                  <div className="text-xs text-primary font-medium">
                    {dataSources[pd.dataSourceIdx]?.name && dataSources[pd.dataSourceIdx].name}
                  </div>
                  <div className="text-xs text-foreground/90">{pd.product.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((featureType, rowIdx) => (
              <tr
                key={featureType}
                className={`border-b border-border transition-colors duration-200 hover:bg-primary/5 ${
                  rowIdx % 2 === 0 ? 'bg-card' : 'bg-muted/30'
                }`}
              >
                <td className="px-3 py-2 font-bold text-foreground/90 bg-card sticky left-0 z-10 border-r border-border min-w-[120px]">
                  {translateFeatureType(featureType)}
                </td>
                {products.map((pd, idx) => (
                  <td
                    key={idx}
                    className="px-3 py-2 text-center border-r border-border last:border-r-0 min-w-[100px]"
                  >
                    {hasFeature(pd.product, featureType) ? (
                      <Check className="w-4 h-4 mx-auto text-emerald-500" strokeWidth={3} />
                    ) : (
                      <Minus className="w-4 h-4 mx-auto text-muted-foreground/60" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default React.memo(FeatureMatrix)
