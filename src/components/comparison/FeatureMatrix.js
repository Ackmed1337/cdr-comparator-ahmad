import React, { useMemo } from 'react'
import { translateFeatureType } from '../../utils/dict'

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
    <div className="mb-4 rounded-lg overflow-hidden border border-slate-700">
      <div className="p-4 bg-slate-900 border-b border-slate-700">
        <h3 className="text-sm font-bold text-slate-300">Feature Matrix</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-blue-500 sticky top-0 z-10">
              <th className="px-3 py-2 text-left font-bold text-slate-300 bg-slate-900 min-w-[120px] sticky left-0 z-20 border-r border-slate-700">
                Feature
              </th>
              {products.map((pd, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 text-center font-bold text-slate-300 min-w-[100px] border-r border-slate-700 last:border-r-0"
                >
                  <div className="text-xs text-indigo-400 font-medium">
                    {dataSources[pd.dataSourceIdx]?.name && dataSources[pd.dataSourceIdx].name}
                  </div>
                  <div className="text-xs text-slate-300">{pd.product.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((featureType, rowIdx) => (
              <tr
                key={featureType}
                className={`border-b border-slate-700 transition-colors duration-200 hover:bg-blue-500/5 ${
                  rowIdx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'
                }`}
              >
                <td className="px-3 py-2 font-bold text-slate-300 bg-slate-900 sticky left-0 z-10 border-r border-slate-700 min-w-[120px]">
                  {translateFeatureType(featureType)}
                </td>
                {products.map((pd, idx) => (
                  <td
                    key={idx}
                    className="px-3 py-2 text-center border-r border-slate-700 last:border-r-0 min-w-[100px]"
                  >
                    {hasFeature(pd.product, featureType) ? (
                      <span className="text-lg font-bold text-emerald-500">✓</span>
                    ) : (
                      <span className="text-base text-slate-500">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default React.memo(FeatureMatrix)
