'use client'
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid'
import { VideoDataContext } from '@/app/_context/videoDataContext';
import { db } from '@/configs/db';
import { useUser } from '@clerk/nextjs';
import { VideoData } from '@/configs/schema';
import PlayerDialog from '../_components/PlayerDialog';

function CreateNew() {

  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState();
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser();

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }

  const onCreateClickHandler = () => {
    getVideoScript();
  }

  /**
   * Get Video Script
   */
  const getVideoScript = async () => {
    setLoading(true);
    const prompt = 'Write a script to generate ' + formData.duration + ' seconds video on topic: ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene, please do not write NSFW content and give me result in JSON format with imagePrompt and contentText as field'
    await axios.post('/api/get-video-script', {
      prompt: prompt
    }).then(async (response) => {
      setVideoData(prev => ({
        ...prev,
        'videoScript': response.data.result
      }))
      setVideoScript(response.data.result);
      await generateAudioFile(response.data.result);
    })
  }

  /**
   * Generate Audio File and Save to Firebase Storage
   * @param {*} videoScriptData 
   */
  const generateAudioFile = async (videoScriptData) => {
    setLoading(true)
    let script = '';
    const id = uuidv4();
    videoScriptData.forEach(element => {
      script = script + element.contentText + ' ';
    });

    await axios.post('/api/generate-audio', {
      text: script,
      id: id
    }).then(async (response) => {
      setVideoData(prev => ({
        ...prev,
        'audioFileUrl': response.data.result
      }))
      setAudioFileUrl(response.data.result);
      response.data.result && await generateAudioCaption(response.data.result, videoScriptData);
    })
  }

  /**
   * Generate caption from audio file
   * @param {*} fileUrl 
   */
  const generateAudioCaption = async (fileUrl, videoScriptData) => {

    await axios.post('/api/generate-caption', {
      audioFileUrl: fileUrl
    }).then(async (response) => {
      setCaptions(response?.data?.result);
      setVideoData(prev => ({
        ...prev,
        'captions': response.data.result
      }))
      console.log(response.data.result);
      response.data.result && await generateImage(videoScriptData);
    })

  }

  /**
   * Generate AI Images
   */
  const generateImage = async (videoScriptData) => {
    let images = [];
    for (const element of videoScriptData) {
      try {
        const response = await axios.post('/api/generate-image', {
          prompt: element.imagePrompt
        });
        console.log(response.data.result);
        images.push(response.data.result);
      } catch (error) {
        console.log('Error:' + error);
      }
    }
    setVideoData(prev => ({
      ...prev,
      'imageList': images
    }))
    setImageList(images);
    setLoading(false);
  }

  useEffect(() => {
    console.log(videoData);
    if (Object.keys(videoData).length === 4) {
      saveVideoData(videoData);
    }
  }, [videoData])

  const saveVideoData = async (videoData) => {
    setLoading(true);
    const result = await db.insert(VideoData).values({
      script: videoData?.videoScript,
      audioFileUrl: videoData?.audioFileUrl,
      captions: videoData?.captions,
      imageList: videoData?.imageList,
      createdBy: user?.primaryEmailAddress?.emailAddress
    }).returning({ id: VideoData?.id })

    setVideoId(result[0].id);

    console.log(result);
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
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  )
}

export default CreateNew