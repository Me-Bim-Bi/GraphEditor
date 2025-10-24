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
        hierarchyEnable: { value: false },
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

    it('imports valid JSON successfully', async () => {
        const json = JSON.stringify({
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
        });

        const { container } = renderImportButton();
        uploadFile(container, json);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('File imported successfully', { duration: 3000 });
            expect(setIsReadyToGraph).toHaveBeenCalledWith(true);

            const actions = store.getActions();
            const updateAction = actions.find(a => a.type === 'graphData/updateData');
            expect(updateAction).toBeDefined();

            const updateGraph = JSON.parse(updateAction.payload);
            expect(updateGraph.nodes).toHaveLength(2);
            expect(updateGraph.links).toHaveLength(1);
            expect(updateGraph.nodes[0]).toMatchObject({ label: 'Alice', color: '#f50525' });
            expect(updateGraph.nodes[1]).toMatchObject({ label: 'Bob', parentID: '1', color: '#0fa343' });
            expect(updateGraph.links[0]).toMatchObject({
                value: 3,
                relationship: 'friend',
                color: '#e8bd10',
                arrowShape: 'diamond',
            });
        });
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
        name: 'link missing source',
        json: JSON.stringify({
            nodes: [{ id: '1', label: 'Alice', color: '#f50525' }, { id: '2', label: 'Bob', parentID: '1', color: '#0fa343' }],
            links: [{ target: '2', value: 3, relationship: 'friend', color: '#e8bd10', arrowShape: 'diamond' }],
        }),
        errorMessage: 'Each link must have source and target',
        },
        {
        name: 'link missing target',
        json: JSON.stringify({
            nodes: [{ id: '1', label: 'Alice', color: '#f50525' }, { id: '2', label: 'Bob', parentID: '1', color: '#0fa343' }],
            links: [{ source: '1', value: 3, relationship: 'friend', color: '#e8bd10', arrowShape: 'diamond' }],
        }),
        errorMessage: 'Each link must have source and target',
        },
        {
        name: 'link source does not exist',
        json: JSON.stringify({
            nodes: [{ id: '1', label: 'Alice', color: '#f50525' }, { id: '2', label: 'Bob', parentID: '1', color: '#0fa343' }],
            links: [{ source: '3', target: '2', value: 3, relationship: 'friend', color: '#e8bd10', arrowShape: 'diamond' }],
        }),
        errorMessage: 'Link source "3" does not exist',
        },
        {
        name: 'link target does not exist',
        json: JSON.stringify({
            nodes: [{ id: '1', label: 'Alice', color: '#f50525' }, { id: '2', label: 'Bob', parentID: '1', color: '#0fa343' }],
            links: [{ source: '1', target: '3', value: 3, relationship: 'friend', color: '#e8bd10', arrowShape: 'diamond' }],
        }),
        errorMessage: 'Link target "3" does not exist',
        },
        {
        name: 'invalid arrow shape',
        json: JSON.stringify({
            nodes: [{ id: '1', label: 'Alice', color: '#f50525' }, { id: '2', label: 'Bob', parentID: '1', color: '#0fa343' }],
            links: [{ source: '1', target: '2', value: 3, relationship: 'friend', color: '#e8bd10', arrowShape: 'test' }],
        }),
        errorMessage: 'Link arrow shape "test" does not exist',
        },
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
});
