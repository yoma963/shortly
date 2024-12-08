'use client'

import React, { useState } from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import { VideoDataContext } from '../_context/videoDataContext'

function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      <div>
        <div className='hidden md:block h-screen bg-white fixed mt-[65px] w-64'>
          <SideNav />
        </div>
        <div>
          <Header />
          <div className='md:ml-64 p-10'>
            {children}
          </div>
        </div>
      </div>
    </VideoDataContext.Provider>
  )
}

export default DashboardLayout