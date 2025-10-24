import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toast from 'react-hot-toast';
import '@testing-library/jest-dom';

import AddNodeModal from '../modals/AddNodeModal'

jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: { error: jest.fn(), success: jest.fn() },
    Toaster: () => <div data-testid="toaster" />
    }))
const mockStore = configureMockStore(); 
const baseStore = {
    graphData: { value: JSON.stringify({ nodes: [], links: [] }) },
    actionHistory: { backward: [], forward: [] },
    hierarchyEnable: { value: true },
    };

describe('AddNodeModal', () => {
    it('renders modal when isOpen=true, close all add edge modal with hierarchical graph', async () => {
        const store = mockStore(baseStore)
        render(
        <Provider store={store}>
            <AddNodeModal isOpen={true} onClose={() => {}} />
        </Provider>
        );

        const allOptions = screen.getAllByRole('option');

        const addNodeOption = allOptions.find(o => o.textContent === 'Add node');
        const addEdgeOption = allOptions.find(o => o.textContent === 'Add edge');
        const addBothOption = allOptions.find(o => o.textContent === 'Add node + edge');

        expect(addNodeOption).toBeDefined();
        expect(addEdgeOption).toBeUndefined();
        expect(addBothOption).toBeUndefined();    
    });

    it('does not render modal when isOpen=false', () => {
        const store = mockStore(baseStore)
        render(
        <Provider store={store}>
            <AddNodeModal isOpen={false} onClose={() => {}} />
        </Provider>
        );

        expect(screen.queryByText(/Add Node/i)).toBeNull();
    });

    it('add a node with valid input data', () => {
        const store = mockStore(baseStore)
        render(
        <Provider store={store}>
            <AddNodeModal isOpen={true} onClose={() => {}} />
        </Provider>
        )
            fireEvent.change(screen.getByTestId('action-type-select'), {
                target: { value: 'Add Node' }
            })
            fireEvent.change(screen.getByTestId(/Node ID for test add Node/i), {
                target: { value: '1' }
            })
            fireEvent.change(screen.getByTestId(/Node label for test add Node/i), {
                target: { value: 'Node 1' }
            })
            fireEvent.change(screen.getByTestId(/Additional properties/i), {
                target: { value: 'test' }
            })
            fireEvent.change(screen.getByTestId(/Node color/i), {
                target: { value: '#0fa343' }
            })

            fireEvent.click(screen.getByText('Add'))

            const actions = store.getActions()
            const updateAction = actions.find(a => a.type === 'graphData/updateData')
            expect (updateAction).toBeDefined()

            const updateGraph = JSON.parse(updateAction.payload)
            const addedNode = updateGraph.nodes.find(n => n.id === '1')
            expect(addedNode).toBeDefined()
            expect(addedNode.label).toBe('Node 1')
            expect(addedNode.textList).toStrictEqual(["test"])
            expect(addedNode.color).toBe('#0fa343')
    });

    it('add a node which will be a child to the current node to show that an egde will be built automatically between them', () => {
        const store = mockStore({
            ...baseStore,
            graphData: {
            value: JSON.stringify({
                nodes: [
                { id: '1', label: 'Node 1' },
                ],
                links: []
            })
            }
        })
        render(
        <Provider store={store}>
            <AddNodeModal isOpen={true} onClose={() => {}} />
        </Provider>
        )
            fireEvent.change(screen.getByTestId('action-type-select'), {
                target: { value: 'Add Node' }
            })

            fireEvent.change(screen.getByTestId(/Node ID for test add Node/i), {
                target: { value: '2' }
            })
            fireEvent.change(screen.getByTestId(/Node label for test add Node/i), {
                target: { value: 'Node 2' }
            })
            fireEvent.change(screen.getByTestId(/Node parentID for test add Node/i), {
                target: { value: '1' }
            })
            fireEvent.change(screen.getByTestId(/Additional properties/i), {
                target: { value: 'test' }
            })
            fireEvent.change(screen.getByTestId(/Node color/i), {
                target: { value: '#0fa343' }
            })
            
            fireEvent.click(screen.getByText('Add'))

            const actions = store.getActions()
            const updateAction = actions.find(a => a.type === 'graphData/updateData')
            expect (updateAction).toBeDefined()

            const updateGraph = JSON.parse(updateAction.payload)
            const addedNode = updateGraph.nodes.find(n => n.id === '2')
            expect(addedNode).toBeDefined()
            expect(addedNode.label).toBe('Node 2')
            expect(addedNode.textList).toStrictEqual(["test"])
            expect(addedNode.color).toBe('#0fa343')

            const addedEdge = updateGraph.links.find(
                l => l.source === '1' && l.target === '2'
            )
            expect(addedEdge).toBeDefined()
            expect(addedEdge.value).toBe(1)
            expect(addedEdge.relationship).toBe('parent-child')
            expect(addedEdge.color).toBe('#929296')
            expect(addedEdge.arrowShape).toBe('triangle')
            })

    it('add a node with invalid input data - no ID', async () => {
        const store = mockStore(baseStore)
        render(
        <Provider store={store}>
            <AddNodeModal isOpen={true} onClose={() => {}} />
        </Provider>
        )
            fireEvent.change(screen.getByTestId('action-type-select'), {
                target: { value: 'Add Node' }
            })
            fireEvent.change(screen.getByTestId(/Node label for test add Node/i), {
                target: { value: 'Node 1' }
            })
            fireEvent.change(screen.getByTestId(/Additional properties/i), {
                target: { value: 'test' }
            })
            fireEvent.change(screen.getByTestId(/Node color/i), {
                target: { value: '#0fa343' }
            })

            fireEvent.click(screen.getByText('Add'))

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Node ID and Label are mandatory');
            });
    });

    it('add a node with invalid input data - no label', async () => {
        const store = mockStore(baseStore)
        render(
        <Provider store={store}>
            <AddNodeModal isOpen={true} onClose={() => {}} />
        </Provider>
        )   
            fireEvent.change(screen.getByTestId('action-type-select'), {
                target: { value: 'Add Node' }
            })
            fireEvent.change(screen.getByTestId(/Node ID for test add Node/i), {
                target: { value: '1' }
            })
            fireEvent.change(screen.getByTestId(/Additional properties/i), {
                target: { value: 'test' }
            })
            fireEvent.change(screen.getByTestId(/Node color/i), {
                target: { value: '#0fa343' }
            })

            fireEvent.click(screen.getByText('Add'))

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Node ID and Label are mandatory');
            });
    });

    it('add a node with a node ID already exist', async () => {
        const store = mockStore({
            ...baseStore,
            graphData: {
            value: JSON.stringify({
                nodes: [
                { id: '1', label: 'Node 1' },
                ],
                links: []
            })
            }
        })
        render(
        <Provider store={store}>
            <AddNodeModal isOpen={true} onClose={() => {}} />
        </Provider>
        )
            fireEvent.change(screen.getByTestId('action-type-select'), {
                target: { value: 'Add Node' }
            })
            fireEvent.change(screen.getByTestId(/Node ID for test add Node/i), {
                target: { value: '1' }
            })
            fireEvent.change(screen.getByTestId(/Node label for test add Node/i), {
                target: { value: 'Node 2' }
            })

            await waitFor(() => {
                expect(screen.getByText('Node ID already exists!')).toBeInTheDocument();
                expect(screen.getByText('Add')).toBeDisabled();
            });;
        })
});
