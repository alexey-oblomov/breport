import React, { useEffect } from 'react'
import cx from 'classnames'
import styles from './styles.scss'

const Ads = ({ type }) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }, [])

  if (process.env.NODE_ENV === 'development') {
    return type === 'dashboard'
      ? <div className={cx(styles.ads, styles.background)} />
      : <div className={cx(styles.adsHorizontal, styles.background)} />
  }

  if (type === 'dashboard') {
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

  return (
    <div className={styles.adsHorizontal}>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client='ca-pub-3299420347078208'
        data-ad-slot='1520892318'
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
    </div>
  )
}

export default Ads
