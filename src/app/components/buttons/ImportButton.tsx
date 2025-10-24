'use client'
import React, { useRef, ChangeEvent, useState, useEffect } from 'react'
import { updateData } from '../../store/features/graphDataSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Data, Link } from '../../types/dataGraph'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import toast from "react-hot-toast";
import { updateForward, updateBackward } from '../../store/features/actionHistorySlice';


type ImportButtonProps = {
    isButtonEnable: boolean;
    setIsReadyToGraph: (arg: boolean) => void;
}

const ImportButton = ({ isButtonEnable, setIsReadyToGraph }: ImportButtonProps) => {
    const data = useSelector((state: RootState) => state.graphData.value);
    
    const [uploadError, setUploadError] = useState('')
    const uploadRef = useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()
    const hierarchyEnable = useSelector((state: RootState) => state.hierarchyEnable.value);
    const backwardArray = useAppSelector(state => state.actionHistory.backward);
    let changeableBackwardArray = structuredClone(backwardArray);

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

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                const contents = event?.target?.result as string

                const parsed: Data = JSON.parse(contents)

                // Validate nodes
                if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
                    throw new Error('Invalid data: "nodes" must be an array')
                }
                parsed.nodes.forEach(n => {
                    if (!n.id) throw new Error('Each node must have an "id"')
                    if (!n.label) throw new Error('Each node must have an "label"')
                })

                // Validate links
                if (!parsed.links || !Array.isArray(parsed.links) && !hierarchyEnable) {
                    parsed.links = []
                }

                const nodeIds = parsed.nodes.map(n => n.id)
                type ArrowShape = '' | 'triangle' | 'circle' | 'diamond' | 'vee' | 'none';
                const validArrowShapes: ArrowShape[] = ['triangle', 'circle', 'diamond', 'vee', 'none'];

                if (hierarchyEnable) {
                    const nodeIds = parsed.nodes.map((n) => n.id);
                    const rootNodes = parsed.nodes.filter(n => n.parentID === null || n.parentID === undefined || n.parentID === "null");

                    if (rootNodes.length === 0) {
                        toast.error(
                            "No root node found! Please set one node as 'No parent' (parentID = null) before rendering hierarchy.",
                            {
                                duration: 5000,
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
                        setUploadError('Hierarchy file must contain at least one root node (parentID = null)');
                        setTimeout(() => setUploadError(''), 5000); 
                        setIsReadyToGraph(false);
                        return;
                    }
                    parsed.nodes.forEach((n) => {
                        if (n.parentID && !nodeIds.includes(n.parentID)) {
                            throw new Error(`ParentID "${n.parentID}" does not exist for node "${n.id}"`);
                            }
                        if (n.parentID) {
                            parsed.links.push({
                                target: n.id,
                                source: n.parentID,
                                relationship: 'parent-child',
                                arrowShape: 'none',
                            } as Link);
                            } else if (n.parentID && !nodeIds.includes(n.parentID)) {
                            console.warn(`Skipping link: parentID "${n.parentID}" not found for node "${n.id}"`);
                            }
                    });
                } else {
                    parsed.links.forEach(l => {
                        if (!l.source || !l.target) throw new Error('Each link must have source and target')
                        if (!nodeIds.includes(l.source as string)) throw new Error(`Link source "${l.source}" does not exist`)
                        if (!nodeIds.includes(l.target as string)) throw new Error(`Link target "${l.target}" does not exist`)
                        //if the arrow shape does not exist => trianglel. 
                        const shape: ArrowShape = (l.arrowShape as ArrowShape) || 'triangle';
                        if (!validArrowShapes.includes(shape)) {
                            throw new Error(`Link arrow shape "${l.arrowShape}" does not exist`);
                        }
                    })
                }

                //console.log('original data:', data)
                if (data === ''){
                    changeableBackwardArray.push(JSON.stringify({ nodes: [], links: [] }));
                }else{
                    changeableBackwardArray.push(data);
                }
                dispatch(updateBackward(changeableBackwardArray));
                dispatch(updateForward([]));
                dispatch(updateData(JSON.stringify(parsed)))
                setUploadError('')
                setIsReadyToGraph(true)
                toast.success("File imported successfully", { duration: 3000 })
            } catch (err: any) {
                console.error('Import failed', err)
                toast.error('Import failed', err?.message ?? 'Invalid file or not a valid JSON graph')
                setUploadError(err?.message ?? 'File is invalid or not JSON')
                setTimeout(() => setUploadError(''), 5000); 
                setIsReadyToGraph(false)
            } finally {
                e.target.value = ''
        }
    }
        reader.readAsText(file)
    }

    return (
        <>
            <button
                data-testid="test-import-button"
                type="button"
                disabled={!isButtonEnable}
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => uploadRef.current?.click()}
            >
                Import file
            </button>

            <input
                data-testid="test-import-file"
                type="file"
                ref={uploadRef}
                onChange={handleUpload}
                style={{ display: 'none' }}
            />

            {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
        </>
    )
}

export default ImportButton
