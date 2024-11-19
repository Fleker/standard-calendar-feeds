/**
 * Curator for https://www.carnegiehall.org/Events
 */

// const spacetime = require('spacetime')
import * as fetch from 'node-fetch'
import { Curator, EventsFeed } from './ical'

const defaultTimeZone = 'America/New_York'

// function getTime(str: string) {
//   const spacetimeDate = spacetime(str, defaultTimeZone)
//   return new Date(spacetimeDate.toLocalDate())
// }

export default {
  obtainFeed: async () => {
    const events: EventsFeed = {
      calendarName: 'Carnegie Hall',
      lastBuildDate: new Date(),
      icon: '',
      link: '',
      defaultTimeZone,
      events: []
    }

    const res = await fetch.default("https://q0tmlopf1j-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.27.0%3BJS%20Helper%202.25.1&x-algolia-application-id=Q0TMLOPF1J&x-algolia-api-key=e34d1e2d2eb3becdffc6a784477a7edd", {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://www.carnegiehall.org/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "{\"requests\":[{\"indexName\":\"sitecore-events\",\"params\":\"query=&hitsPerPage=100&page=0&facets=%5B%22eventtype%22%2C%22seasonnumber%22%2C%22facilityfacet%22%2C%22genre%22%2C%22instrument%22%5D&tagFilters=&numericFilters=%5B%22startdate%3E1651798397962%22%5D\"},{\"indexName\":\"sitecore-events\",\"params\":\"query=&hitsPerPage=1&page=0&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&clickAnalytics=false&facets=genre&numericFilters=%5B%22startdate%3E1651798397962%22%5D\"},{\"indexName\":\"sitecore-events\",\"params\":\"query=&hitsPerPage=1&page=0&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&clickAnalytics=false&facets=facilityfacet&numericFilters=%5B%22startdate%3E1651798397962%22%5D\"},{\"indexName\":\"sitecore-events\",\"params\":\"query=&hitsPerPage=1&page=0&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&clickAnalytics=false&facets=instrument&numericFilters=%5B%22startdate%3E1651798397962%22%5D\"}]}",
      "method": "POST"
    });
    const body = await res.json()
    const {results} = body
    for (const result of results[0].hits) {
      const summary = result.title
      const location = result.facility
      const dtstart = new Date(result.startdate)
      const url = `https://www.carnegiehall.org/${result.url}`
      const description = `${result.webdisplayperformers}\n${url}`
      const dtend = new Date(result.startdate)
      dtend.setHours(dtstart.getHours() + 2) // Assume

      events.events.push({
        summary,
        dtend,
        dtstart,
        description,
        url,
        location,
      })
    }

    return events
  }
} as Curator
