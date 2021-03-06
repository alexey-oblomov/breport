import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import isEmpty from 'lodash/isEmpty'

import RelatedService from 'api/RelatedService'
import { Button } from 'components/common/blueprint'
import * as StatsUtils from 'utils/StatsUtils'
import { getUTCTime, formatSum, getDurationStr, shortTimeAgo } from 'utils/FormatUtils'
import SystemName from '../SystemName'
import styles from './styles.scss'

function BrRelatedInfo({ systemID, systems, start, end, onRemove, onEdit, brPage, grouped, ...rest }) {
  const initialStats = isEmpty(rest) ? null : rest
  const [generalStats, setGeneralStats] = useState(initialStats)
  const [statsLoading, setStatsLoading] = useState(false)
  const { viewed } = useSelector(({ related }) => ({
    viewed: related.viewed,
  }))

  function handleRemove() {
    onRemove(systemID)
  }

  function checkRelated() {
    setStatsLoading(true)
    RelatedService.checkRelatedKillmails({ systemID, start, end })
      .then(({ data }) => {
        if (data && data.result === 'success') {
          const stats = StatsUtils.getKmsGeneralStats(data.kms)
          if (process.env.NODE_ENV === 'development') {
            console.log('stats:', stats)
          }
          setGeneralStats(stats)
        }
        setStatsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setStatsLoading(false)
      })
  }

  function renderStartEndTime(fromTime, toTime) {
    if (!fromTime || !toTime) return null
    const dateStart = new Date(fromTime)
    const dateEnd = new Date(toTime)

    return (
      <div className={styles.timing}>
        <span>{`${dateStart.toLocaleDateString()}, ${getUTCTime(dateStart)} - ${getUTCTime(dateEnd)} ET`}</span>
        {', '}
        <span>ended {shortTimeAgo(dateEnd)}</span>
      </div>
    )
  }

  function renderDuration(dateStart, dateEnd) {
    const duration = getDurationStr(dateStart, dateEnd)
    return <div>{`Battle duration: ${duration}`}</div>
  }

  function renderKillmailsStartEndTime(fromTime, toTime) {
    const dateStart = new Date(fromTime || start)
    const dateEnd = new Date(toTime || end)

    return (
      <div className={styles.battleDuration}>
        {renderDuration(dateStart, dateEnd)}
        {fromTime && toTime &&
          <React.Fragment>
            ,
            &nbsp;
            <div>{`from ${getUTCTime(dateStart)} to ${getUTCTime(dateEnd)} ET`}</div>
          </React.Fragment>
        }
      </div>
    )
  }

  function renderGeneralStats() {
    if (!generalStats) return null

    const { totalLossValue, pilotsCount, kmsCount } = generalStats
    let stats = `Lost: ${formatSum(totalLossValue)},`
    stats += ` Pilots: ${pilotsCount},`
    stats += ` Killmails: ${kmsCount},`
    stats += ` Views: ${viewed}`

    return (
      <div className={styles.generalStats}>
        <div>{stats}</div>
      </div>
    )
  }

  const { fromTime, toTime } = generalStats || {}

  // console.log('generalStats:', generalStats)

  return (
    <div className={cx('bp3-dark', styles.systemStats)} key={systemID}>
      <div className={cx(styles.title, generalStats && styles.block)}>
        <SystemName
          systemID={systemID}
          systems={systems}
          grouped={grouped}
        />

        {generalStats && !statsLoading && renderGeneralStats()}

        {!generalStats &&
          <Button
            small
            text='Check'
            onClick={checkRelated}
            intent='primary'
            loading={statsLoading}
          />
        }
      </div>

      {renderStartEndTime(start * 1000, end * 1000)}
      {renderKillmailsStartEndTime(fromTime, toTime)}

      {brPage && onEdit &&
        <div className={styles.removeBtn}>
          <Button small icon='edit' onClick={null} />
        </div>
      }

      {onRemove &&
        <div className={styles.removeBtn}>
          <Button small icon='small-cross' intent='danger' onClick={handleRemove} />
        </div>
      }
    </div>
  )
}

export default BrRelatedInfo
