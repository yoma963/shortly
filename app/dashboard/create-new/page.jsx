'use client'
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid'

const scriptData = 'hili hali hali'
const videoScriptData = [
  {
    "imagePrompt": "A man in a business suit, struggling to eat a banana, banana slipping away, comical expression, wide shot, cinematic lighting, hyperrealistic",
    "contentText": "Scene 1: A man tries to eat a banana but fails miserably."
  }
]

function CreateNew() {

  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }

  const onCreateClickHandler = () => {
    //getVideoScript();
    //generateAudioFile(scriptData);
    //generateAudioCaption('https://firebasestorage.googleapis.com/v0/b/shortly-6c877.firebasestorage.app/o/shortly%2F6b3bb9aa-4a42-45d2-9e8b-e60b482382e4.mp3?alt=media&token=aeecd909-f971-4982-aa9f-2a76e5f584fa');
    generateImage();
  }

  const getVideoScript = async () => {
    setLoading(true);
    const prompt = 'Write a script to generate ' + formData.duration + ' seconds video on topic: ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in JSON format with imagePrompt and contentText as field'
    const result = await axios.post('/api/get-video-script', {
      prompt: prompt
    }).then(response => {
      setVideoScript(response.data.result);
      generateAudioFile(response.data.result);
    })
    setLoading(false);
  }

  const generateAudioFile = async (videoScriptData) => {
    setLoading(true)
    let script = '';
    const id = uuidv4();
    videoScriptData.forEach(element => {
      script = script + element.contentText + ' ';
    });

    await axios.post('/api/generate-audio', {
      text: videoScriptData,
      id: id
    }).then(response => {
      setAudioFileUrl(response.data.result);
    })

    setLoading(false)
  }

  const generateAudioCaption = async (fileUrl) => {
    setLoading(true)

    await axios.post('/api/generate-caption', {
      audioFileUrl: fileUrl
    }).then(response => {
      console.log(response.data.result);
      setCaptions(response?.data?.result);
      generateImage();
    })

    setLoading(false)
  }

  const generateImage = async () => {
    setLoading(true);
    let images = [];
    const imagePromises = videoScriptData.map(async (element) => { 
      const response = await axios.post('/api/generate-image', {
        prompt: element?.imagePrompt
      });
      console.log(response);
      images.push(response);
    });

    await Promise.all(imagePromises);
    console.log(images);
    setImageList(images);
    setLoading(false);
  }

  return (
    <div className='lg:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>
      <div className='mt-10 shadow-md p-10'>
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />
        <Button className='mt-10 w-full' onClick={onCreateClickHandler} >Create Short Video</Button>
      </div>
      <CustomLoading loading={loading} />
    </div>
  )
}

export default CreateNew