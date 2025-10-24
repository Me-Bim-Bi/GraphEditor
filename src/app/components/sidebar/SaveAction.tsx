import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Data } from '../..//types/dataGraph'

export default function Save() {
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

    const handleSave = async () => {
        try {
            const parsed: Data = JSON.parse(data);

            const response = await fetch('/api/import-graph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed),
            });

            if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errText}`);
            }

            const result = await response.json();
            toast.success("Save to database successful");

        } catch (err) {
            console.error("Save failed:", err);
            toast.error("Save failed: cannot connect to Neo4j or invalid response", { duration: 5000 });
        }
    };
    return (
        <>
                <button type="button" onClick={handleSave} disabled={!isButtonEnable || !isReadyToGraph} className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Save
                </button>
        </>
    )
}
