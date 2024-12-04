import { AssemblyAI } from 'assemblyai'
import { NextResponse } from 'next/server';

export async function POST(req) {

  try {
    const { audioFileUrl } = await req.json();

    const client = new AssemblyAI({
      apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY
    })

    const config = {
      audio_url: audioFileUrl
    }

    const transcript = await client.transcripts.transcribe(config)
    console.log(transcript.words)
    return NextResponse.json({'result': transcript.words})

  } catch (error) {
    return NextResponse.json({'error': error})
  }
}