import { configureStore } from '@reduxjs/toolkit'
import treeReducer from '../redux/treeSlice';

export const store = configureStore({
  reducer: {
    tree: treeReducer
  },
   devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch