import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { SYSTEMS_DATA } from 'data/constants'
import { getUTCTime, formatSum, getDurationStr, shortTimeAgo } from 'utils/FormatUtils'
import styles from './styles.scss'

class BrInfo extends Component {

  getDotlanLink(region, systemName) {
    if (!region) return ''
    const encodedRegion = region.replace(' ', '_')
    return `http://evemaps.dotlan.net/map/${encodedRegion}/${systemName}`
  }

  renderStartEndTime(fromTime, toTime) {
    if (!fromTime || !toTime) return null
    const dateStart = new Date(fromTime)
    const dateEnd = new Date(toTime)
    const duration = getDurationStr(dateStart, dateEnd)

    return (
      <React.Fragment>
        <div className={styles.timing}>
          <span>{`${dateStart.toLocaleDateString()}, ${getUTCTime(dateStart)} - ${getUTCTime(dateEnd)} ET`}</span>
          {', '}
          <span>ended {shortTimeAgo(dateEnd)}</span>
        </div>
        <div>{`Duration: ${duration}`}</div>
      </React.Fragment>
    )
  }

  renderGeneralStats() {
    const { generalStats = {}, systemStats = {}, viewed } = this.props
    const { fromTime, toTime } = systemStats
    if (!generalStats || !fromTime || !toTime) return null
    let stats = `Total lost: ${formatSum(generalStats.totalLossValue)},`
    stats += ` Pilots: ${generalStats.pilotsCount},`
    stats += ` Views: ${viewed}`

    return (
      <div className={styles.generalStats}>
        <div>{stats}</div>
      </div>
    )
  }

  render() {
    if (!SYSTEMS_DATA.systems) {
      return null
    }
    const { routerParams = {}, relateds, systemStats = {} } = this.props
    const { fromTime, toTime } = systemStats
    let { systemID, time } = routerParams
    if (!systemID) {
      if (relateds && relateds[0] && relateds[0].relatedKey) {
        [systemID, time] = relateds[0].relatedKey.split('/')
      } else {
        return null
      }
    }

    const relSystemID = systemID - 30000000
    const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
    const region = system && SYSTEMS_DATA.regions[system[2]]
    const systemName = system && system[0]
    const { relatedKey } = (relateds[0] || {})

    return (
      <div className={styles.systemStats}>
        <div className={styles.title}>
          <span className={styles.systemName}>
            <a href={this.getDotlanLink(region, systemName)} target='_blank' rel='noopener noreferrer'>
              {`${systemName}`}
            </a>
            <small>{`(${region})`}</small>
            <small>
              <a href={`http://zkillboard.com/related/${systemID}/${time}/`} target='_blank' rel='noopener noreferrer'>
                zkillboard
              </a>
            </small>
          </span>
          {this.renderGeneralStats()}
        </div>
        {this.renderStartEndTime(fromTime, toTime)}

        {relatedKey &&
          <small className={styles.related}>
            <Link to={`/related/${relatedKey}`} target='_blank' rel='noopener noreferrer'>
              link to related
            </Link>
          </small>
        }
      </div>
    )
  }
}

const mapDispatchToProps = {}
const mapStateToProps = ({ related }) => ({
  viewed: related.viewed,
  systemStats: related.systemStats,
  relateds: related.relateds,
  generalStats: related.generalStats,
})

export default connect(mapStateToProps, mapDispatchToProps)(BrInfo)
