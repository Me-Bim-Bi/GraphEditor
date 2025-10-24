import { NextRequest, NextResponse } from 'next/server';
import { getSession, cleanDatabase } from '../../lib/neo4j';

export async function POST(req: NextRequest) {
    const session = getSession();
    
    try {
        const result = await cleanDatabase();
        return NextResponse.json({ message: 'Clear graph successful!'});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error clearning graph', error }, { status: 500 });
    } finally {
        await session.close();
    }   
}