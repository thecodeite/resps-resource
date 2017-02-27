const upcomingResponsibilitiesService = require('../upcomingResponsibilitiesService')

const responsibilities = [
  {
    id: '1a119760-f888-11e6-ad2d-8d8d587a47cc',
    name: 'VAT',
    schedule: 'R/2011-01-01/P3M',
    complete: '24_25'
  },
  {
    id: '55',
    name: 'Do Payroll',
    schedule: 'R/2013-06-05/P1M'
  }
]

upcomingResponsibilitiesService.getResponsibilitiesAfterNow(responsibilities, 3)

