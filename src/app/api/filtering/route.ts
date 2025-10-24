import { NextRequest, NextResponse } from 'next/server';
import { getSession, getShortestPath, dropGraph, createGraph } from '../../lib/neo4j';

export async function POST(req: NextRequest) {
    const { startId, endId } = await req.json();
    const session = getSession();
    await dropGraph();
    await createGraph();
    try {
        const result = await getShortestPath(startId, endId);
        const path = result.records.map(record => record.toObject());
        return NextResponse.json({ message: 'Shortest path found successfully', path });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error finding shortest path', error }, { status: 500 });
    } finally {
        await session.close();
    }   
}