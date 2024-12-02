const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "Write a script to generate 30 seconds video on topic: Interesting historical story along with AI image prompt in realistic format for each scene and give me result in JSON format with imagePrompt and contentText as field" },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n[\n  {\n    \"imagePrompt\": \"A bustling medieval marketplace, vibrant colors, realistic textures, people in period clothing bartering, sunlight streaming through the buildings, detailed architecture, 8k resolution, photorealistic\",\n    \"contentText\": \"Our story begins in 14th-century Florence, a city teeming with life and ambition.  The year is 1348...\"\n  },\n  {\n    \"imagePrompt\": \"A terrified woman clutching a child, dark shadows, plague doctor in the background, flickering candlelight, realistic textures, detailed clothing, grim atmosphere, 8k resolution, photorealistic\",\n    \"contentText\": \"...and the Black Death has arrived.  Fear grips the city as the plague sweeps through, leaving death and despair in its wake.\"\n  },\n  {\n    \"imagePrompt\": \"A determined young woman, strong features, determined expression, medieval clothing, holding a small vial of herbs, dimly lit room, realistic textures, 8k resolution, photorealistic\",\n    \"contentText\": \"But amidst the chaos, a young apothecary named Isabella discovers a peculiar herb...\"\n  },\n  {\n    \"imagePrompt\": \"Close-up on a vial of dark green liquid, herbs and flowers surrounding it, realistic textures, detailed, illuminated by candlelight, shallow depth of field, 8k resolution, photorealistic\",\n    \"contentText\": \"...that seems to possess healing properties.  Could this be the key to combating the plague?\"\n  },\n  {\n    \"imagePrompt\": \"Isabella tending to a sick person, gentle expression, realistic medical tools of the time, dim light, concerned faces of onlookers, 8k resolution, photorealistic\",\n    \"contentText\": \"Isabella, risking her own life, begins to administer the herb to the sick, defying the Church and the established medical practices.\"\n  },\n  {\n    \"imagePrompt\": \"A triumphant Isabella, surrounded by recovered people, sunlight streaming through the window, hopeful expressions, realistic textures, celebratory atmosphere, 8k resolution, photorealistic\",\n    \"contentText\": \"Her efforts, though met with skepticism, eventually prove successful.  The herb, a precursor to modern medicine, saves countless lives.\"\n  },\n  {\n    \"imagePrompt\": \"A wide shot of Florence, vibrant and rebuilt, people going about their daily lives, sunlight, realistic textures, celebratory atmosphere, 8k resolution, photorealistic\",\n    \"contentText\": \"Isabella's bravery and ingenuity helped turn the tide against the Black Death, forever changing the course of medical history in Florence and beyond.  Her story is a testament to human resilience in the face of unimaginable adversity.\"\n  }\n]\n```\n\n**Note:**  This JSON provides prompts and text suitable for a 30-second video.  Achieving a smooth, professional-looking 30-second video would require professional video editing software and image generation tools capable of producing high-resolution, photorealistic images based on the prompts. The text provided is concise and aims to convey the core narrative within the time constraint.  You might need to adjust the pacing and add transitions during post-production.  Also, remember that generating realistic images from AI prompts can be time-consuming and computationally expensive.\n" },
      ],
    },
  ],
});
