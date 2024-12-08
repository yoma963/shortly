import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Player } from "@remotion/player";
import RemotionVideo from './RemotionVideo';

function PlayerDialog({ playVideo, videoId }) {

  const [openDialog, setOpenDialog] = useState(false);

  useEffect (() => {
    setOpenDialog(playVideo)
  }, [playVideo])

  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold my-5" >Your video is ready</DialogTitle>
          <DialogDescription>
            <Player
              component={RemotionVideo}
              durationInFrames={120}
              compositionWidth={300}
              compositionHeight={450}
              fps={30}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  )
}

export default PlayerDialog