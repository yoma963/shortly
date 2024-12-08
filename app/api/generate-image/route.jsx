import { storage } from "@/configs/firebaseConfig";
import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
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

    let prediction = await replicate.predictions.create(options);
    prediction = await replicate.wait(prediction);

    //Save to Firebase
    const base64Image = "data:image/png;base64," + await convertImage(prediction.output[0]);
    const fileName = 'shortly/' + Date.now() + ".png";
    const storageRef = ref(storage, fileName);

    await uploadString(storageRef, base64Image, 'data_url');

    const downloadUrl = await getDownloadURL(storageRef);
    console.log(downloadUrl);

    return NextResponse.json({ 'result': downloadUrl });

  } catch (error) {
    return NextResponse.json({ 'error': error });
  }
}

const convertImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data).toString('base64');
    return base64Image;

  } catch (error) {
    console.log("Error: ", error);
  }
}