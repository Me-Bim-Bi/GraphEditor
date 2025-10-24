import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateBackward, updateForward } from '../../store/features/actionHistorySlice';
import { Data } from '../../types/dataGraph';
import { updateData } from '../../store/features/graphDataSlice';
import { toast } from 'react-hot-toast';


export default function SubstractAction() {
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
    const data = useSelector((state: RootState) => state.graphData.value);
    const backwardArray = useAppSelector(state => state.actionHistory.backward);
    let changeableBackwardArray = structuredClone(backwardArray);
    const dispatch = useAppDispatch();
    const isButtonEnable = useSelector((state: RootState) => state.buttonEnable.value);
    const [isReadyToGraph, setIsReadyToGraph] = useState(false);
    const selectedFilterNodes = useSelector((state: RootState) => state.nodeFilter.value);
    const dataObject = data ? JSON.parse(data) as Data : { nodes: [], links: [] };
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
    const handleSubGraph = () => {
        if (selectedNodes.length === 0 && selectedFilterNodes.length === 0) {
            toast.error("No nodes selected to subtract", { duration: 3000 });
        return;
    }
        changeableBackwardArray.push(data);
        dispatch(updateBackward(changeableBackwardArray));
        dispatch(updateForward([]));
        if (selectedFilterNodes.length !== 0 && selectedNodes.length === 0) {
            const filteredNodes = dataObject.nodes.filter(node => selectedFilterNodes.includes(node.label));
            const filteredNodeIds = filteredNodes.map(node => node.id);
            const filteredLinks = dataObject.links.filter(link =>
                (filteredNodeIds.includes(link.source as string) && filteredNodeIds.includes(link.target as string))
            );
            const subGraph = { nodes: filteredNodes, links: filteredLinks };
            dispatch(updateData(JSON.stringify(subGraph)));
        } else if (selectedNodes.length !== 0) {
            const filteredNodes = dataObject.nodes.filter(node => selectedNodes.includes(node.id));
            const filteredNodeIds = filteredNodes.map(node => node.id);
            const filteredLinks = dataObject.links.filter(link =>
                (filteredNodeIds.includes(link.source as string) && filteredNodeIds.includes(link.target as string))
            );
            const subGraph = { nodes: filteredNodes, links: filteredLinks };
            dispatch(updateData(JSON.stringify(subGraph)));
        }
    }

    return (
        <>
            <div>
                <div className="flex flex-col gap-y-2">
                    <label className="font-medium mb-1">Select nodes</label>
                        <div className="border border-gray-200 rounded-lg overflow-y-auto" style={{ maxHeight: '6rem' }}>
                            {(() => {
                            try {
                                const parsed: Data = JSON.parse(data);
                                if (!parsed.nodes.length) return <p className="text-gray-500 p-2">No nodes available</p>;

                                return parsed.nodes.map(node => (
                                <label key={node.id} className="flex items-center gap-x-2 px-2 py-1 hover:bg-gray-50 cursor-pointer">
                                    <input
                                    type="checkbox"
                                    value={node.id}
                                    checked={selectedNodes.includes(node.id)}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (e.target.checked) {
                                        setSelectedNodes([...selectedNodes, val]);
                                        } else {
                                        setSelectedNodes(selectedNodes.filter(id => id !== val));
                                        }
                                    }}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                    disabled={hierarchyEnable}
                                    />
                                    <span className="truncate">{node.label}</span>
                                </label>
                                ));
                            } catch {
                                return <p className="text-gray-500 p-2">Invalid graph data</p>;
                            }
                            })()}
                        </div>
                </div>
            </div>
            <div className='flex flex-col gap-y-2' >
                <button type="button" onClick={handleSubGraph} disabled={!isButtonEnable || !isReadyToGraph } className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Subtract Graph
                </button>
            </div>
        </>
    );
}   