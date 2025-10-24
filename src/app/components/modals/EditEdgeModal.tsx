'use client'
import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { updateData } from '../../store/features/graphDataSlice'
import { Data, Node } from '../../types/dataGraph'
import { updateBackward, updateForward } from '../../store/features/actionHistorySlice'
import toast, { Toaster } from "react-hot-toast";

type EditEdgeModalProps = {
    isOpen: boolean,
    edgeId: string,
    onClose: () => void
}

const EditEdgeModal = ({ isOpen, edgeId, onClose }: EditEdgeModalProps) => {
    //console.log("edgeID:", edgeId)
    const dispatch = useAppDispatch()
    const graphDataString = useAppSelector(state => state.graphData.value)
    const graphData: Data = graphDataString ? JSON.parse(graphDataString) : { nodes: [], links: [] }

    const [formData, setFormData] = useState({ source: '', target: '', value: 1, relationship: '', color: '#929296', arrowShape: 'triangle' })
    const [error, setError] = useState('')
    const [source, setSource] = useState('')
    const [target, setTarget] = useState('')

    const backwardArray = useAppSelector(state => state.actionHistory.backward)
    let changeableBackwardArray = structuredClone(backwardArray);

    // Filter edges associated with selected node
    useEffect(() => {
        if (graphDataString && edgeId) {
            let edgeInfos = edgeId.split("-");
            let edgeSource = edgeInfos[2];
            let edgeTarget = edgeInfos[3];
            let edgeIndex = graphData.links.findIndex(link => link.source === edgeSource && link.target == edgeTarget);
            if (edgeIndex === -1) return;
            const edgeData = graphData.links[edgeIndex];
            const edgeValue = edgeData.value ?? 1;
            const edgeRelationship = edgeData.relationship ?? '';
            const edgeColor = edgeData.color ?? '#929296';
            const edgeArrowShape = edgeData.arrowShape ?? 'triangle';
            setSource(edgeSource)
            setTarget(edgeTarget)
            setFormData({
                source: edgeSource,
                target: edgeTarget,
                value: edgeValue,
                relationship: edgeRelationship,
                color: edgeColor,
                arrowShape: edgeArrowShape
            })
            setError('')
        }

    }, [graphDataString, edgeId])

    if (!isOpen) return null

    const handleRemove = () => {
        changeableBackwardArray.push(graphDataString);
        dispatch(updateBackward(changeableBackwardArray));
        dispatch(updateForward(new Array()))

        let edgeIndex = graphData.links.findIndex(link => link.source === source && link.target == target);
        toast.success('Remove node successful');
        let changeableDataArray = structuredClone(graphData);
        changeableDataArray.links.splice(edgeIndex, 1);
        dispatch(updateData(JSON.stringify(changeableDataArray)));

        onClose();
    }

    const handleSave = () => {
        changeableBackwardArray.push(graphDataString);
        dispatch(updateBackward(changeableBackwardArray));
        dispatch(updateForward(new Array()))
        
        let edgeIndex = graphData.links.findIndex(
            link => link.source === source && link.target == target
        );
        if (edgeIndex === -1) return;

        let changeableDataArray = structuredClone(graphData);

        // Update all editable fields
        changeableDataArray.links[edgeIndex].value = formData.value;
        changeableDataArray.links[edgeIndex].relationship = formData.relationship;
        changeableDataArray.links[edgeIndex].color = formData.color;
        changeableDataArray.links[edgeIndex].arrowShape = formData.arrowShape;

        dispatch(updateData(JSON.stringify(changeableDataArray)));
        onClose();
    }


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="modal-container bg-white p-6 rounded-lg w-[500px] shadow-lg">
                <h1 className="text-lg font-bold mb-4">Edit Edge</h1>

                {/* Edge editing form */}
                <div className="space-y-3 mb-4">

                    {/* Source */}
                    <div>
                        <label className="block mb-1 font-medium">Source</label>
                        <input
                            className="border p-2 w-full rounded bg-gray-200 cursor-not-allowed"
                            data-testid="edit-edge-source"
                            value={source}
                            disabled
                        />
                    </div>

                    {/* Target */}
                    <div>
                        <label className="block mb-1 font-medium">Target</label>
                        <input
                            className="border p-2 w-full rounded bg-gray-200 cursor-not-allowed"
                            data-testid="edit-edge-target"
                            value={target}
                            disabled
                        />
                    </div>

                    {/* Value */}
                    <div>
                        <label className="block mb-1 font-medium">Value</label>
                        <input
                            data-testid="edit-edge-value"
                            type="number"
                            className="border p-2 w-full rounded"
                            value={formData.value}
                            onChange={(e) =>
                                setFormData({ ...formData, value: Number(e.target.value) })
                            }
                        />
                    </div>

                    {/* Relationship */}
                    <div>
                        <label className="block mb-1 font-medium">Relationship</label>
                        <input
                            className="border p-2 w-full rounded"
                            data-testid="edit-edge-relationship"
                            value={formData.relationship}
                            onChange={(e) =>
                                setFormData({ ...formData, relationship: e.target.value })
                            }
                        />
                    </div>

                    {/* Color */}
                    <div className="mb-3 flex items-center gap-2">
                        <label className="text-sm">Color:</label>
                        <input
                            data-testid="edit-edge-color"
                            type="color"
                            value={formData.color}
                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                        />
                    </div>

                    {/* Arrow shape */}
                    <div className="mb-3 flex items-center gap-2">
                        <label className="text-sm">Arrow:</label>
                        <select
                            className="border rounded p-1 text-sm"
                            data-testid="edit-edge-arrow"
                            value={formData.arrowShape}
                            onChange={e => setFormData({ ...formData, arrowShape: e.target.value })}
                        >
                            <option value="triangle">Triangle</option>
                            <option value="diamond">Diamond</option>
                            <option value="circle">Circle</option>
                            <option value="vee">Vee</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        onClick={handleRemove}
                    >
                        Remove
                    </button>
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditEdgeModal
