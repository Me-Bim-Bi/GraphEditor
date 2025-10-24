'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { updateBackward, updateForward } from '../store/features/actionHistorySlice'
import { updateData } from '../store/features/graphDataSlice';
import DarkModeToggle from './Darkmode'

type Action = {
    name: string;
    modal: React.ReactNode;
    enabled: boolean;
    onClick: () => void;
};

const ActionMenu = () => {
    // state for modal
    const [openModals, setOpenModals] = useState({
        addNode: false,
        addEdge: false,
        removeNode: false,
        removeEdge: false,
        editNode: false,
        editEdge: false,
        edit: false,
    });

    const dispatch = useAppDispatch()

    const [hasUndo, setHasUndo] = useState(false);
    const [hasRedo, setHasRedo] = useState(false);

    const forwardData = useAppSelector(state => state.actionHistory.forward)
    const backwardData = useAppSelector(state => state.actionHistory.backward)
    const graphData = useAppSelector(state => state.graphData.value)
    let changeableBackwardArray = structuredClone(backwardData);
    const forwardArray = useAppSelector(state => state.actionHistory.forward)
    let changeableForwardArray = structuredClone(forwardArray);

    useEffect(() => {
        if (forwardData.length !== 0) {
            setHasRedo(true)
        } else {
            setHasRedo(false)
        }
        if (backwardData.length !== 0) {
            setHasUndo(true)
        } else {
            setHasUndo(false)
        }
    }, [forwardData, backwardData])

    const handleForward = () => {
        changeableBackwardArray.push(graphData);
        let lastForwardData = changeableForwardArray.pop();
        if (lastForwardData) {
            dispatch(updateBackward(changeableBackwardArray));
            dispatch(updateForward(changeableForwardArray));
            dispatch(updateData(lastForwardData));
        }
    }

    const handleBackward = () => {
        changeableForwardArray.push(graphData);

        let lastData = changeableBackwardArray.pop();
        if (lastData) {
            dispatch(updateBackward(changeableBackwardArray));
            dispatch(updateForward(changeableForwardArray));
            dispatch(updateData(lastData));
        }
    }

    const commonButtonClass =
        'w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm \
    font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 \
    focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none';

    return (
        <>
            <div>
                <button type="button" onClick={handleBackward} disabled={!hasUndo} className={commonButtonClass}>
                    Undo
                </button>
            </div>
            <div>
                <button type="button" onClick={handleForward} disabled={!hasRedo} className={commonButtonClass}>
                    Redo
                </button>
            </div>
            <div>
                <DarkModeToggle></DarkModeToggle>
            </div>
        </>
    );
};

export default ActionMenu;
