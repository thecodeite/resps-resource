'use strict';

const moment = require('moment')
//const Interval = require('repeating-interval').Interval
const makeInterval = require('iso8601-repeating-interval')

const numberRange = require('./number-range')

function getResponsibilitiesAfter (responsibilities, date, count) {
  date = moment(date)
  const soonDate = date.clone().add(7, 'days')

  const threeMonthsAgo = date.clone().add(-3, 'months')
  const sixMonthsHence = date.clone().add(6, 'months')

  const intervals = responsibilities.filter(x => x.schedule).map(x => {
    const interval = makeInterval(x.schedule)
    const firstAfter = interval.firstAfter(threeMonthsAgo)
    return {
      id: x.id,
      name: x.name,
      complete: x.complete,
      interval,
      rIndex: firstAfter.index,
      date: firstAfter.date
    }
  })

  //console.log('intervals:', intervals)


  const results = []

  while(results.length < count && intervals.length) {
    intervals.sort((a, b) => a.date > b.date ? 1 : -1)
    let nextEvent = intervals[0]
    if (nextEvent.date.isAfter(sixMonthsHence)) break;

    let comp = numberRange.toArray(nextEvent.complete || '')
    let result = {
      name: nextEvent.name,
      date: nextEvent.date.format(),
      id: nextEvent.id + '_' + nextEvent.rIndex,
      done: comp.indexOf(nextEvent.rIndex) !== -1,
      overdue: nextEvent.date.isBefore(date),
      soon: nextEvent.date.isBefore(soonDate)
    }
    console.log('result:', result)


    if (!result.done || !result.overdue) {
      results.push(result)
    }

    let nextDate
    do {
      nextDate = nextEvent.date.clone()
      nextDate.add(1, 'second')
      const firstAfter = nextEvent.interval.firstAfter(nextDate)


      //let {rIndex = nextEvent.interval.indexAfter(nextDate)
      //next = nextEvent.interval.occurrence(rIndex)
      if (firstAfter) {
        nextEvent.rIndex = firstAfter.index
        nextEvent.date = firstAfter.date.clone()
      } else {
        intervals.unshift()
      }
    } while (!nextDate && intervals.length)



  }

  return results
}

function getResponsibilitiesAfterNow (responsibilities, count) {
  return getResponsibilitiesAfter(responsibilities, moment(), count)
}

module.exports = {
  getResponsibilitiesAfter,
  getResponsibilitiesAfterNow
}

