const TEAM_COLORS: Record<number, string> = {
  57:  '#EF0107', // Arsenal
  58:  '#034694', // Chelsea
  64:  '#DA020E', // Liverpool
  65:  '#132257', // Tottenham
  66:  '#6CABDD', // Manchester City
  67:  '#DA291C', // Manchester United
  73:  '#FDB913', // Wolverhampton
  74:  '#7A263A', // West Ham
  76:  '#E03A3E', // Nottingham Forest
  86:  '#FEBE10', // Borussia Dortmund
  5:   '#D4021D', // Bayern Munich
  98:  '#000000', // Juventus
  108: '#0D1B5E', // Inter Milan
  109: '#C4071B', // AC Milan
  721: '#E62E3B', // Benfica
  81:  '#004D98', // Barcelona
  328: '#1B458F', // Atletico Madrid
}

export function getTeamColor(teamId: number): string {
  return TEAM_COLORS[teamId] ?? '#00ff87'
}
