import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ItemsState {
  items:any
}

const initialState: ItemsState = {

  items: [
    { title: 'Item 1', className: "icon-a", expanded: true, children: [{ title: "Branch Manager" }] }
  ]
}

export const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    saveData: (state, action) => {
      return {
        ...state,
        items:[action.payload]
      };
    }
  },
})

export const { saveData } = treeSlice.actions

export default treeSlice.reducer