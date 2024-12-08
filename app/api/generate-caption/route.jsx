import { AssemblyAI } from 'assemblyai'
import { NextResponse } from 'next/server';

export async function POST(req) {

  try {
    const { audioFileUrl } = await req.json();

    if (typeof audioFileUrl !== 'string') {
      throw new Error('audioFileUrl should be a string');
    }

    const client = new AssemblyAI({
      apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY
    })

    const config = {
      audio_url: audioFileUrl
    }

    const transcript = await client.transcripts.transcribe(config)
    
    if (!transcript.words) {
      throw new Error('Transcript does not contain words');
    }

    return NextResponse.json({'result': transcript.words})

  } catch (error) {
    console.error('Error in generate-caption API:', error);
    return NextResponse.json({'error': error.message || 'An error occurred'})
  }
}