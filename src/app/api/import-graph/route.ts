import { NextRequest, NextResponse } from 'next/server';
import { getSession, cleanDatabase } from '../../lib/neo4j';
import { Data } from '../../types/dataGraph';

export async function POST(req: NextRequest) {
    const data: Data = await req.json();
    const session = getSession();
    
    await cleanDatabase();

    try {
        // Create or update all nodes
        for (const node of data.nodes) {
            await session.run(
                `
                MERGE (n:Node {id: $id})
                SET n.label = $label,
                    n.x = $x,
                    n.y = $y,
                    n.parentID = $parentID,
                    n.color = $color,
                    n.additionalProperties = $additionalProperties
                `,
                {
                    id: node.id,
                    label: node.label ?? null,
                    x: node.x ?? null,
                    y: node.y ?? null,
                    parentID: node.parentID ?? null,
                    color: node.color ?? null,
                    additionalProperties: node.textList ? node.textList.join('; ') : null,
                }
            );
        }

        // Import edges (with dynamic relationship types)
        for (const link of data.links) {
            const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
            const targetId = typeof link.target === 'string' ? link.target : link.target.id;

            // Default to "LINK" if relationship is missing
            const relType = link.relationship && link.relationship.trim() !== ''
                ? link.relationship.replace(/[^A-Za-z0-9_]/g, '_').toUpperCase()
                : 'LINK';

            const cypher = `
                MERGE (a:Node {id: $sourceId})
                MERGE (b:Node {id: $targetId})
                MERGE (a)-[r:${relType}]->(b)
                SET r.value = $value,
                    r.color = $color,
                    r.arrowShape = $arrowShape
            `;

            await session.run(cypher, {
                sourceId,
                targetId,
                value: link.value ?? null,
                color: link.color ?? null,
                arrowShape: link.arrowShape ?? null,
            });
        }
        // console.log("cypher: ", data);
        return NextResponse.json({ message: 'Graph imported successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error importing graph', error }, { status: 500 });
    } finally {
        await session.close();
    }
}