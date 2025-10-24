import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'

interface HierarchyEnableState {
    value: boolean
}

export const hierarchyEnableSlice = createSlice({
    name: 'hierarchyEnable',
    initialState: { value: false } as HierarchyEnableState,
    reducers: {
        updateHierarchyEnable: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        },
    },
});

export const selectHierarchyEnable = (state: RootState) => state.hierarchyEnable.value

export const { updateHierarchyEnable } = hierarchyEnableSlice.actions;

export default hierarchyEnableSlice.reducer;