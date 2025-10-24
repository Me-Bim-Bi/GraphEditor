'use client'
import React, { useState, useEffect, ChangeEvent } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { updateData } from '../../store/features/graphDataSlice'
import { Data } from '../../types/dataGraph'
import { updateBackward, updateForward } from '../../store/features/actionHistorySlice'
import toast, { Toaster } from "react-hot-toast";

type EditNodeModalProps = {
    isOpen: boolean,
    nodeId: string,
    onClose: () => void
}

const EditNodeModal = ({ isOpen, nodeId, onClose }: EditNodeModalProps) => {
    const dispatch = useAppDispatch()
    const graphDataString = useAppSelector(state => state.graphData.value)
    const graphData: Data = graphDataString
        ? JSON.parse(graphDataString)
        : { nodes: [], links: [] }

    const backwardArray = useAppSelector(state => state.actionHistory.backward)
    let changeableBackwardArray = structuredClone(backwardArray);


    const [actionType, setActionType] = useState('')

    // Form state object
    const [formData, setFormData] = useState({
        label: '',
        parentID: '',
        color: '#4edff2',
        textInput: '',
    })

    const selectActionType = (e: ChangeEvent<HTMLInputElement>) => {
        setActionType(e.target.value)
    }

    // Fill form when selected node changes
    useEffect(() => {
        const currentGraphData: Data = graphDataString
            ? JSON.parse(graphDataString)
            : { nodes: [], links: [] }
        const node = currentGraphData.nodes.find(n => n.id === nodeId)
        if (node) {
            setFormData({
                label: node.label || '',
                parentID: node.parentID || '',
                color: node.color || '#4edff2',
                textInput: node.textList ? node.textList.join('; ') : '',
            })
        }
    }, [graphDataString, nodeId])


    if (!isOpen) return null

    const handleRemove = () => {
        changeableBackwardArray.push(graphDataString);
        dispatch(updateBackward(changeableBackwardArray));
        dispatch(updateForward([]));
        const nodeMap = new Map(graphData.nodes.map(n => [n.id, { ...n }]));

        // If "parent" was be deleted, the childrens will be adopted by ...grandparent
        graphData.nodes.forEach(node => {
            if (node.parentID && nodeId === node.parentID) {
                const oldParent = nodeMap.get(node.parentID);
                node.parentID = oldParent?.parentID || undefined; // If this node does not have parent, parent becomes undefined
            }
        });

        // Remove nodes
        const remainingNodes = graphData.nodes.filter(n => n.id !== nodeId);

        // Remove edges that have relationship with the node
        const remainingLinks = graphData.links.filter(
            l => l.source !== nodeId && l.target !== nodeId
        )

        const updatedData: Data = {
            nodes: remainingNodes,
            links: remainingLinks,
        }

        dispatch(updateData(JSON.stringify(updatedData)))

        onClose()

    }
    const handleSave = () => {
        changeableBackwardArray.push(graphDataString);
        dispatch(updateBackward(changeableBackwardArray));
        dispatch(updateForward([]));
        
        const nodeIndex = graphData.nodes.findIndex((n) => n.id === nodeId)
        if (nodeIndex === -1) {
            toast.error('Selected node not found!')
            return
        }
        if (!formData.label.trim()) {
            toast.error('Label can not be empty.')
            return
        }
        // Update node
        graphData.nodes[nodeIndex] = {
            ...graphData.nodes[nodeIndex],
            label: formData.label,
            parentID: formData.parentID || undefined,
            color: formData.color,
            textList: formData.textInput ? formData.textInput.split(';').map(item => item.trim()) : undefined,
        }

        dispatch(updateData(JSON.stringify(graphData)))
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="modal-container bg-white p-6 rounded-lg w-[500px] shadow-lg">
                <h1 className="text-lg font-bold mb-4">Edit Node</h1>

                {/* Node fields */}
                <div className="space-y-3 mb-4">
                    <div>
                        <label className="block mb-1 font-medium">Node ID (cannot edit)</label>
                        <input
                            className="border p-2 w-full rounded bg-gray-200 cursor-not-allowed"
                            value={nodeId}
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Label</label>
                        <input
                            className="border p-2 w-full rounded"
                            data-testid="edit-node-label"
                            value={formData.label}
                            onChange={(e) =>
                                setFormData({ ...formData, label: e.target.value })
                            }
                        />
                        {!formData.label.trim() && (
                            <p className="text-red-500 text-sm">Label is required</p>
                        )}
                        </div>
                    <div>
                        <label className="block mb-1 font-medium">Parent ID {" "}
                            <span className="text-red-500">(mandatory with hierarchy layout)</span>
                        </label>
                        <select
                            className="border p-2 w-full rounded"
                            data-testid="edit-node-parent-ID"
                            value={formData.parentID}
                            onChange={(e) =>
                                setFormData({ ...formData, parentID: e.target.value })
                            }
                        >
                            <option value="">No parent</option>
                            {graphData.nodes
                                .filter((n) => n.id !== nodeId)
                                .slice() 
                                    .sort((a, b) => {
                                        const labelA = a.label ? a.label.toLowerCase() : a.id.toLowerCase();
                                        const labelB = b.label ? b.label.toLowerCase() : b.id.toLowerCase();
                                        return labelA.localeCompare(labelB);
                                    })
                                .map((n) => (
                                    <option key={n.id} value={n.id}>
                                        {n.label || n.id}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Additional Properties (Split by ;)</label>
                        <input
                            className="border p-2 w-full rounded"
                            data-testid="edit-node-textbox"
                            value={formData.textInput}
                            onChange={(e) =>
                                setFormData({ ...formData, textInput: e.target.value })
                            }
                        />
                    </div>


                    {/* Color */}
                    <div className="mb-3 flex items-center gap-2">
                        <label className="text-sm">Color:</label>
                        <input
                            data-testid="edit-node-color"
                            type="color"
                            value={formData.color}
                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 justify-end">
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        onClick={handleRemove}
                    >
                        Remove
                    </button>
                    <button
                        className={`py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 ${!formData.label.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSave}
                        disabled={!formData.label.trim()}
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

export default EditNodeModal
