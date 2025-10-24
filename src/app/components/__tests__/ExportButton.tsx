import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import type cytoscape from 'cytoscape'
import toast from 'react-hot-toast';

import ExportButton from '../buttons/ExportButton';

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


describe('ExportButton', () => {
    const testStore = mockStore({
        ...baseStore,
        graphData: { value: JSON.stringify(graphData) },
    });
    let store: ReturnType<typeof mockStore>;
    let mockCy: cytoscape.Core;

    beforeEach(() => {
        store = mockStore(baseStore);
        mockCy = { png: jest.fn(() => 'data:image/png;base64,FAKE') } as unknown as cytoscape.Core;
        jest.clearAllMocks();
        global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    });


    it('renders button when isOpen=true', async () => {
        render(
            <Provider store={store}>
                <ExportButton isButtonEnable={true} isReadyToGraph={true} cy={mockCy} />
            </Provider>
            );

        const button = screen.getByRole('button', { name: /export file/i });
        expect(button).toBeEnabled();
    });


    it('renders button when isOpen=false', async () => {
        render(
            <Provider store={store}>
                <ExportButton isButtonEnable={false} isReadyToGraph={true} cy={mockCy} />
            </Provider>
            );

        const button = screen.getByRole('button', { name: /export file/i });

        expect(button).toBeDisabled();
    });


    it('open modals and show file format options', async () => {
        render(
            <Provider store={store}>
                <ExportButton isButtonEnable={true} isReadyToGraph={true} cy={mockCy} />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /export file/i }));

        const select = screen.getByTestId('export-file-format') as HTMLSelectElement;
        const options = Array.from(select.options).map(o => o.textContent);

        expect(options).toEqual(expect.arrayContaining([
            'JSON (.json)',
            'PNG (.png)',
            'GraphML (.graphml)',
            ]));
    });


    it('export json sucessfully', async () => {
        render(
            <Provider store={testStore}>
                <ExportButton isButtonEnable={true} isReadyToGraph={true} cy={mockCy} />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /export file/i }));
        fireEvent.change(screen.getByTestId('export-file-format'), { target: { value: 'json' } });

        const linkSpy = jest.spyOn(document, 'createElement');

        fireEvent.click(screen.getByText('Save'));

        expect(linkSpy).toHaveBeenCalledWith('a');
    });


    it('export graphML sucessfully', async () => {
        render(
            <Provider store={testStore}>
                <ExportButton isButtonEnable={true} isReadyToGraph={true} cy={mockCy} />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /export file/i }));
        fireEvent.change(screen.getByTestId('export-file-format'), { target: { value: 'graphml' } });

        const linkSpy = jest.spyOn(document, 'createElement');
        fireEvent.click(screen.getByText('Save'));
        expect(linkSpy).toHaveBeenCalledWith('a');
    });


    it('export png sucessfully', async () => {
        const mockPng = jest.fn(() => 'data:image/png;base64,fakeImage');
        const mockCy = { png: mockPng } as unknown as cytoscape.Core;
        render(
            <Provider store={testStore}>
                <ExportButton isButtonEnable={true} isReadyToGraph={true} cy={mockCy} />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /export file/i }));
        fireEvent.change(screen.getByTestId('export-file-format'), { target: { value: 'png' } });

        fireEvent.click(screen.getByText('Save'));
        expect(mockPng).toHaveBeenCalledWith(
            {
            full: true,
            scale: 3,
            bg: 'white' 
            }
        );
    });

    it('the button is disable when isReadyToGraph = false', async () => {
        render(
            <Provider store={store}>
                <ExportButton isButtonEnable={false} isReadyToGraph={false} cy={mockCy} />
            </Provider>
            );

        const button = screen.getByRole('button', { name: /export file/i });

        expect(button).toBeDisabled();
    });

    const emptyGraph = [
        {
            nameForm: 'json'
        },
        {
            nameForm: 'graphml'

        },
        {
            nameForm: 'png'
        }

    ]

    emptyGraph.forEach(({ nameForm }) => {
        it(`shows error for exporting an empty graph to a ${nameForm} file`, async () => {
            const store = mockStore({
                graphData: { value: JSON.stringify({ nodes: [], links: [] }) },
            });

            render(
                <Provider store={store}>
                <ExportButton isButtonEnable={true} isReadyToGraph={true} cy={mockCy} />
                </Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: /export file/i }));
            fireEvent.change(screen.getByTestId('export-file-format'), { target: { value: nameForm } });

            fireEvent.click(screen.getByText('Save'));

            expect(toast.error).toHaveBeenCalledWith(`Cannot export ${nameForm.toUpperCase()} because the graph is empty.`);
        });
    });
});


