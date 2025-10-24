import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toast from 'react-hot-toast';

import ImportButton from '../buttons/ImportButton';

jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: { error: jest.fn(), success: jest.fn() },
    Toaster: () => <div data-testid="toaster" />,
}));

const mockStore = configureMockStore();

describe('ImportButton', () => {
    let store: ReturnType<typeof mockStore>;
    let setIsReadyToGraph: jest.Mock;

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        setIsReadyToGraph = jest.fn();
        store = mockStore({
        graphData: { value: JSON.stringify({ nodes: [], links: [] }) },
        hierarchyEnable: { value: true },
        actionHistory: { backward: [], forward: [] },
        });
        jest.clearAllMocks();
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });

    const mockFile = (content: string, name = 'test.json') =>
        new File([content], name, { type: 'application/json' });

    const mockFileReader = (text: string) => {
        const mock = {
        readAsText: jest.fn(function () {
            this.onload?.({ target: { result: text } });
        }),
        };
        (global as any).FileReader = jest.fn(() => mock);
        return mock;
    };

    const renderImportButton = () =>
        render(
        <Provider store={store}>
            <ImportButton isButtonEnable={true} setIsReadyToGraph={setIsReadyToGraph} />
        </Provider>
        );

    const uploadFile = (container: HTMLElement, content: string) => {
        mockFileReader(content);
        const input = container.querySelector('input[type="file"]')!;
        const file = mockFile(content);
        fireEvent.change(input, { target: { files: [file] } });
    };

    it('renders import button', () => {
        renderImportButton();
        expect(screen.getByRole('button', { name: /Import file/i })).toBeInTheDocument();
    });

    it('imports valid JSON successfully in hierarchical graph, edge will be added automatically', async () => {
        const json = JSON.stringify({
            nodes: [
                { id: "1", label: "Alice", color: "#f50525" },
                { id: "2", label: "Bob", parentID: "1", color: "#0fa343" },
                { id: "3", label: "Eva", color: "#0fa343" },
            ],
            links: [],
        });

        const { container } = renderImportButton();
        uploadFile(container, json);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('File imported successfully', { duration: 3000 });
            expect(setIsReadyToGraph).toHaveBeenCalledWith(true);

            const actions = store.getActions()
            const updateAction = actions.find(a => a.type === 'graphData/updateData')
            expect (updateAction).toBeDefined()

            const updateGraph = JSON.parse(updateAction.payload)

            const addedNode1 = updateGraph.nodes.find(n => n.id === '1')
            expect(addedNode1).toBeDefined()
            expect(addedNode1.label).toBe('Alice')
            expect(addedNode1.color).toBe('#f50525')

            const addedNode2 = updateGraph.nodes.find(n => n.id === '2')
            expect(addedNode2).toBeDefined()
            expect(addedNode2.label).toBe('Bob')
            expect(addedNode2.color).toBe('#0fa343')
            expect(addedNode2.parentID).toBe('1')

            const addedNode3 = updateGraph.nodes.find(n => n.id === '3')
            expect(addedNode3).toBeDefined()
            expect(addedNode3.label).toBe('Eva')
            expect(addedNode3.color).toBe('#0fa343')

            const addedEdge = updateGraph.links.find(
                l => l.source === '1' && l.target === '2'
            )
            expect(addedEdge).toBeDefined()
            expect(addedEdge.relationship).toBe('parent-child')
            expect(addedEdge.arrowShape).toBe('none')
        })
    });

    it('shows error on invalid JSON', async () => {
        const { container } = renderImportButton();
        uploadFile(container, 'invalid json');

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
            expect(setIsReadyToGraph).toHaveBeenCalledWith(false);
        });
    });

    const invalidCases = [
        {
        name: 'node missing id',
        json: JSON.stringify({
            nodes: [{ label: 'Alice', color: '#f50525' }, { id: '2', label: 'Bob', parentID: '1', color: '#0fa343' }],
            links: [],
        }),
        errorMessage: 'Each node must have an "id"',
        },
        {
        name: 'node missing label',
        json: JSON.stringify({
            nodes: [{ id: '1', color: '#f50525' }, { id: '2', label: 'Bob', parentID: '1', color: '#0fa343' }],
            links: [],
        }),
        errorMessage: 'Each node must have an "label"',
        },
        {
        name: 'parentId does not exist',
        json: JSON.stringify({
            nodes: [{ id: '1', label: 'Alice', color: '#f50525' }, { id: '2', label: 'Bob', parentID: '5', color: '#0fa343' }],
            links: [],
        }),
        errorMessage: 'ParentID "5" does not exist for node "2"',
        }
    ];

    invalidCases.forEach(({ name, json, errorMessage }) => {
        it(`shows error for ${name}`, async () => {
            const { container } = renderImportButton();
            uploadFile(container, json);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Import failed', errorMessage);
                expect(setIsReadyToGraph).toHaveBeenCalledWith(false);
            });
        });
        
    });

    it('shows error for no root', async () => {
        const json = JSON.stringify({
            nodes: [
                { id: "1", label: "Alice", parentID: "2", color: "#f50525" },
                { id: "2", label: "Bob", parentID: "1", color: "#0fa343" }
            ],
            links: [],
        });

        const { container } = renderImportButton();     
        uploadFile(container, json);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
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
            expect(setIsReadyToGraph).toHaveBeenCalledWith(false);
        });
    });
});
