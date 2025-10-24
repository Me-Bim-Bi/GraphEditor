export interface Node extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    x?: number;
    y?: number;
    parentID?: string;
    color?: string;
    textList?: string[];
}

export interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
    value?: number;
    relationship?: string;
    color?: string;
    arrowShape?: string;
}

export type Data = {
    nodes: Node[];
    links: Link[];
};
