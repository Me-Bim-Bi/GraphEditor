'use client'

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAppDispatch } from '../store/hooks';
import { updateHierarchyEnable } from '../store/features/hierarchyEnableSlice';
import { updateAnalysisModalOpen } from '../store/features/buttonsEnableSlice';
import { Data } from '../types/dataGraph';
import AddNodeModal from './modals/AddNodeModal';
import EditNodeModal from './modals/EditNodeModal';
import EditEdgeModal from './modals/EditEdgeModal';
import AnalysisModal from './modals/AnalysisModal';


type MyGraphProps = {
    width?: number;
    height?: number;
    type: string; // "h" = hierarchy, otherwise force-directed
    onCyReadyAction?: (cy: cytoscape.Core) => void
}
type Action = {
    name: string;
    modal: React.ReactNode;
    enabled: boolean;
    onClick: () => void;
};

export const MyGraph = ({ width, height, type, onCyReadyAction }: MyGraphProps) => {
    const [openModals, setOpenModals] = useState({
        addNode: false,
        addEdge: false,
        removeNode: false,
        removeEdge: false,
        editNode: false,
        editEdge: false,
    });
    const [nodeId, setNodeId] = useState('')
    const [edgeId, setEdgeId] = useState('')
    const [nodeCount, setNodeCount] = useState(0)
    const [edgeCount, setEdgeCount] = useState(0)
    const data = useSelector((state: RootState) => state.graphData.value)
    const dispatch = useAppDispatch()

    const containerRef = useRef<HTMLDivElement>(null)
    const cyRef = useRef<cytoscape.Core | null>(null)

    const buttonEnable = useSelector((state: RootState) => state.buttonEnable.value);
    const hierarchyEnable = useSelector((state: RootState) => state.hierarchyEnable.value);
    const analysisIsOpen = useSelector((state: RootState) => state.buttonEnable.analysisModalOpen);
    const nodeFilter = useSelector((state: RootState) => state.nodeFilter.value);

    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Node[] | null>(null)
    


    useEffect(() => {
        dispatch(updateHierarchyEnable(type === 'h'))
    }, [type, dispatch])


    const handleEmptyGraph = () => {
        if (data === "") {
            setOpenModals({ ...openModals, addNode: true })
        }
    }
    
    //autosave
    useEffect(() => {
        if (!data) return;

        const interval = setInterval(async () => {
            try {
                const parsed: Data = JSON.parse(data)
                const response = await fetch('/api/import-graph', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(parsed),
                });

                if(!response.ok){
                    const errText = await response.text();
                    throw new Error(`Server responded with ${response.status}: ${errText}`);
                    }

                //const result = await response.text();
                toast.success("Autosave to database successful", { duration: 1500 });
            } catch (err) {
                toast.error("Autosave failed, cannot connect to Neo4j or invalid response");
                console.error("Auto save failed", err);
            }
            }, 30000);

            return () => clearInterval(interval);
    }, [data]);

    useEffect(() => {
        if (!cyRef.current) return

        const cy = cyRef.current

        cy.elements().removeClass('highlight')

        const graphData: Data = data ? JSON.parse(data) : { nodes: [], links: [] }
        const graphDataSet = new Set(graphData.nodes.map(n => n.label))
        const filterSet = new Set(nodeFilter)
        const filteredName = graphDataSet.intersection(filterSet)
        const filteredNodes = graphData.nodes.filter(n => filteredName.has(n.label))
        filteredNodes.forEach(n => {
            const ele = cy.$id(n.id)
            if (ele.nonempty()) ele.addClass('highlight')
        })
        filteredNodes.forEach((sourceNode)=>{
            filteredNodes.forEach((targetNode) => {
                if(sourceNode.id === targetNode.id) return;
                const edge = cy.$(`edge[source = "${sourceNode.id}"][target = "${targetNode.id}"]`);
                if(edge.nonempty()) edge.addClass('highlight');
            })
        })
    }, [nodeFilter]);


    
    useEffect(() => {
        if (!containerRef.current || !data) return

        // Destroy old Cytoscape instance
        if (cyRef.current) {
            cyRef.current.destroy()
            cyRef.current = null
        }

        const ro = new ResizeObserver(() => {
            if (cyRef.current) {
                cyRef.current.resize();
                cyRef.current.fit();
            }
        });

        ro.observe(containerRef.current);

        const dataGraph: Data = JSON.parse(data)

        const values = dataGraph.nodes.map(n => n.value || 0);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        const minSize = 30;
        const maxSize = 100;

        const getNodeSize = (value?: number) => {
            if (value === undefined || isNaN(value)) return minSize;
            if (maxValue === minValue) return (minSize + maxSize) / 2; 
            const normalized = (value - minValue) / (maxValue - minValue);
            return minSize + normalized * (maxSize - minSize);
        };

        const getColor = (baseHex: string, value?: number) => {
            const hex = baseHex.replace('#', '');
            const r = (parseInt(hex, 16) >> 16) & 255;
            const g = (parseInt(hex, 16) >> 8) & 255;
            const b = parseInt(hex, 16) & 255;

            if (value === undefined || maxValue === minValue) {
                return `rgb(${r},${g},${b})`;
            }

            const normalized = (value - minValue) / (maxValue - minValue);

            const lightFactor = 0.5; 
            const factor = lightFactor + (1-lightFactor) * (normalized);

            const clamp = (val: number) => Math.max(0, Math.min(255, val));

            const newR = clamp(Math.round(r * factor));
            const newG = clamp(Math.round(g * factor));
            const newB = clamp(Math.round(b * factor));

            return `rgb(${newR},${newG},${newB})`;
        };



        const cyNodes = dataGraph.nodes.map(n => {
            const color = getColor(n?.color || '#4edff2', n?.value);
            const size = getNodeSize(n.value);

            return {
                data: {
                    id: n.id,
                    label: n.label,
                    labelId: `${n.label} (id: ${n.id})`,
                    color,
                    width: size,
                    height: size,
                },
            };
        });

        // Build edges
        let cyEdges: any[] = []
        if (type === 'h') {
            const nodes = dataGraph.nodes || [];
            const links = dataGraph.links || [];

            if (nodes.length === 0) {
                toast("Canvas is empty. You can start adding nodes freely.");
                cyEdges = [];
            } else {
                const rootNodes = nodes.filter(n => !n.parentID);
                const nodeIds = nodes.map(n => n.id);

                if (rootNodes.length === 0) {
                    toast.error(
                        "No root node found! Please set one node as 'No parent' (parentID = null) before rendering hierarchy.",
                        {
                            duration: 8000,
                            style: {
                                background: '#ff4d4f',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                padding: '16px',
                                borderRadius: '8px',
                            },
                        }
                    );
                    return;
                }
                cyEdges = nodes
                    .filter(n => n.parentID)
                    .map(n => {
                        if(!nodeIds.includes(n.parentID)){
                            toast.error(`Node "${n.label}" has invalid parentID "${n.parentID}"! 
                                This edge will not be created.`,
                        { duration: 8000 })
                        return null;
                        }
                        
                        const existingEdge = links.find(
                            l => l.source === n.parentID && l.target === n.id
                        );
                        return {
                            data: {
                                id: `e-${n.parentID}-${n.id}`,
                                source: n.parentID!,
                                target: n.id,
                                value: existingEdge?.value || 1,
                                label: existingEdge?.relationship
                                    ? `${existingEdge.relationship} (${existingEdge.value ?? ''})`
                                    : existingEdge?.value?.toString() || 'parent-child',
                                color: existingEdge?.color || '#999',
                                arrowShape: existingEdge?.arrowShape || 'triangle',
                            },
                        };
                    });
            }

        } else {
            // force: use normal links. 
            cyEdges = dataGraph.links.map((l, idx) => ({
                data: {
                    id: `e-${idx}-${l.source}-${l.target}`,
                    source: l.source,
                    target: l.target,
                    value: l?.value || 1,
                    label: l?.relationship
                        ? `${l.relationship} (${l.value ?? ''})`
                        : l?.value?.toString() || '',
                    color: l.color || '#999',
                    arrowShape: l.arrowShape || 'triangle',
                },
            }))
        }

        const elements = [...cyNodes, ...cyEdges]
        setNodeCount(cyNodes.length)
        setEdgeCount(cyEdges.length)
        // Cytoscape init
        const cy = cytoscape({
            container: containerRef.current,
            elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        label: 'data(labelId)',
                        'background-color': 'data(color)',
                        'border-color': '#ffffff',
                        'border-width': 1,
                        color: '#123456',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'font-size': 12,
                        'width': (ele) => ele.data('width') || 40,
                        'height': (ele) => ele.data('height') || 40,
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        width: 2,
                        'line-color': 'data(color)',
                        'target-arrow-color': 'data(color)',
                        'target-arrow-shape': (ele) => ele.data('arrowShape') || 'triangle',
                        'curve-style': 'bezier',
                        label: 'data(label)',
                        'font-size': 10,
                        'color': '#555',
                        'text-rotation': 'autorotate',
                        'text-background-opacity': 0.8,
                        'text-background-color': '#fff',
                        'text-background-shape': 'roundrectangle',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'text-margin-x': 0,
                        'text-margin-y': 0,
                    },
                },
                {
                    selector: 'node.highlight',
                    style: {
                        'background-color': 'green',
                        'border-color': 'red',
                        'border-width': 3,
                        'transition-property': 'background-color, border-color',
                        'transition-duration': 0.5,
                    },
                },
                {
                    selector: 'edge.highlight',
                    style: {
                        'line-color': 'red',
                        'target-arrow-color': 'red',
                        'width': 4,
                        'transition-property': 'line-color, target-arrow-color, width',
                        'transition-duration': 0.5,
                    },
                },
            ],
            layout:
                type === 'h'
                    ? {
                        name: 'breadthfirst', // hierarchy layout
                        directed: true,
                        padding: 10,
                        spacingFactor: 1.5,
                        animate: true,
                    }
                    : {
                        name: 'cose', // force-directed layout
                        animate: true,
                    },
            wheelSensitivity: 0.2,
            userZoomingEnabled: true,
            userPanningEnabled: true,
        })

        cy.on('tap', 'node', function (event) {
            const node = event.target;
            setNodeId(node._private.data.id)
            setOpenModals(prev => ({ ...prev, editNode: true }))
        });
        cy.on('tap', 'edge', function (event) {
            const edge = event.target;
            setEdgeId(edge._private.data.id)
            if (!hierarchyEnable) {
                setOpenModals(prev => ({ ...prev, editEdge: true }))
            }
        });
        cy.on('tap', function (event) {
            const evtTarget = event.target;
            if (evtTarget === cy) {
                setOpenModals(prev => ({ ...prev, addNode: true }))
            }
        });

        // Enable drag of nodes (only for force layout)
        if (type !== 'h') {
            cy.nodes().grabify() // allow grabbing
        } else {
            cy.nodes().ungrabify() // disable dragging in hierarchy
        }

        cyRef.current = cy
        
        if (onCyReadyAction) onCyReadyAction(cy)

        return () => {
            cy.destroy()
            cyRef.current = null
            ro.disconnect();
        }
    }, [data, width, height, type])

    const actions: Action[] = [
        {
            name: 'Add node/edge',
            modal: <AddNodeModal isOpen={openModals.addNode} onClose={() => setOpenModals(prev => ({ ...prev, addNode: false }))} />,
            enabled: buttonEnable,
            onClick: () => setOpenModals(prev => ({ ...prev, addNode: true })),
        },
        {
            name: 'Edit node',
            modal: <EditNodeModal isOpen={openModals.editNode} nodeId={nodeId} onClose={() => setOpenModals(prev => ({ ...prev, editNode: false }))} />,
            enabled: buttonEnable,
            onClick: () => setOpenModals({ ...openModals, editNode: true }),
        },
        {
            name: 'Edit edge',
            modal: <EditEdgeModal isOpen={openModals.editEdge} edgeId={edgeId} onClose={() => setOpenModals(prev => ({ ...prev, editEdge: false }))} />,
            enabled: buttonEnable,
            onClick: () => setOpenModals({ ...openModals, editEdge: true }),
        },
        {
            name: 'Analysis result',
            modal: <AnalysisModal isOpen={analysisIsOpen} onClose={() => dispatch(updateAnalysisModalOpen(false))} />,
            enabled: false,
            onClick: () => {
                dispatch(updateAnalysisModalOpen(false));
            },
        }
    ];
    
    // Handle node search
    const handleSearch = () => {
        if (!cyRef.current) return;
        const cy = cyRef.current;

        cy.elements().removeClass('highlight');

        const value = searchQuery.trim();
        if (!value) {
            setSearchResults(null);
            return;
        }

        const graphData: Data = data ? JSON.parse(data) : { nodes: [], links: [] };
        const filtered = graphData.nodes.filter(n =>
            n.label.toLowerCase().includes(value.toLowerCase()) || n.id.toLowerCase().includes(value.toLowerCase()) 
        );

        setSearchResults(filtered.length > 0 ? filtered : []);

        filtered.forEach(n => {
            const ele = cy.$id(n.id);
            if (ele.nonempty()) ele.addClass('highlight');
        });

        if (filtered.length > 0) {
            cy.animate({
                center: { eles: cy.$id(filtered[0].id) },
                zoom: 1.1,
                duration: 800
            });
        }
    };

    if (!type) return <div className="w-full h-full flex items-center justify-center text-gray-500">You need to choose the layout first</div>

    return (
        <div className="relative w-full h-full">
            <Toaster position="top-right" />
            <div className="absolute top-4 right-4 z-50 bg-white border rounded px-3 py-1 shadow-sm text-sm">
                Nodes: {nodeCount} | Edges: {edgeCount}
            </div>

            {/* Search Input */}
            <div className="absolute top-4 left-4 z-50 w-64">
                <div className="flex">
                    <input
                    type="text"
                    placeholder="Search node..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="py-2 px-3 w-full border rounded-l shadow-sm"
                    />
                    <button
                    onClick={() => handleSearch()}
                    className="p-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 flex items-center justify-center"
                    >
                    🔍
                    </button>
                </div>

                {searchResults && searchResults.length === 0 && (
                    <div className="text-red-500 text-sm mt-1">Node not found</div>
                )}
            </div>
            {/* Actions modals */}
            {actions.map((action) => (
                <React.Fragment key={action.name}>{action.modal}</React.Fragment>
            ))}

            {/* Graph container */}
            <div
                onClick={handleEmptyGraph}
                ref={containerRef}
                className="w-full h-full "
            />
        </div>
    )
}

export default MyGraph
