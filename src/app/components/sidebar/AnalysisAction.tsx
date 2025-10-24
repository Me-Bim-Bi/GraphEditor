import { updateAnalysisModalOpen } from '../../store/features/buttonsEnableSlice';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateForward, updateBackward } from '../../store/features/actionHistorySlice';
import { useSelector } from 'react-redux'
import { updateData } from '../../store/features/graphDataSlice';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Data } from '../..//types/dataGraph'

export default function AnalysisAction() {
    const [selectedAnalysis, setSelectedAnalysis] = useState('');
    const [isReadyToGraph, setIsReadyToGraph] = useState(false);
    const data = useSelector((state: RootState) => state.graphData.value);
    const backwardArray = useAppSelector(state => state.actionHistory.backward);
    let changeableBackwardArray = structuredClone(backwardArray);
    const [hasResult, setHasResult] = useState(false);
    const dispatch = useAppDispatch();
    const isButtonEnable = useSelector((state: RootState) => state.buttonEnable.value);

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
    const handleAnalysis = async () => {
        if (!selectedAnalysis) {
            toast.error('You need to select an analysis type before you click on "Analysis"');
            return;
        }
        changeableBackwardArray.push(data);
        dispatch(updateBackward(changeableBackwardArray));
        dispatch(updateForward([]));
        const parsed: Data = JSON.parse(data)

        // save graph to database (in case user have not done it yet)
        await fetch('/api/import-graph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed),
        });

        const response = await fetch('/api/analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: selectedAnalysis }),
        });

        const analysisData = await response.json();
        if (!analysisData?.result) {
            console.warn("No records returned from analysis.");
            return;
        }
        let graphDataObject = JSON.parse(data);
        // Update state graph
        dispatch(updateData(JSON.stringify({ nodes: analysisData.result, links: graphDataObject.links })));
        setHasResult(true);
    }

    const showAnalysisModal = () => {
        if (!selectedAnalysis) {
            toast.error('You need to select an analysis type before you click on "Show analysis result"');
            return;
        }
        dispatch(updateAnalysisModalOpen(true));
    }
    return (
        <>
            <div className="max-w-xs flex gap-x-2">
                <select className="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    value={selectedAnalysis}
                    onChange={(e) => setSelectedAnalysis(e.target.value)}
                >
                    <option value="">Select analysis</option>
                    <option value="pr">Page ranked</option>
                    <option value="cd">Community detection</option>
                    <option value="cc">Connected component</option>
                    <option value="dc">Degree centrality</option>

                </select>
            </div>
            <div className="max-w-xs flex gap-x-2" >
                <button
                    type="button"
                    onClick={handleAnalysis}
                    disabled={!isButtonEnable || !isReadyToGraph}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Analysis
                </button>
                <button
                    type="button"
                    onClick={showAnalysisModal}
                    disabled={!hasResult}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Show result
                </button>
            </div>
        </>
    )
}