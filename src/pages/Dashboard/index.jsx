import React, { Component, Fragment } from 'react'
import { Link } from 'react-router'
import { distanceInWordsToNow } from 'date-fns'
import { Button } from 'components/common/blueprint'
import { BrInfo, Footer } from 'widgets'
import { SYSTEMS_DATA } from 'data/constants'
import { parseZkillDatetime, formatSum } from 'utils/FormatUtils'
import RelatedService from 'api/RelatedService'
import InputZkillLinkPanel from './InputZkillLinkPanel'
import InputSystems from './InputSystems'
import styles from './styles.scss'


const isMaintenance = true


class Dashboard extends Component {

  state = {
    related: 'single',
    // related: 'multiple',
    relateds: [],
  }

  componentDidMount() {
    // RelatedService.getRecentBattleReports()
    !isMaintenance && RelatedService.getRecentRelateds()
      .then(({ data }) => {
        this.setState({ relateds: data })
      })
  }

  getSystemNameFromLink = link => {
    const [systemID] = link.replace('/related/', '').split('/')
    return this.getSystemName(systemID)
  }

  getSystemName(systemID) {
    const relSystemID = systemID - 30000000
    const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
    const region = system && SYSTEMS_DATA.regions[system[2]]
    return `${system[0]} (${region})`
  }

  toggleRelated = () => {
    this.setState(state => ({
      related: state.related === 'single' ? 'multiple' : 'single',
    }))
  }

  renderRecentRelated(item) {
    const key = `${item.systemID}/${item.datetime}`
    const path = `/related/${key}`
    const createdAt = (new Date(item.createdAt)).toLocaleString()
    const relatedDate = parseZkillDatetime(item.datetime)
    const relatedDateFmt = relatedDate.toUTCString()
      .replace(':00:00', ':00').replace(':30:00', ':30').replace('GMT', 'ET')
    return (
      <div key={key} className={styles.item}>
        <div className={styles.systemCell}>
          <Link to={path}>
            {this.getSystemName(item.systemID)}
          </Link>
          <div>{relatedDateFmt}</div>
        </div>
        <div className={styles.distanceCell}>
          {`${distanceInWordsToNow(relatedDate)} ago`}
        </div>
        <div className={styles.systemCell}>
          <div className={styles.statsCell}>
            {`Total lost: ${formatSum(item.totalLost) || '?'}, Killmails: ${item.kmsCount}`}
          </div>
          <div className={styles.createdAt}>
            {`added: ${createdAt}`}
          </div>
        </div>
      </div>
    )
  }

  renderRecent() {
    const { relateds } = this.state
    if (!relateds || relateds.length === 0) {
      return null
    }
    return (
      <div className={styles.recent}>
        <div>Recent Battle Reports:</div>
        {relateds.map(item => this.renderRecentRelated(item))}
      </div>
    )
  }

  renderPanel() {
    if (!SYSTEMS_DATA.systems) return null
    const { related } = this.state
    if (related === 'single') {
      return <InputZkillLinkPanel getSystemName={this.getSystemNameFromLink} />
    }
    return (
      <Fragment>
        <BrInfo dashboard />
        <InputSystems SYSTEMS_DATA={SYSTEMS_DATA} />
      </Fragment>
    )
  }

  renderControls() {
    const { related } = this.state
    return (
      <div className={styles.controls}>
        <Button large active={related === 'single'} onClick={this.toggleRelated}>
          Single
        </Button>
        <Button large active={related === 'multiple'} onClick={this.toggleRelated}>
          Multiple
        </Button>
      </div>
    )
  }

  renderBlackoutDashboard() {
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <h1>Battle Report tool</h1>
          <h4>This tool is for generating battle reports from killmails held on zKillboard.com.</h4>

          <div className={styles.blackout}>
            BLACKOUT IN PROGRESS...
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  render() {
    if (isMaintenance) {
      return this.renderBlackoutDashboard()
    }

    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <h1>Battle Report tool</h1>
          <h4>This tool is for generating battle reports from killmails held on zKillboard.com.</h4>
          {false && this.renderControls()}
          {this.renderPanel()}
          {this.renderRecent()}
          <Footer />
        </div>
      </div>
    )
  }

}

export default Dashboard
