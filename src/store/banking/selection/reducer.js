import {SELECT_BANKING_PRODUCT, DESELECT_BANKING_PRODUCT, CLEAR_BANKING_SELECTION, CLEAR_ALL_BANKING_SELECTION} from './actions'

export default function bankingSelection(state = [], action) {
    switch (action.type) {
        case SELECT_BANKING_PRODUCT:
            return [...state, action.payload]
        case DESELECT_BANKING_PRODUCT:
            const { payload } = action
            return state.filter(prd => (prd.dataSourceIdx !== payload.dataSourceIdx || prd.product.productId !== payload.product.productId))
        case CLEAR_BANKING_SELECTION:
            return state.filter(prd => (prd.dataSourceIdx !== action.payload))
        case CLEAR_ALL_BANKING_SELECTION:
            return []
        default:
            return state
    }
}
