import React from 'react'
import {connect} from 'react-redux'
import {START_RETRIEVE_PLAN_LIST} from '../../../store/energy/data'
import Plan from './Plan'

class EnergyPlanList extends React.Component {
  render() {
    const { dataSourceIndex } = this.props
    let planList = this.props.planList[dataSourceIndex];
    planList = !!planList ? planList : {}
    const { progress, totalRecords, detailRecords, failedDetailRecords, plans } = planList
    const processedRecords = detailRecords + failedDetailRecords
    const progressPercentage = totalRecords ? (processedRecords * 100 / totalRecords) : 0

    return (
      <div className="max-h-80 overflow-auto space-y-2">
        {
          !!totalRecords && (processedRecords < totalRecords) &&
          <div className="w-11/12 mx-auto">
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-slate-400 mt-1 text-center">
              {Math.round(progressPercentage)}% complete
            </div>
          </div>
        }
        {
          progress === START_RETRIEVE_PLAN_LIST && (
            <div className="text-sm text-slate-400 px-4 py-2 text-center">
              Getting all current plans...
            </div>
          )
        }
        {
          processedRecords < totalRecords && (
            <div className="text-sm text-slate-400 px-4 py-2 text-center">
              Getting plan details...
            </div>
          )
        }
        {
          !!plans && processedRecords >= totalRecords && Object.values(plans).map((plan, index) => (
            <Plan key={index} plan={plan} dataSourceIndex={dataSourceIndex} />
          ))
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  planList: state.energy
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(EnergyPlanList)

const mapStateToProps = state => ({
  planList: state.energy
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(EnergyPlanList)
