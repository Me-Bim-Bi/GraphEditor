import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { updateNodeFilter } from '../../store/features/nodeFilterSlice';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateBackward, updateForward } from '../../store/features/actionHistorySlice';
import { Data } from '../../types/dataGraph';
import { updateData } from '../../store/features/graphDataSlice';


export default function SubstractParentAction() {
    const data = useSelector((state: RootState) => state.graphData.value);
    const dispatch = useAppDispatch()
    const backwardArray = useAppSelector(state => state.actionHistory.backward);
    let changeableBackwardArray = structuredClone(backwardArray);
    const isButtonEnable = useSelector((state: RootState) => state.buttonEnable.value);
    const [isReadyToGraph, setIsReadyToGraph] = useState(false);
    const [selectedParent, setSelectedParent] = useState('');
    const hierarchyEnable = useSelector((state: RootState) => state.hierarchyEnable.value);

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
    const getSubtreeNodes = (parentId: string, nodes: Data['nodes']): string[] => {
        const children = nodes.filter(n => n.parentID === parentId);

        let allChildrenIds: string[] = [];

        for (const child of children) {
            allChildrenIds.push(child.id);
            allChildrenIds.push(...getSubtreeNodes(child.id, nodes));
        }

        console.log(`Parent ${parentId} children →`, allChildrenIds);
        return allChildrenIds;
    };

    const handleFindChildren = (parentId: string) => {
        if (!parentId) {
            toast.error("Please enter a parent node ID");
            return;
        }

        const dataObject: Data = data ? JSON.parse(data) : { nodes: [], links: [] };

        // Find all children
        const subtreeNodeIds = [parentId, ...getSubtreeNodes(parentId, dataObject.nodes)];

        if (subtreeNodeIds.length <= 1) {
            toast.error("No children found for this node");
            return;
        }

        const filteredNodes = dataObject.nodes.filter(n => subtreeNodeIds.includes(n.id));
        const labels = filteredNodes.map(n => n.label);
        dispatch(updateNodeFilter(labels));

        toast.success(`Found ${filteredNodes.length - 1} children for node ${parentId}`);
    };

    const handleSubGraphByParent = (parentId: string) => {
        changeableBackwardArray.push(data);
        dispatch(updateBackward(changeableBackwardArray));
        dispatch(updateForward([]));
        if (!parentId) {
            toast.error("Please provide a valid parent ID");
            return;
        }
        const dataObject: Data = data ? JSON.parse(data) : { nodes: [], links: [] };
        const selectedNode = dataObject.nodes.find(n => n.id === parentId);
        if (!selectedNode) {
            toast.error("Node not found");
            return;
        }
        if (hierarchyEnable) {
            // If the node have parent ID => alert and no render more
            if (selectedNode.parentID) {
                toast.error(
                    `Node "${selectedNode.label}" is not a root node. Please change its parentID to null (make it a root) before creating subgraph.`,
                    { duration: 7000 }
                );
                return;
            }
        }
        const subtreeNodeIds = [parentId, ...getSubtreeNodes(parentId, dataObject.nodes)];
        const filteredNodes = dataObject.nodes.filter(n => subtreeNodeIds.includes(n.id));
        const filteredLinks = dataObject.links.filter(
            l => subtreeNodeIds.includes(l.source as string) && subtreeNodeIds.includes(l.target as string)
        );

        const subGraph = { nodes: filteredNodes, links: filteredLinks };
        dispatch(updateData(JSON.stringify(subGraph)));

        const labels = filteredNodes.map(n => n.label);
        dispatch(updateNodeFilter(labels));

        toast.success(`Subgraph created successfully for root "${selectedNode.label}"`);
    };

    return (
        <>
            <div className="flex flex-col gap-y-2">
                <input
                    type="text"
                    placeholder="Parent Node ID"
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <button
                    onClick={() => handleFindChildren(selectedParent)}
                    disabled={!isButtonEnable || !isReadyToGraph}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                    Find Children
                </button>

                <button
                    onClick={() => handleSubGraphByParent(selectedParent)}
                    disabled={!isButtonEnable || !isReadyToGraph}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                    Subtract Parent-Child Graph
                </button>
            </div>
        </>
    )
}