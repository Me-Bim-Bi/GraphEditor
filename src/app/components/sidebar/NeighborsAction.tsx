import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { updateNodeFilter } from '../../store/features/nodeFilterSlice';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateBackward, updateForward } from '../../store/features/actionHistorySlice';
import { Data } from '../../types/dataGraph';

export default function NeighborsAction() {
    const backwardArray = useAppSelector(state => state.actionHistory.backward);
    let changeableBackwardArray = structuredClone(backwardArray); 
    const [hop, setHop] = useState('');
    const [neighborsNode, setNeighborsNode] = useState('');
    const data = useSelector((state: RootState) => state.graphData.value);
    const dispatch = useAppDispatch();
    const [isReadyToGraph, setIsReadyToGraph] = useState(false);
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

    const handleNeighbors = async () => {
        if (!neighborsNode || !hop) {
            toast.error(`You need to enter node label and hop count"`);
            return;
        }
        changeableBackwardArray.push(data);
        dispatch(updateBackward(changeableBackwardArray));
        dispatch(updateForward([]));

        const hopNum = Number(hop);
        if (hopNum < 1 || hopNum > 5) {
            toast.error("Please enter hop in range (1-5)");
            return;
        }

        const response = await fetch('/api/neighbors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ neighborsNodeId: neighborsNode, hopID: hopNum }),
        });

        const result = await response.json();

        if (!result.nodes || result.nodes.length === 0) {
            toast.error("No neighbors found");
            return;
        }
        
        const neighborsNodes = result.nodes.map((n: any) => n.label);
        dispatch(updateNodeFilter(neighborsNodes));
    };

    return (
        <>
            <div className='max-w-xs flex gap-x-2' >
                <input type="text" value={neighborsNode} onChange={(e) => setNeighborsNode(e.target.value)} placeholder="Node ID" className="border p-2 w-full rounded" />
                <input type="text" value={hop} onChange={e => setHop(e.target.value)} placeholder="Hop (max 5)" className="border p-2 w-full rounded" />
            </div>
            <div className='flex flex-col gap-y-2' >
                <button type="button" onClick={handleNeighbors} disabled={!isButtonEnable || !isReadyToGraph} className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Find neighbors
                </button>
            </div>
        </>
    );
}