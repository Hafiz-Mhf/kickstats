export interface CompetitionOption {
  id: number
  code: string
  name: string
  flag: string
}

export const COMPETITIONS: CompetitionOption[] = [
  { id: 2021, code: 'PL',  name: 'Premier League',  flag: '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F' },
  { id: 2014, code: 'PD',  name: 'La Liga',          flag: '\uD83C\uDDEA\uD83C\uDDF8' },
  { id: 2002, code: 'BL1', name: 'Bundesliga',       flag: '\uD83C\uDDE9\uD83C\uDDEA' },
  { id: 2019, code: 'SA',  name: 'Serie A',          flag: '\uD83C\uDDEE\uD83C\uDDF9' },
  { id: 2015, code: 'FL1', name: 'Ligue 1',          flag: '\uD83C\uDDEB\uD83C\uDDF7' },
  { id: 2003, code: 'ERE', name: 'Eredivisie',       flag: '\uD83C\uDDF3\uD83C\uDDF1' },
  { id: 2017, code: 'PPL', name: 'Primeira Liga',    flag: '\uD83C\uDDF5\uD83C\uDDF9' },
  { id: 2016, code: 'ELC', name: 'Championship',     flag: '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F' },
]
