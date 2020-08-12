import React, { useState, useEffect } from 'react'
import styles from './styles.scss'

const Ads = () => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  return (
    <div className={styles.ads}>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client='ca-pub-3299420347078208'
        data-ad-slot='9657768171'
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
    </div>
  )
}

export default Ads
