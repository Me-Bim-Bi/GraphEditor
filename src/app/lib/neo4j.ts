import neo4j, { QueryResult } from 'neo4j-driver'

const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687' as string,
    neo4j.auth.basic(
        process.env.NEO4J_USERNAME as string,
        process.env.NEO4J_PASSWORD as string
    )
)
export const getSession = () => driver.session();

export async function cleanDatabase() {
    const session = driver.session();

    try {
        await session.run(`
        MATCH (n)
        DETACH DELETE n
    `);
        console.log('Database cleaned successfully.');
    } catch (error) {
        console.error('Error cleaning database:', error);
    } finally {
        await session.close();
    }
}

export async function dropGraph() {
    const session = driver.session();

    try {
        await session.run(`
        CALL gds.graph.drop('TestGraph')
        YIELD graphName
    `);
        console.log('Graph dropped successfully.');
    } catch (error) {
        console.error('Error dropping graph:', error);
    } finally {
        await session.close();
    }
}

export async function createGraph() {
    const session = driver.session();

    try {
        const relTypesResult = await session.run(`CALL db.relationshipTypes()`);
        const relTypes = relTypesResult.records.map(r => r.get(0));

        if (relTypes.length === 0) {
            throw new Error('No relationship found in database!');
        }

        const relProjection = relTypes
            .map(type => `${type}: {orientation: 'NATURAL', properties: ['value']}`)
            .join(',\n                        ');


        const cypher = `
            CALL gds.graph.project(
                'TestGraph',
                'Node',
                {
                    ${relProjection}
                }
            )
        `;
        await session.run(cypher);

        console.log(`Graph created successfully with relationships: ${relTypes.join(', ')}`);
    } catch (error) {
        console.error('Error creating graph:', error);
    } finally {
        await session.close();
    }
}

export async function getShortestPath(startId: string, endId: string): Promise<QueryResult> {
    const session = driver.session();

    try {
        const result = await session.run(`
            MATCH (source:Node {id: '${startId}'}), (target:Node {id: '${endId}'})
            CALL gds.shortestPath.dijkstra.stream('TestGraph', {
                sourceNode: id(source),
                targetNodes: id(target),
                relationshipWeightProperty: 'value'
            })
            YIELD index, sourceNode, targetNode, totalCost, nodeIds, costs, path
            RETURN
                index,
                gds.util.asNode(sourceNode).label AS sourceNodeName,
                gds.util.asNode(targetNode).label AS targetNodeName,
                totalCost,
                [nodeId IN nodeIds | gds.util.asNode(nodeId).label] AS nodeNames,
                costs,
                nodes(path) as path
            ORDER BY index
            `);
        return result;
    } catch (error) {
        console.error('Error fetching shortest path:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function communityDetection(): Promise<QueryResult> {
    const session = driver.session();

    try {
        const result = await session.run(`
        CALL gds.louvain.stream('TestGraph')
        YIELD nodeId, communityId
        WITH gds.util.asNode(nodeId) AS node, communityId
        OPTIONAL MATCH (parent:Node)-[:PARENT_CHILD]->(node)
        RETURN 
            node.id AS id,
            node.label AS node,
            communityId AS score,
            parent.id AS parentID
        ORDER BY communityId DESC, node ASC
            `);
        return result;
    } catch (error) {
        console.error('Error performing community detection:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function pageRank(): Promise<QueryResult> {
    const session = driver.session();

    try {
        const result = await session.run(`
            CALL gds.pageRank.stream('TestGraph')
            YIELD nodeId, score
            WITH gds.util.asNode(nodeId) AS node, score
            OPTIONAL MATCH (parent:Node)-[:PARENT_CHILD]->(node)
            RETURN 
                node.id AS id,
                node.label AS node,
                score,
                parent.id AS parentID
            ORDER BY score DESC, node ASC
            `);
        return result;
    } catch (error) {
        console.error('Error performing page rank:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function degreeCentrality(): Promise<QueryResult> {
    const session = driver.session();

    try {
        const result = await session.run(`
            CALL gds.degree.stream('TestGraph')
            YIELD nodeId, score
            WITH gds.util.asNode(nodeId) AS node, score
            OPTIONAL MATCH (parent:Node)-[:PARENT_CHILD]->(node)
            RETURN
                node.id AS id,
                node.label AS node,
                score,
                parent.id AS parentID
            ORDER BY score DESC, node ASC
            `);
        return result;
    } catch (error) {
        console.error('Error performing degree centrality:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function connectedComponents(): Promise<QueryResult> {
    const session = driver.session();

    try {
        const result = await session.run(`
            CALL gds.scc.stream('TestGraph')
            YIELD nodeId, componentId
            WITH gds.util.asNode(nodeId) AS node, componentId AS score
            OPTIONAL MATCH (parent:Node)-[:PARENT_CHILD]->(node)
            RETURN
                node.id AS id,
                node.label AS node,
                score,
                parent.id AS parentID
            ORDER BY score DESC, node ASC

            `);
        return result;
    } catch (error) {
        console.error('Error performing strong connected components:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function getNeighbors(findNeighborsLabel: string, hop: string): Promise<QueryResult> {
    const session = driver.session();
    try {
        const hopNum = Math.min(Number(hop) || 1, 5);

        const relTypesResult = await session.run(`CALL db.relationshipTypes()`);
        const relTypes = relTypesResult.records.map(r => r.get(0));

        if (relTypes.length === 0) {
            throw new Error('No relationship types found in database!');
        }

        const relPattern = relTypes.join('|');

        const query = `
      MATCH p=(n:Node {id: $findNeighborsLabel})-[:${relPattern}*1..${hopNum}]-(m:Node)
      RETURN p
    `;

        const result = await session.run(query, { findNeighborsLabel });
        return result;
    } catch (error) {
        console.error('Error finding neighbors:', error);
        throw error;
    } finally {
        await session.close();
    }
}