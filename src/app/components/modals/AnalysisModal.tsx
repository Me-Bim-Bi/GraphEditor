'use client'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { AnalysisData } from '../../types/analysisData'

type AnalysisModalProps = {
    isOpen: boolean,
    onClose: () => void
}

const AnalysisModal = ({ isOpen, onClose }: AnalysisModalProps) => {
    const data = useSelector((state: RootState) => state.graphData.value);
    const graphData = data ? JSON.parse(data) : { nodes: [], links: [] };
    let analysisData = graphData.nodes || [];
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="modal-container bg-white p-6 rounded-lg w-[500px] shadow-lg max-h-[80vh] overflow-y-auto">
                <h1 className="text-lg font-bold mb-4">Analysis result</h1>
                <div>
                    <table className="min-w-full mt-4 border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Node</th>
                                <th className="px-4 py-2">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysisData.map((n: AnalysisData, i: number) => (
                                <tr key={n.id}>
                                    <td className="px-4 py-2 text-center">{i + 1}</td>
                                    <td className="px-4 py-2">{n.label}</td>
                                    <td className="px-4 py-2 text-right">{n.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </ div>
    )
}

export default AnalysisModal
