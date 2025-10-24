'use client'
import React, { useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { selectGraphData } from '../../store/features/graphDataSlice'
import type cytoscape from 'cytoscape'
import toast, { Toaster } from "react-hot-toast";


type ExportButtonProps = {
    isButtonEnable: boolean
    isReadyToGraph: boolean
    cy: cytoscape.Core | null
}

const ExportButton = ({ isButtonEnable, isReadyToGraph, cy }: ExportButtonProps) => {
const json_data = useAppSelector(selectGraphData)
const [showModal, setShowModal] = useState(false)
const [fileName, setFileName] = useState('export')
const [format, setFormat] = useState<'json' |'graphml'| 'png'>('json')
const [savedFiles, setSavedFiles] = useState<string[]>([])

let parsedData: any
if (typeof json_data === 'string' && json_data.trim() !== '') {
    try {
        parsedData = JSON.parse(json_data)
    } catch (e) {
        console.error("Invalid JSON string:", e);
        parsedData = {}; 
    }
} else if (json_data) {
    parsedData = json_data
} else {
    parsedData = {}
}

const handleExport = () => {
    let baseName = fileName.trim() === '' ? 'export' : fileName.trim()
    let finalName = baseName
    let counter = 1

    //avoid double name
    while (savedFiles.includes(`${finalName}.${format}`)) {
        finalName = `${baseName}(${counter})`
        counter++
    }

    const fullFileName = `${finalName}.${format}`

    const nodes = parsedData.nodes || [];
    const edges = parsedData.links || [];

    if (nodes.length === 0 && edges.length === 0) {
        toast.error(`Cannot export ${format.toUpperCase()} because the graph is empty.`);
        return;
    }

    if (format === 'json') {
        const data = new Blob([JSON.stringify(parsedData, null, 2)], { type: "application/json" });
        const jsonURL = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = jsonURL;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (format == 'graphml'){
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n`
        xml += `  <graph id="G" edgedefault="directed">\n`

        // Export nodes
        for (const n of nodes) {
            const id = n.id
            const label = n.label || id
            xml += `    <node id="${id}">\n`
            xml += `      <data key="label">${label}</data>\n`
            if (n.color) xml += `      <data key="color">${n.color}</data>\n`
            if (n.parentID) xml += `      <data key="parentID">${n.parentID}</data>\n`
            xml += `    </node>\n`
        }

        // Export edges
        for (const e of edges) {
            const id = `${e.source}-${e.target}`  
            const source = typeof e.source === 'string' ? e.source : e.source.id
            const target = typeof e.target === 'string' ? e.target : e.target.id
            const label = e.relationship || ''
            const value = e.value || 1
            xml += `    <edge id="${id}" source="${source}" target="${target}">\n`
            xml += `      <data key="label">${label}</data>\n`
            xml += `      <data key="value">${value}</data>\n`
            if (e.color) xml += `      <data key="color">${e.color}</data>\n`
            if (e.arrowShape) xml += `      <data key="arrowShape">${e.arrowShape}</data>\n`
            xml += `    </edge>\n`
        }


        xml += `  </graph>\n</graphml>`

        const blob = new Blob([xml], { type: "application/xml" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = fullFileName
        link.click()
    }

    if (format === 'png') {
        if(!cy){
            toast.error(`Cannot export ${format.toUpperCase()} because the graph is empty.`);
            return;
        }
        const pngData = cy.png({
            full: true,
            scale: 3,
            bg: 'white' 
        })
        const link = document.createElement('a')
        link.href = pngData
        link.download = fullFileName
        link.click()
    }
}

return (
    <>
    <button
        type="button"
        disabled={!isButtonEnable || !isReadyToGraph}
        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        onClick={() => setShowModal(true)}
    >
        Export File
    </button>

    {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-center"
                data-testid="export-button"
            >Export File</h2>
                
            <div className="mb-3">
            <label className="block text-sm font-medium mb-1">File name:</label>
            <input
                type="text"
                
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-300"
                placeholder="Please insert file name (default: export)"
            />
            </div>

            <div className="mb-4">
            <label className="block text-sm font-medium mb-1">File format:</label>
            <select
                data-testid="export-file-format"
                value={format}
                onChange={(e) => setFormat(e.target.value as 'json' | 'png' | 'graphml')}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-300"
            >
                <option value="json">JSON (.json)</option>
                <option value="png">PNG (.png)</option>
                <option value="graphml">GraphML (.graphml)</option>
            </select>
            </div>

            <div className="flex justify-end gap-2">
            <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300"
            >
                Cancel
            </button>
            <button
                onClick={() => {handleExport(); setShowModal(false);}}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
                Save
            </button>
            </div>
        </div>
        </div>
    )}
    </>
)
}

export default ExportButton