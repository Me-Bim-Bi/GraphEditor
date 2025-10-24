import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import configureMockStore from 'redux-mock-store';
import EditNodeModal from '../modals/EditNodeModal';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { error: jest.fn(), success: jest.fn() },
  Toaster: () => <div data-testid="toaster" />,
}));

const mockStore = configureMockStore();

const baseStore = {
  graphData: { value: JSON.stringify({ nodes: [], links: [] }) },
  actionHistory: { backward: [], forward: [] },
  hierarchyEnable: { value: false },
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
        value: 1,
        relationship: 'friend',
        color: '#e8bd10',
        arrowShape: 'diamond',
    },
  ],
};

const setup = (options = { isOpen: true, nodeId: '1' }) => {
  const store = mockStore({
    ...baseStore,
    graphData: { value: JSON.stringify(graphData) },
  });

  render(
    <Provider store={store}>
      <EditNodeModal
        isOpen={options.isOpen}
        nodeId={options.nodeId}
        onClose={() => {}}
      />
    </Provider>
  );

  return store;
};

describe('EditNodeModal', () => {
  it('renders modal when isOpen=true', () => {
    setup();

    const modalHeading = screen.getByRole('heading', { name: /Edit Node/i });
    expect(modalHeading).toBeInTheDocument();

    const nodeIdInput = screen.getByDisplayValue('1');
    expect(nodeIdInput).toBeDisabled();
  });

  it('does not render modal when isOpen=false', () => {
    setup({ isOpen: false, nodeId: '1' });

    expect(screen.queryByText(/Edit Node/i)).toBeNull();
  });

  it('edits a node successfully', () => {
    const store = setup({ isOpen: true, nodeId: '2' });

    fireEvent.change(screen.getByTestId(/edit-node-label/i), {
      target: { value: 'Eva' },
    });
    fireEvent.change(screen.getByTestId(/edit-node-parent-ID/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByTestId(/edit-node-textbox/i), {
      target: { value: 'abc;xyz' },
    });
    fireEvent.change(screen.getByTestId(/edit-node-color/i), {
      target: { value: '#e8bd10' },
    });
    fireEvent.click(screen.getByText('Save'));

    const actions = store.getActions();
    const updateAction = actions.find((a) => a.type === 'graphData/updateData');
    expect(updateAction).toBeDefined();

    const updateGraph = JSON.parse(updateAction.payload);
    const updatedNode = updateGraph.nodes.find((n) => n.id === '2');

    expect(updatedNode).toBeDefined();
    expect(updatedNode.label).toBe('Eva');
    expect(updatedNode.parentID).toBeUndefined();
    expect(updatedNode.textList).toStrictEqual(['abc', 'xyz']);
    expect(updatedNode.color).toBe('#e8bd10');
  });

  it('removes a node successfully', () => {
    const store = setup({ isOpen: true, nodeId: '2' });

    fireEvent.click(screen.getByText('Remove'));

    const actions = store.getActions();
    const updateAction = actions.find((a) => a.type === 'graphData/updateData');
    expect(updateAction).toBeDefined();

    const updateGraph = JSON.parse(updateAction.payload);
    const removedNode = updateGraph.nodes.find((n) => n.id === '2');
    const removedEdge = updateGraph.links.find(
      (l) => l.source === '1' && l.target === '2'
    );

    expect(removedNode).toBeUndefined();
    expect(removedEdge).toBeUndefined();
  });
});
