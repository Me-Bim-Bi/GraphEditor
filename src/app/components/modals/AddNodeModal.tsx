'use client'
import React, { useState, ChangeEvent, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { updateData } from '../../store/features/graphDataSlice'
import { Data, Node, Link } from '../../types/dataGraph'
import { updateBackward, updateForward } from '../../store/features/actionHistorySlice'
import toast, { Toaster } from "react-hot-toast";

type AddNodeModalProps = {
    isOpen: boolean
    onClose: () => void
}

const AddNodeModal = ({ isOpen, onClose }: AddNodeModalProps) => {
    const [actionType, setActionType] = useState('')
    const dispatch = useAppDispatch()

    const graphDataString = useAppSelector(state => state.graphData.value)
    const graphData: Data = graphDataString
        ? JSON.parse(graphDataString)
        : { nodes: [], links: [] }

    // Form state
    const [nodeId, setNodeId] = useState('')
    const [nodeLabel, setNodeLabel] = useState('')
    const [additionalProperties, setAdditionalProperties] = useState('')
    const [parentID, setParentID] = useState('')
    const [nodeColor, setNodeColor] = useState('#4edff2')

    const [source, setSource] = useState('')
    const [target, setTarget] = useState('')
    const [value, setValue] = useState<number>(1)
    const [relationship, setRelationship] = useState('')
    const [color, setEdgeColor] = useState('#929296')
    const [arrowShape, setArrowShape] = useState('triangle')
    const hierarchyEnable = useAppSelector(state => state.hierarchyEnable.value)

    // Check duplicate Node ID
    const [idError, setIdError] = useState('')

    const backwardArray = useAppSelector(state => state.actionHistory.backward)
    let changeableBackwardArray = structuredClone(backwardArray);

    useEffect(() => {
        if (nodeId && graphData.nodes.some(n => n.id === nodeId)) {
            setIdError('Node ID already exists!')
        } else {
            setIdError('')
        }
    }, [nodeId, graphData.nodes])

    if (!isOpen) return null

    const nodeOptions: Node[] = [...graphData.nodes]
    // Only add node if it does not exist
    if (nodeId && nodeLabel && !graphData.nodes.some(n => n.id === nodeId)) {
        nodeOptions.push({ id: nodeId, label: nodeLabel, parentID: parentID, color: nodeColor })
    }

    const selectActionType = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setActionType(e.target.value)
    }

    const addNode = () => {
        if (graphDataString === '') {
                changeableBackwardArray.push(JSON.stringify({ nodes: [], links: [] }));
            } else {
                changeableBackwardArray.push(graphDataString);
            }
        dispatch(updateBackward(changeableBackwardArray))
        dispatch(updateForward(new Array() as string[]))
        if (actionType === 'Add Node' || actionType === 'Add Both') {

            if (!nodeId || !nodeLabel) {
                toast.error('Node ID and Label are mandatory');
                return;
            }
            if (idError) {
                toast.error('Cannot add node: ' + idError);
                return;
            }

            // Add node
            const newNode: Node = {
                id: nodeId,
                label: nodeLabel,
                parentID: parentID || undefined,
                color: nodeColor || '#4edff2'
            }
            if (additionalProperties.trim() !== '') {
                const propsArray = additionalProperties.split(';');
                newNode['textList'] = propsArray.map(prop => prop.trim());
            }
            graphData.nodes.push(newNode)

            if (hierarchyEnable && parentID) {
                const hasEdge = graphData.links.some(
                    l => l.source === parentID && l.target === nodeId
                );
                if (!hasEdge) {
                    graphData.links.push({
                        source: parentID,
                        target: nodeId,
                        value: 1,
                        relationship: 'parent-child',
                        color: '#929296',
                        arrowShape: 'triangle'
                    });
                }
            }
        }


        // Add edge
        if (actionType === 'Add Edge' || actionType === 'Add Both') {
            if (source && target) {
                const duplicateEdge = graphData.links.some(
                    (l) => l.source === source && l.target === target
                )
                if (duplicateEdge) {
                    alert('An edge with the same source and target already exists!')
                } else {
                    const newLink: Link = { source, target, value, relationship, color, arrowShape }
                    graphData.links.push(newLink)
                }
            }
        }

        // Update Redux store
        dispatch(updateData(JSON.stringify(graphData)))

        // Reset form
        setNodeId('')
        setNodeLabel('')
        setParentID('')
        setNodeColor('#4edff2')
        setSource('')
        setTarget('')
        setValue(1)
        setRelationship('')
        setEdgeColor('#929296')
        setArrowShape('triangle')
        setActionType('')

        onClose()
    }

    const renderAddNode = (actionType: string) => {
        if (actionType === "Add Node" || actionType === "Add Both") {
            return (
                <>
                    <div className="addNode">
                        <h2 className="font-semibold mb-2">Node{" "}</h2>
                        <Toaster position="top-right" />
                        <div className="space-y-3 mb-4">
                            <div>
                                <label className="block mb-1 font-medium">Node ID</label>
                                <input
                                    className={`border p-2 w-full rounded ${idError ? 'border-red-500' : 'border-gray-300'}`}
                                    data-testid="Node ID for test add Node"
                                    placeholder="Enter Node ID"
                                    value={nodeId}
                                    onChange={(e) => setNodeId(e.target.value)}
                                />
                                {idError && <p className="text-red-500 text-sm mt-1">{idError}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Label</label>
                                <input
                                    className="border p-2 w-full rounded"
                                    data-testid="Node label for test add Node"
                                    placeholder="Enter node label"
                                    value={nodeLabel}
                                    onChange={(e) => setNodeLabel(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Parent ID {" "}
                                    <span className="text-red-500">(if not root - mandatory with hierarchy layout)</span>
                                </label>
                                <select
                                    className="border p-2 w-full rounded"
                                    data-testid="Node parentID for test add Node"
                                    value={parentID}
                                    onChange={(e) => setParentID(e.target.value)}
                                >
                                    <option value="">No parent</option>
                                    {graphData.nodes
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
                                <label className="block mb-1 font-medium">Additional properties</label>
                                <input
                                    data-testid="Additional properties"
                                    className="border p-2 w-full rounded"
                                    placeholder="Enter additional properties, separate by ;  e.g., age:30;city:NY"
                                    value={additionalProperties}
                                    onChange={(e) => setAdditionalProperties(e.target.value)}
                                />
                            </div>

                            {/* Color */}
                            <div className="mb-3 flex items-center gap-2">
                                <label className="text-sm">Color:</label>
                                <input
                                    type="color"
                                    data-testid="Node color"
                                    value={nodeColor}
                                    onChange={(e) => setNodeColor(e.target.value)}
                                />
                            </div>

                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <></>
            )
        }
    }

    const renderAddEdge = (actionType: string) => {
        if (actionType === "Add Edge" || actionType === "Add Both") {
            return (
                <div className="addEdge">
                    <h2 className="font-semibold mb-2 ">Edge{" "}</h2>
                    <div className="space-y-3 mb-4 ">
                        <div>
                            <label className="block mb-1 font-medium">Source Node</label>
                            <select
                                data-testid="Source node test add edge"
                                className="border p-2 w-full rounded"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            >
                                <option value="">Select Source</option>
                                {nodeOptions
                                    .slice() 
                                    .sort((a, b) => {
                                        const labelA = a.label ? a.label.toLowerCase() : a.id.toLowerCase();
                                        const labelB = b.label ? b.label.toLowerCase() : b.id.toLowerCase();
                                        return labelA.localeCompare(labelB);
                                    })
                                    .map((n) => (
                                        <option key={n.id} value={n.id}>
                                            {n.label ? `${n.label} (id: ${n.id})` : n.id}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Target Node</label>
                            <select
                                data-testid="Target node test add edge"
                                className="border p-2 w-full rounded"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                            >
                                <option value="">Select Target</option>
                                {nodeOptions
                                    .slice() 
                                    .sort((a, b) => {
                                        const labelA = a.label ? a.label.toLowerCase() : a.id.toLowerCase();
                                        const labelB = b.label ? b.label.toLowerCase() : b.id.toLowerCase();
                                        return labelA.localeCompare(labelB);
                                    })
                                    .map((n) => (
                                        <option key={n.id} value={n.id}>
                                            {n.label ? `${n.label} (id: ${n.id})` : n.id}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Edge Value</label>
                            <input
                                type="number"
                                data-testid="Edge value test add edge"
                                className="border p-2 w-full rounded"
                                placeholder="Enter value"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Relationship</label>
                            <input
                                type="string"
                                data-testid="Relationship test add edge"
                                className="border p-2 w-full rounded"
                                placeholder="Enter relationship"
                                value={relationship}
                                onChange={(e) => setRelationship(e.target.value)}
                            />
                        </div>

                    </div>

                    {/* Color */}
                    <div className="mb-3 flex items-center gap-2">
                        <label className="text-sm">Color:</label>
                        <input
                            type="color"
                            data-testid="Color test add edge"
                            value={color}
                            onChange={e => setEdgeColor(e.target.value)}
                        />
                    </div>

                    {/* Arrow shape */}
                    <div className="mb-3 flex items-center gap-2">
                        <label className="text-sm">Arrow:</label>
                        <select
                            data-testid="Arrow shape test add edge"
                            className="border rounded p-1 text-sm"
                            value={arrowShape}
                            onChange={e => setArrowShape(e.target.value)}
                        >
                            <option value="triangle">Triangle</option>
                            <option value="diamond">Diamond</option>
                            <option value="circle">Circle</option>
                            <option value="vee">Vee</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                </div>
            )
        } else {
            return (
                <></>
            )
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-auto z-50">
            <div className="modal-container bg-white p-6 rounded-lg w-[500px] shadow-lg">
                <h1 className="text-lg font-bold mb-4">Add Node</h1>
                <div>
                    <label className="block mb-1 font-medium">Select action type {" "}
                    </label>
                    <select
                        data-testid="action-type-select"
                        className="border p-2 w-full rounded"
                        value={actionType}
                        onChange={(e) => selectActionType(e)}
                    >
                        <option value="">No Action Type</option>
                        <option key="addNode" value="Add Node">Add node</option>
                        {!hierarchyEnable && (
                            <>
                                <option key="addEdge" value="Add Edge">Add edge</option>
                                <option key="addBoth" value="Add Both">Add node + edge</option>
                            </>
                        )}
                    </select>
                </div>
                <br></br>

                {renderAddNode(actionType)}
                {renderAddEdge(actionType)}
                {/* Buttons */}
                <div className="flex gap-2 justify-end">
                    <button
                        className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${idError ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={addNode}
                        disabled={!!idError}
                    >
                        Add
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

export default AddNodeModal
