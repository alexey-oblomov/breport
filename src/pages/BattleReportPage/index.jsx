import { hot } from 'react-hot-loader/root'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import isEqual from 'lodash/isEqual'

import RelatedService from 'api/RelatedService'
import { getBR, getStubBR, setStatus, resetBr } from 'reducers/battlereport'
import { brParseTeams } from 'reducers/related'
import { Spinner, Ads } from 'components'
import { ControlPanel, BrInfo, BrGroupInfo, Footer } from 'widgets'
import Report from 'pages/Report'
import styles from './styles.scss'

const DEBUG = false

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const BattleReportPage = ({ match: { params } }) => {
  const [saving, setSaving] = useState(false)
  const [updateKey] = useState(localStorage.getItem(params.brID))

  const dispatch = useDispatch()
  const store = useSelector(({ names, related, battlereport }) => ({
    involvedNames: names.involvedNames,
    status: battlereport.status,
    error: battlereport.error,
    br: battlereport.br,
    teams: related.teams,
    origTeams: related.origTeams,
    teamsLosses: related.teamsLosses,
  }))

  const { br, involvedNames, teamsLosses, teams, origTeams } = store

  function loadBR() {
    if (DEBUG && process.env.NODE_ENV === 'development') {
      dispatch(getStubBR(params.brID))
    } else {
      dispatch(getBR(params.brID))
    }
  }

  useEffect(() => {
    loadBR()
    return () => dispatch(resetBr())
  }, [params.brID])

  const prevInvolvedNames = usePrevious(involvedNames)
  useEffect(() => {
    if (!store.error && !involvedNames.isLoading && prevInvolvedNames && prevInvolvedNames.isLoading) {
      dispatch(setStatus('names fetched'))
      dispatch(brParseTeams())
    }
  }, [involvedNames])

  const prevTeamLosses = usePrevious(teamsLosses)
  useEffect(() => {
    if (teamsLosses && !prevTeamLosses) {
      if (br.new) {
        dispatch(setStatus(`${br.kmData && br.kmData.length} killmails`))
      } else {
        const killmailsCount = br.relateds.reduce((sum, related) => sum + related.kmsCount, 0)
        dispatch(setStatus(`${killmailsCount} killmails`))
      }
    }
  }, [teamsLosses])

  function isTeamsChanged() {
    if (!teams) {
      return false
    }
    return !isEqual(teams, origTeams)
  }

  async function handleUpdateBR() {
    setSaving(true)
    try {
      const { data } = await RelatedService.updateBR(params.brID, teams)
      if (data.status === 'success') {
        dispatch(brParseTeams())
      }

    } catch (err) {
      console.error('UpdateBR: err:', err)
    }
    setSaving(false)
  }

  const isLoading = br.isLoading || involvedNames.isLoading

  return (
    <div className={styles.root}>
      <ControlPanel
        header={store.status}
        error={store.error}
        isLoading={isLoading}
        onReload={loadBR}
        saving={saving}
        onSaveBR={handleUpdateBR}
        canSave={updateKey && isTeamsChanged()}
      />

      {isLoading &&
        <Spinner />
      }

      {teams && teamsLosses &&
        <Fragment>
          <Ads type='horizontal' />
          {br.new
            ? <BrGroupInfo relateds={br.relateds} />
            : <BrInfo routerParams={params} />
          }
          <Report
            teams={teams}
            isLoading={false}
            reportType='plane'
            routerParams={params}
          />
        </Fragment>
      }
      <Footer />
    </div>
  )
}

export default hot(BattleReportPage)
