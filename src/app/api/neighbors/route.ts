// /api/neighbors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession, getNeighbors } from '../..//lib/neo4j';

export async function POST(req: NextRequest) {
  const { neighborsNodeId, hopID } = await req.json();
  const session = getSession();

  try {
    const result = await getNeighbors(neighborsNodeId, hopID);

    const nodes = new Map();
    const links = [];

    result.records.forEach(record => {
      const path = record.get('p');
      path.segments.forEach(seg => {
        const start = seg.start.properties;
        const end = seg.end.properties;
        const rel = seg.relationship;

        nodes.set(start.label, start);
        nodes.set(end.label, end);

        links.push({
          source: start.label,
          target: end.label,
          type: rel.type,
        });
      });
    });

    return NextResponse.json({
      message: 'Neighbor nodes found successfully',
      nodes: Array.from(nodes.values()),
      links,
    });

  } catch (error) {
    console.error('Error finding neighbors:', error);
    return NextResponse.json({ message: 'Error finding neighbor nodes', error }, { status: 500 });
  } finally {
    await session.close();
  }
}
