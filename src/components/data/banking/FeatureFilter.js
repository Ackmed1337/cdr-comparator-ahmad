import React, { useState, useCallback } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/Accordion'
import { Input } from '../../ui/Input'
import { Checkbox } from '../../ui/Checkbox'
import { Button } from '../../ui/Button'

const FEATURE_TYPES = [
  'CARD_ACCESS', 'ADDITIONAL_CARDS', 'CASHBACK_OFFER', 'FREE_TXNS', 'UNLIMITED_TXNS',
  'OFFSET', 'OVERDRAFT', 'REDRAW', 'BALANCE_TRANSFERS', 'DIGITAL_BANKING',
  'DIGITAL_WALLET', 'LOYALTY_PROGRAM', 'NOTIFICATIONS', 'BONUS_REWARDS',
  'INSURANCE', 'RELATIONSHIP_MANAGEMENT', 'BILL_PAY', 'NPP', 'COMPLEMENTARY_PRODUCT_DISCOUNTS'
]

const FeatureFilter = ({ onFilterChange }) => {
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [search, setSearch] = useState('')

  const handleToggle = useCallback(feature => {
    setSelectedFeatures(prev => {
      const updated = prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
      onFilterChange(updated)
      return updated
    })
  }, [onFilterChange])

  const handleClearAll = useCallback(() => {
    setSelectedFeatures([])
    onFilterChange([])
  }, [onFilterChange])

  const filteredFeatures = FEATURE_TYPES.filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Accordion type="single" collapsible className="mb-3 border border-border rounded-lg bg-card px-4">
      <AccordionItem value="features" className="border-b-0">
        <AccordionTrigger className="hover:no-underline">
          <span className="text-sm font-semibold text-foreground/90">
            Filter by Features {selectedFeatures.length > 0 && `(${selectedFeatures.length})`}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <Input
            type="text"
            placeholder="Search features..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-3"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 max-h-64 overflow-y-auto">
            {filteredFeatures.map(feature => (
              <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox checked={selectedFeatures.includes(feature)} onCheckedChange={() => handleToggle(feature)} />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                  {feature.replace(/_/g, ' ')}
                </span>
              </label>
            ))}
          </div>

          {selectedFeatures.length > 0 && (
            <Button variant="secondary" size="sm" className="w-full" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default React.memo(FeatureFilter)
