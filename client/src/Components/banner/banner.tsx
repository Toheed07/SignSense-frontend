
import React, { useState } from 'react'

export default function Banner() {
  const [bannerOpen, setBannerOpen] = useState<boolean>(true)

  return (
    <>
      {bannerOpen &&
        <div className="banner">
          <div className="banner__content">
            <p className="banner__text">This is a banner</p>
            <button className="banner__close" onClick={() => setBannerOpen(false)}>Close</button>
          </div>
        </div>
      } 
    </>
  )
}