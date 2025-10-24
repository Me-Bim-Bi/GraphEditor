import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateForward, updateBackward } from '../../store/features/actionHistorySlice';
import { useSelector } from 'react-redux'
import { updateData } from '../../store/features/graphDataSlice';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Data } from '../../types/dataGraph'

export default function ClearAction() {
    const backwardArray = useAppSelector(state => state.actionHistory.backward);
    let changeableBackwardArray = structuredClone(backwardArray);
    const data = useSelector((state: RootState) => state.graphData.value);
    const dispatch = useAppDispatch();
    const [isReadyToGraph, setIsReadyToGraph] = useState(false);
    const isButtonEnable = useSelector((state: RootState) => state.buttonEnable.value);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

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

    const handleClear = async () => {
        try {
            if (data === '') {
                changeableBackwardArray.push(JSON.stringify({ nodes: [], links: [] }));
            } else {
                changeableBackwardArray.push(data);
            }
            dispatch(updateBackward(changeableBackwardArray));
            dispatch(updateForward([]));

            const parsed: Data = JSON.parse(data);

            const response = await fetch("/api/clear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed),
            });

            if (!response.ok) throw new Error("Clear failed on server");

            await response.json();
            dispatch(updateData(JSON.stringify({ nodes: [], links: [] })));
            setIsClearModalOpen(false);
            toast.success("Graph cleared successfully", { duration: 4000 });
        } catch (err) {
            console.error(err);
            toast.error("Clear failed", { duration: 5000 });
        }
    };
    return (
        <>
            <button onClick={() => setIsClearModalOpen(true)} disabled={!isButtonEnable || !isReadyToGraph} className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Clear</button>
            {isClearModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3>Confirm Clear</h3>
                        <p>Do you really want to clear the graph? It will also be cleared from the database.</p>
                        <div className="flex justify-end gap-x-2">
                            <button
                                onClick={() => setIsClearModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}