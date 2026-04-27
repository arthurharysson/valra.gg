export interface ProPlayer {
  id: string
  name: string
  realName: string
  team: string
  role: string
  crosshairCode: string
  sensitivity: number
  dpi: number
  eDpi: number
  mouse: string
  monitor: string
  hz: number
  resolution: string
}

export const mockProPlayers: ProPlayer[] = [
  {
    id: '1',
    name: 'TenZ',
    realName: 'Tyson Ngo',
    team: 'Sentinels',
    role: 'Duelist',
    crosshairCode: '0;P;c;7;h;0;0l;5;0o;0;0a;1;0f;0;1b;0',
    sensitivity: 0.408,
    dpi: 800,
    eDpi: 326,
    mouse: 'Logitech G Pro X Superlight 2',
    monitor: 'BenQ XL2546K',
    hz: 240,
    resolution: '1280x960',
  },
  {
    id: '2',
    name: 'aspas',
    realName: 'Erick Botto',
    team: 'LOUD',
    role: 'Duelist',
    crosshairCode: '0;P;c;1;h;0;0l;4;0o;2;0a;1;0f;0;1b;0',
    sensitivity: 0.33,
    dpi: 1600,
    eDpi: 528,
    mouse: 'Zowie EC2-C',
    monitor: 'BenQ XL2566K',
    hz: 360,
    resolution: '1920x1080',
  },
  {
    id: '3',
    name: 'cNed',
    realName: 'Mehmet Yağız İpek',
    team: 'Team Liquid',
    role: 'Duelist',
    crosshairCode: '0;P;c;5;h;0;0l;4;0o;0;0a;1;0f;0;1b;0',
    sensitivity: 0.5,
    dpi: 800,
    eDpi: 400,
    mouse: 'Logitech G Pro X Superlight',
    monitor: 'BenQ XL2546K',
    hz: 240,
    resolution: '1280x960',
  },
  {
    id: '4',
    name: 'Zekken',
    realName: 'Zachary Patrone',
    team: 'Sentinels',
    role: 'Initiator',
    crosshairCode: '0;P;c;1;h;0;0l;3;0o;1;0a;1;0f;0;1b;0',
    sensitivity: 0.22,
    dpi: 1600,
    eDpi: 352,
    mouse: 'Razer DeathAdder V3 Pro',
    monitor: 'ASUS ROG Swift 360Hz',
    hz: 360,
    resolution: '1920x1080',
  },
]
