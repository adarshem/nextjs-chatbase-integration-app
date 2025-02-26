import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const chatbaseApiKey = process.env.CHATBASE_API_KEY;
    if (!chatbaseApiKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const userHash = crypto
      .createHmac('sha256', chatbaseApiKey)
      .update(userId)
      .digest('hex');

    return NextResponse.json({ userId, userHash }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error, ${error}` },
      { status: 500 }
    );
  }
};
