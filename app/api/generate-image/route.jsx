import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const input = {
      prompt: prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1
    };

    const options = {
      version: '5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',
      input: { prompt }
    }

    //const output = await replicate.run("bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637", { input });
    let prediction = await replicate.predictions.create(options);
    prediction = await replicate.wait(prediction);
    console.log(prediction.output);
    //for (const [index, item] of Object.entries(output)) {
    //  await writeFile(`output_${index}.png`, item);
    //}
    //console.log(output);
    return NextResponse.json({ 'result': true });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ 'error': false });
  }
}