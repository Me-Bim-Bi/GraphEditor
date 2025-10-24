import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'

interface ButtonEnableState {
    value: boolean,
    analysisModalOpen: boolean
}

export const buttonEnableSlice = createSlice({
    name: 'buttonEnable',
    initialState: { value: false, analysisModalOpen: false } as ButtonEnableState,
    reducers: {
        updateButtonEnable: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        },
        updateAnalysisModalOpen: (state, action: PayloadAction<boolean>) => {
            state.analysisModalOpen = action.payload;
        }
    },
});

export const selectButtonEnable = (state: RootState) => state.buttonEnable.value
export const selectAnalysisModalOpen = (state: RootState) => state.buttonEnable.analysisModalOpen
export const { updateButtonEnable, updateAnalysisModalOpen } = buttonEnableSlice.actions;

export default buttonEnableSlice.reducer;