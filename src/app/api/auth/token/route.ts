import { NextResponse } from "next/server";
import delay from "@/utils/delay";



export async function GET() {

  await delay(3000);

  return NextResponse.json({ access_token: 'access_token_fake' });
}