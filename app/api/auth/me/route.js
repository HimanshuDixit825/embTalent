import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ user: null });
        }

        // Return user ID in the expected format
        return NextResponse.json({
            id: userId
        });
    } catch (error) {
        console.error('Error getting user:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
