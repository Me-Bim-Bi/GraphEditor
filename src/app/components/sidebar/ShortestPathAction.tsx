import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateForward, updateBackward } from '../../store/features/actionHistorySlice';
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { updateNodeFilter } from '../../store/features/nodeFilterSlice';
import { Data } from '../../types/dataGraph'

export default function ShortestPathAction() {
    const [startNode, setStartNode] = useState('');
    const [endNode, setEndNode] = useState('');
    const data = useSelector((state: RootState) => state.graphData.value);
    const backwardArray = useAppSelector(state => state.actionHistory.backward);
    let changeableBackwardArray = structuredClone(backwardArray);
    const dispatch = useAppDispatch();
    const isButtonEnable = useSelector((state: RootState) => state.buttonEnable.value);
    const [isReadyToGraph, setIsReadyToGraph] = useState(false);
    const [hop, setHop] = useState('');
    const hierarchyEnable = useAppSelector(state => state.hierarchyEnable.value)


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
    const handleShortestPath = async () => {
        const startId = startNode;
        const endId = endNode;

        const response = await fetch('/api/filtering', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startId, endId }),
        });
        

        const result = await response.json();
        //check and show error if it does not have any path between 2 nodes
        if (!result.path || result.path.length === 0) {
            toast.error(`No path found between "${startId}" and "${endId}"`);
            dispatch(updateNodeFilter([]));
            return;
        }
        changeableBackwardArray.push(data);
        dispatch(updateBackward(changeableBackwardArray));
        dispatch(updateForward([]));
        result.path.forEach((record: any) => {
            record
        });
        let shortestPathNodes: string[] = [];
        result.path[0].nodeNames.forEach((nodeName: string) => {
            shortestPathNodes.push(nodeName);
        });
        console.log("result: ", result.path[0].totalCost);
        toast.success(`Found path from "${startId}" to "${endId}" with total cost = ${result.path[0].totalCost}`, { duration: 5000 } )
        setHop('');
        dispatch(updateNodeFilter(shortestPathNodes));
    }

    return (
        <>
            <div className='max-w-xs flex gap-x-2' >
                <input type="text" value={startNode} onChange={(e) => setStartNode(e.target.value)} placeholder="Start node ID" className="border p-2 w-full rounded" />
                <input type="text" value={endNode} onChange={e => setEndNode(e.target.value)} placeholder="End node ID" className="border p-2 w-full rounded" />
            </div>
            <div className='flex flex-col gap-y-2' >
                <button type="button" onClick={handleShortestPath} disabled={!isButtonEnable || !isReadyToGraph || hierarchyEnable} className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Find shortest path
                </button>
            </div>
        </>
    )
}