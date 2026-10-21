export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  badge: string;
}

/**
 * Project archive records with AI-assisted image recreations based on
 * the original field photographs.
 */
export const projects: ProjectItem[] = [
  {
    id: 'community-solar-water-pump',
    title: '5.5kW Solar-Powered Water Supply',
    category: 'Solar Water Supply',
    location: 'Regional Ethiopia',
    description: 'Sustainable community water station utilizing photovoltaic arrays and submersible borehole pumps to replace diesel-fueled generators.',
    image: '/assets/projects/recreated-water-station.webp',
    badge: '5.5 kW Clean Water',
  },
  {
    id: 'gambella-river-floating-pump',
    title: 'River Floating Intake Irrigation Station',
    category: 'Agricultural Irrigation',
    location: 'Gambella River',
    description: 'Solar-powered floating pump infrastructure engineered to adapt to fluctuating river water levels for reliable agricultural irrigation.',
    image: '/assets/projects/recreated-river-intake.webp',
    badge: 'Floating Intake Pumping',
  },
  {
    id: 'substructure-post-alignment',
    title: 'Substructure Engineering & Post Alignment',
    category: 'Installation & Assembly',
    location: 'Installation Site',
    description: 'Field technical team conducting precision leveling and structural alignment of heavy-gauge galvanized steel ground mounts.',
    image: '/assets/projects/recreated-post-alignment.webp',
    badge: 'Precision Engineering',
  },
  {
    id: 'solar-module-array-mounting',
    title: 'Photovoltaic Array Structural Assembly',
    category: 'Installation & Assembly',
    location: 'Installation Site',
    description: 'Technical installation team securing and mounting high-efficiency solar panel modules onto the rigid racking infrastructure.',
    image: '/assets/projects/recreated-array-assembly.webp',
    badge: 'PV Array Assembly',
  },
  {
    id: 'infield-pv-cabling-wiring',
    title: 'Under-Canopy DC Cabling & System Integration',
    category: 'Electrical Integration',
    location: 'Installation Site',
    description: 'Electricians completing weather-sealed DC string cabling, ground wiring, and conduit connections beneath the solar canopy.',
    image: '/assets/projects/recreated-dc-cabling.webp',
    badge: 'DC Cabling & Protection',
  },
  {
    id: 'bedford-solar-pump-controller',
    title: 'Solar Pump Inverter & Switchgear Enclosure',
    category: 'Control Systems',
    location: 'Control Station',
    description: 'Heavy-duty outdoor weatherproof cabinet housing the Bedford variable frequency drive (VFD) solar pump inverter and DC circuit protection.',
    image: '/assets/projects/recreated-control-cabinet.webp',
    badge: 'VFD Inverter & Controls',
  },
  {
    id: 'turnkey-array-perimeter',
    title: 'Commissioned Solar Array & Security Enclosure',
    category: 'Commissioned Installations',
    location: 'Installation Site',
    description: 'Completed and operational ground-mounted solar generator protected by perimeter security fencing to ensure long-term community reliability.',
    image: '/assets/projects/recreated-completed-array.webp',
    badge: 'Turnkey Commissioned',
  },
];
