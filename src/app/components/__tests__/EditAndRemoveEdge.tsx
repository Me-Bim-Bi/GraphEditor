import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import configureMockStore from 'redux-mock-store';
import EditEdgeModal from '../modals/EditEdgeModal';

jest.mock('react-hot-toast', () => ({
__esModule: true,
default: { error: jest.fn(), success: jest.fn() },
Toaster: () => <div data-testid="toaster" />,
}));

const mockStore = configureMockStore();

const baseStore = {
    graphData: { value: JSON.stringify({ nodes: [], links: [] }) },
    actionHistory: { backward: [], forward: [] },
    };

    const graphData = {
    nodes: [
        { id: '1', label: 'Alice', color: '#f50525' },
        { id: '2', label: 'Bob', parentID: '1', color: '#0fa343' },
    ],
    links: [
        {
        source: '1',
        target: '2',
        value: 3,
        relationship: 'friend',
        color: '#e8bd10',
        arrowShape: 'diamond',
        },
    ],
};

const setup = (options = { isOpen: true, edgeId: 'edge-FORCE-1-2' }) => {
    const store = mockStore({
        ...baseStore,
        graphData: { value: JSON.stringify(graphData) },
    });

    render(
        <Provider store={store}>
        <EditEdgeModal
            isOpen={options.isOpen}
            edgeId={options.edgeId}
            onClose={() => {}}
        />
        </Provider>
    );

    return store;
    };

describe('EditEdgeModal', () => {
    it('renders correctly when open', () => {
        setup();

        expect(screen.getByRole('heading', { name: /Edit Edge/i })).toBeInTheDocument();

        const sourceInput = screen.getByTestId('edit-edge-source');
        const targetInput = screen.getByTestId('edit-edge-target');

        expect(sourceInput).toHaveValue('1');
        expect(targetInput).toHaveValue('2');
        expect(sourceInput).toBeDisabled();
        expect(targetInput).toBeDisabled();
    });

    it('does not render when isOpen=false', () => {
        setup({ isOpen: false, edgeId: 'edge-FORCE-1-2' });

        expect(screen.queryByText(/Edit Edge/i)).toBeNull();
        expect(screen.queryByTestId('edit-edge-source')).toBeNull();
        expect(screen.queryByTestId('edit-edge-target')).toBeNull();
    });

    it('edits an edge successfully', () => {
        const store = setup();

        fireEvent.change(screen.getByTestId(/edit-edge-value/i), { target: { value: '5' } });
        fireEvent.change(screen.getByTestId(/edit-edge-relationship/i), { target: { value: 'Neighbor' } });
        fireEvent.change(screen.getByTestId(/edit-edge-color/i), { target: { value: '#0fa343' } });
        fireEvent.change(screen.getByTestId(/edit-edge-arrow/i), { target: { value: 'triangle' } });

        fireEvent.click(screen.getByText('Save'));

        const actions = store.getActions();
        const updateAction = actions.find((a) => a.type === 'graphData/updateData');
        expect(updateAction).toBeDefined();

        const updatedGraph = JSON.parse(updateAction.payload);
        const updatedEdge = updatedGraph.links.find((l) => l.source === '1' && l.target === '2');

        expect(updatedEdge).toMatchObject({
        value: 5,
        relationship: 'Neighbor',
        color: '#0fa343',
        arrowShape: 'triangle',
        });

        expect(screen.getByTestId('edit-edge-source')).toBeDisabled();
        expect(screen.getByTestId('edit-edge-target')).toBeDisabled();
    });

    it('removes an edge successfully', () => {
        const store = setup();

        fireEvent.click(screen.getByText('Remove'));

        const actions = store.getActions();
        const updateAction = actions.find((a) => a.type === 'graphData/updateData');
        expect(updateAction).toBeDefined();

        const updatedGraph = JSON.parse(updateAction.payload);
        const edgeStillExists = updatedGraph.links.some((l) => l.source === '1' && l.target === '2');
        expect(edgeStillExists).toBe(false);
    });
});
