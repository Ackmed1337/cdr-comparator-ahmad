import React from 'react'
import DataSourcePanel from './data-source/DataSourcePanel'
import BankingPanel from './data/banking/BankingPanel'
import ConsolePanel from './data/ConsolePanel'
import Header from './layout/Header'
import BankingComparisonPanel from './comparison/BankingComparisonPanel'
import DiscoveryInfo from './data/discovery/DiscoveryInfo'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs'

function Page() {
  return (
    <>
      <Header title="Comparator" />
      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 space-y-6">
          <DataSourcePanel />
          <ConsolePanel />

          <Tabs defaultValue="banking">
            <TabsList>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="status">Status &amp; Outages</TabsTrigger>
            </TabsList>

            <TabsContent value="banking" className="space-y-6">
              <BankingPanel />
              <BankingComparisonPanel />
            </TabsContent>
            <TabsContent value="status">
              <DiscoveryInfo />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Page
