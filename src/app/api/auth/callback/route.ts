import { NextResponse, NextRequest } from "next/server";
import delay from "@/utils/delay";
import axios from "axios";



export async function GET(request: NextRequest) {
  console.log("we made it ");

  

  return NextResponse.json({ access_token: 'access_token_fake' });
 
}