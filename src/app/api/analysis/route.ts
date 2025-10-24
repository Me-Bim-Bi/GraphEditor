import { NextResponse } from 'next/server';
import { getSession, communityDetection, pageRank, createGraph, dropGraph, degreeCentrality, connectedComponents } from '../../lib/neo4j';

export async function POST(req: Request) {
    const session = getSession();
    try {
        const { type } = await req.json();
        await dropGraph();
        await createGraph();
        let result;
        if (type === 'cd') {
            result = await communityDetection();
        } else if (type == 'pr') {
            result = await pageRank();
        } else if (type == 'cc') {
            result = await connectedComponents();
        } else if (type == 'dc') {
            result = await degreeCentrality();
        }
        else {
            return NextResponse.json(
                { message: 'Invalid analysis type' },
                { status: 400 }
            );
        }

        const cleanResult = result.records.map((r: any) => {
            const keys = r.keys;
            console.log('score', r.get('score'));
            let value = r.get('score');
            if (typeof value === 'object' && value !== null) {
                value = r.get('score')['low'];
            }
            let parentId;
            if (keys.includes('parentID')) parentId = r.get('parentID');
            else parentId = null;

            return {
                id: r.get('id'),
                label: r.get('node'),
                value,
                parentID: parentId,
            };
        });

        return NextResponse.json({
            message: 'Analysis completed successfully',
            type,
            result: cleanResult,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error during analysis', error }, { status: 500 });
    } finally {
        await session.close();
    }
}