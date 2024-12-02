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

function CreateNew() {

  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }

  const onCreateClickHandler = () => {
    //getVideoScript();
    generateAudioFile(scriptData);
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
    //videoScriptData.forEach(element => {
    //  script = script + element.contentText + ' ';
    //});

    await axios.post('/api/generate-audio', {
      text: videoScriptData,
      id: id
    }).then(response => {
      console.log(response.data);
    })

    setLoading(false)
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