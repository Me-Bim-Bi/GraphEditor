'use client'

import ImportButton from './buttons/ImportButton';
import ExportButton from './buttons/ExportButton';
import React, { useEffect, useState } from 'react'
import { Toaster } from "react-hot-toast";
import { updateButtonEnable } from '../store/features/buttonsEnableSlice';
import { useAppDispatch } from '../store/hooks'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Data } from '../types/dataGraph'
import cytoscape from 'cytoscape'
import AnalysisAction from './sidebar/AnalysisAction';
import ShortestPathAction from './sidebar/ShortestPathAction';
import NeighborsAction from './sidebar/NeighborsAction';
import SubstractAction from './sidebar/SubstractAction';
import SubstractParentAction from './sidebar/SubstractParentAction';
import ClearAction from './sidebar/ClearAction';
import SaveAction from './sidebar/SaveAction';


type SidebarProps = {
    onGraphTypeSet: (args: string) => void;
    cy: cytoscape.Core | null;
};

const SideBar = ({ onGraphTypeSet, cy }: SidebarProps) => {
    const [isButtonEnable, setIsButtonEnable] = useState(false);
    const [isReadyToGraph, setIsReadyToGraph] = useState(false);
    const dispatch = useAppDispatch()
    const data = useSelector((state: RootState) => state.graphData.value);

    const sendDataToParent = (graphType: string) => {
        setIsButtonEnable(true)
        onGraphTypeSet(graphType);
        dispatch(updateButtonEnable(true))
    };

    useEffect(() => {
        if (data !== '') {
            const dataGraph: Data = JSON.parse(data)
            if (dataGraph.nodes.length !== 0) {
                setIsReadyToGraph(true);
            } else {
                setIsReadyToGraph(false);
            }
        }
    }, [data]);

    return <>
        <div className="max-w-xs flex flex-col rounded-lg shadow-2xs gap-y-2">
            <Toaster position="top-right" />
            <div>
                <select onChange={e => sendDataToParent(e.target.value)} className="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                    <option value="">Select graph type</option>
                    <option value="fd">Force directed</option>
                    <option value="h">Hierarchical</option>
                </select>
            </div>
            <div >
                <ImportButton isButtonEnable={isButtonEnable} setIsReadyToGraph={setIsReadyToGraph} />
            </div>
            <div>
                <ExportButton isButtonEnable={isButtonEnable} isReadyToGraph={isReadyToGraph} cy={cy} />
            </div>
            <div className="max-w-xs flex gap-x-2" >
                <SaveAction />
                <ClearAction />
            </div>
            <AnalysisAction />
            <ShortestPathAction />
            <NeighborsAction />
            <SubstractAction />
            <SubstractParentAction />
            
        </div>
    </>
}

export default SideBar;