import { NextResponse, NextRequest } from 'next/server';

import { Client } from 'node-osc';


const oscClient = new Client('127.0.0.1', 9000);


export async function POST(req: NextRequest) {
  
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { address, args } = body;

    if (!address || !Array.isArray(args)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    console.log(`Sending OSC message to ${address} with args: ${args}`);

    // Send OSC message
    oscClient.send(address, ...args, () => {
      console.log(`Message sent: ${address} ${args}`);
    });

    return NextResponse.json({ data: 'Message Sent to OSC' }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}