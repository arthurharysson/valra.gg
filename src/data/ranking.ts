export interface RankedPlayer {
  place: number
  name: string
  tag: string
  country: string
  countryCode: string
  change: number
  rr: number
  tier: string
  wins: number
}

export const mockRanking: RankedPlayer[] = [
  { place: 1,  name: 'TenZ',       tag: 'SEN',   country: 'Canadá',       countryCode: 'ca', change: 0,   rr: 643, tier: 'Radiante', wins: 61  },
  { place: 2,  name: 'aspas',      tag: 'LOUD',  country: 'Brasil',       countryCode: 'br', change: 0,   rr: 621, tier: 'Radiante', wins: 94  },
  { place: 3,  name: 'cNed',       tag: 'TL',    country: 'Turquia',      countryCode: 'tr', change: 2,   rr: 600, tier: 'Radiante', wins: 48  },
  { place: 4,  name: 'Zekken',     tag: 'SEN',   country: 'EUA',          countryCode: 'us', change: -1,  rr: 588, tier: 'Radiante', wins: 88  },
  { place: 5,  name: 'brast ll',   tag: 'shnti', country: 'Brasil',       countryCode: 'br', change: -1,  rr: 578, tier: 'Radiante', wins: 60  },
  { place: 6,  name: 'Derke',      tag: 'FNC',   country: 'Finlândia',    countryCode: 'fi', change: 7,   rr: 577, tier: 'Radiante', wins: 118 },
  { place: 7,  name: 'Alfajer',    tag: 'FNC',   country: 'Cazaquistão',  countryCode: 'kz', change: 15,  rr: 576, tier: 'Radiante', wins: 54  },
  { place: 8,  name: 'nAts',       tag: 'PRX',   country: 'Rússia',       countryCode: 'ru', change: -1,  rr: 571, tier: 'Radiante', wins: 156 },
  { place: 9,  name: 'something',  tag: 'EG',    country: 'EUA',          countryCode: 'us', change: 0,   rr: 563, tier: 'Radiante', wins: 63  },
  { place: 10, name: 'Marved',     tag: 'NRG',   country: 'Canadá',       countryCode: 'ca', change: -4,  rr: 561, tier: 'Radiante', wins: 37  },
  { place: 11, name: 'Victor',     tag: 'NRG',   country: 'EUA',          countryCode: 'us', change: -1,  rr: 534, tier: 'Radiante', wins: 36  },
  { place: 12, name: 'Boaster',    tag: 'FNC',   country: 'Reino Unido',  countryCode: 'gb', change: 3,   rr: 521, tier: 'Radiante', wins: 72  },
  { place: 13, name: 'Less',       tag: 'LOUD',  country: 'Brasil',       countryCode: 'br', change: 0,   rr: 518, tier: 'Radiante', wins: 89  },
  { place: 14, name: 'Sayaplayer', tag: '100T',  country: 'Coreia',       countryCode: 'kr', change: 5,   rr: 510, tier: 'Radiante', wins: 44  },
  { place: 15, name: 'Crashies',   tag: 'NRG',   country: 'EUA',          countryCode: 'us', change: -2,  rr: 507, tier: 'Radiante', wins: 58  },
  { place: 16, name: 'jawgemo',    tag: 'EG',    country: 'EUA',          countryCode: 'us', change: 1,   rr: 503, tier: 'Radiante', wins: 41  },
  { place: 17, name: 'Lakia',      tag: 'PRX',   country: 'Coreia',       countryCode: 'kr', change: -3,  rr: 499, tier: 'Radiante', wins: 66  },
  { place: 18, name: 'Shao',       tag: 'FPX',   country: 'Rússia',       countryCode: 'ru', change: 0,   rr: 494, tier: 'Radiante', wins: 53  },
  { place: 19, name: 'pancada',    tag: 'LOUD',  country: 'Brasil',       countryCode: 'br', change: 8,   rr: 488, tier: 'Radiante', wins: 77  },
  { place: 20, name: 'Scream',     tag: 'TL',    country: 'Bélgica',      countryCode: 'be', change: -1,  rr: 481, tier: 'Radiante', wins: 49  },
]
