import BaseAPI from './BaseAPI'

const base = process.env.NODE_ENV === 'development' ? '' : process.env.API_SERVER

class RelatedService extends BaseAPI {

  fetchRelatedData(systemID, time) {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/related/${systemID}/${time}`,
    })
  }

  fetchRelatedKillmails(systemID, start, end) {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/related-killmails/${systemID}/${start}/${end}`,
    })
  }

  fetchRelatedSummaryData(systemID, time) {
    return this.call({
      method: 'post',
      url: `${base}/api/v1/related-summary`,
      data: {
        systemID,
        time,
      },
    })
  }

  getRecentRelateds() {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/recent-relateds`,
    })
  }

  getRecentRelatedsBig() {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/recent-relateds-big`,
    })
  }

  getRecentRelatedsHuge() {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/recent-relateds-huge`,
    })
  }

  getRecentlyAddedRelateds() {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/recently-added`,
    })
  }

  getRecentBattleReports() {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/recent-br`,
    })
  }

  checkRelatedKillmails({ systemID, start, end }) {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/related-killmails/${systemID}/${start}/${end}`,
    })
  }

  createBR(relateds) {
    return this.call({
      method: 'post',
      url: `${base}/api/v1/br/create`,
      data: {
        relateds,
      },
    })
  }

  updateBR(brID, teams) {
    return this.call({
      method: 'post',
      url: `${base}/api/v1/br/update`,
      data: {
        brID,
        teams,
      },
    })
  }

  saveComposition(teams, systemID, time) {
    return this.call({
      method: 'post',
      url: `${base}/api/v1/composition/add`,
      data: {
        related: `${systemID}/${time}`,
        teams,
      },
    })
  }

  getComposition(compositionID) {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/composition/get/${compositionID}`,
    })
  }
}

export default new RelatedService()
