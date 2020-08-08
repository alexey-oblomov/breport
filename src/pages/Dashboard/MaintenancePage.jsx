import React, { Component } from 'react'
import { Footer } from 'widgets'
import styles from './styles.scss'

export default class MaintenancePage extends Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <h1>Battle Report tool</h1>
          <h4>This tool specializes in the aggregation and presentation of battle reports from Eve Online.</h4>
          <h4>Many thanks to zKillboard and @squizz for his API.</h4>

          <div className={styles.maintenanceRoot}>
            <div>Maintenance in progress...</div>
            <div>.</div>
            <div>DB needs some love.</div>
            <div>Will return to operational in half a hour.</div>
            <div>.</div>
            <div>Stay tuned and fly dangerous o7</div>
          </div>

          <Footer />
        </div>
      </div>
    )
  }
}
