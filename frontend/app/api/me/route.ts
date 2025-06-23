import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    const JWT_SECRET = process.env.JWT_SECRET!;
    const token = request.headers.get('Authorization')?.split(' ')[1]; //Bearer token

    // Format: "Bearer <token>"

    if (!token) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
    console.log('Decoded JWT:', decoded);
    const {user_id} = (decoded as { user_id: string });
    console.log('Decoded ID:', user_id);
    const user = await prisma.user.findUnique({
        where: { id: user_id },
    });

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name
    });
}
