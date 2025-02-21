export async function POST(request) {
    try {
        console.error('\n[API] /select POST called');
        const body = await request.json();
        console.error('[API] /select Request body:', body);

        return Response.json({ success: true });
    } catch (error) {
        console.error('[API] /select Error:', error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    console.error('\n[API] /select GET called');
    return Response.json({ success: true });
}
