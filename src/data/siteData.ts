// Edit this file to change any copy, numbers, or links used across the site.
// Nothing here is a verified public claim — treat every metric as a
// placeholder until Connect2Air supplies confirmed figures.

export const brand = {
  name: 'Connect2Air',
  tagline: 'Brands that fly higher',
  logo: '/assets/connect2air-logo.png',
};

export const nav = {
  links: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ],
  cta: 'Get a quote',
};

export const about = {
  eyebrow: 'About Connect2Air',
  headline: 'Pioneering aviation technology.',
  sub: 'Connect2Air is a premier drone LED advertising and aerial light display venture of Connect2Future.',
  description:
    'We turn the open sky into your next advertising canvas — dynamic LED drone displays engineered for live events, concerts, product launches, and high-impact brand activations.',
  parentCompany: 'Connect2Future',
  parentLink: 'https://connect2future.com/',
  highlights: [
    { title: 'Synchronized LED Formations', desc: 'Precision drone fleets rendering animated logos and screen content high above venue crowds.' },
    { title: 'End-to-End Flight Operations', desc: 'From creative aerial choreography to airspace permissions and precision flight execution.' },
    { title: 'Unmissable Audience Reach', desc: 'Dominating venue skylines clear of billboards and physical advertising clutter.' },
  ],
};

export const hero = {
  eyebrow: 'Drone LED displays, for a brighter tomorrow',
  headlineTop: 'Turn ideas',
  headlineAccent: 'into skies',
  sub: 'The open sky, turned into your next advertising canvas — dynamic LED displays with unmissable visibility and real-world attention.',
  ctaPrimary: 'Explore our services',
  ctaSecondary: 'See our work',
  sideLabels: ['Drone LED displays', 'Aerial advertising', 'Live events', 'Brand activations'],
  stats: [
    { value: '20+', label: 'Events' },
    { value: '15+', label: 'Brands' },
    { value: '20+', label: 'Cities' },
    { value: '∞', label: 'Possibilities' },
  ],
};

export const services = [
  {
    number: '01',
    title: 'Drone LED advertising',
    category: 'Core display',
    description:
      'A synchronised formation of LED-carrying drones renders your message as a floating, animated screen above any venue.',
  },
  {
    number: '02',
    title: 'Brand activations',
    category: 'Experiential',
    description:
      'Launch moments engineered for the sky — reveals, countdowns and logo formations built around your activation.',
  },
  {
    number: '03',
    title: 'Event & concert displays',
    category: 'Live entertainment',
    description:
      'Synced to music and lighting cues, the display becomes part of the show rather than an interruption to it.',
  },
  {
    number: '04',
    title: 'Product & store launches',
    category: 'Retail',
    description:
      'Announce a launch above the storefront or venue itself, visible long before anyone reaches the door.',
  },
  {
    number: '05',
    title: 'Custom aerial experiences',
    category: 'Bespoke',
    description:
      'Flight paths, formations and screen content designed from scratch around a brief that does not fit a template.',
  },
];

export const whyPoints = [
  {
    number: '01',
    title: 'Unmissable visibility',
    description: 'Your brand rises above crowded physical environments, clear of billboards and screens fighting for the same eye-line.',
  },
  {
    number: '02',
    title: 'Motion creates attention',
    description: 'A moving aerial display draws the eye the way a static surface never can — attention is earned, not assumed.',
  },
  {
    number: '03',
    title: 'Built for moments',
    description: 'Concerts, launches, festivals, sports and major public events — wherever a crowd already looks up.',
  },
  {
    number: '04',
    title: 'A new kind of media',
    description: 'No fixed structure, no printed material — the open air becomes a dynamic, reprogrammable advertising surface.',
  },
];

export const process = [
  {
    number: '01',
    title: 'Brief',
    description: 'Tell us your objective, audience and event — timing, location and the outcome you need.',
  },
  {
    number: '02',
    title: 'Create',
    description: 'Our team builds the LED creative and plans the aerial choreography around your brief.',
  },
  {
    number: '03',
    title: 'Fly',
    description: 'The drone system takes your message into the sky, on schedule and on site.',
  },
  {
    number: '04',
    title: 'Impact',
    description: 'Your audience sees it, remembers it, and shares it — the campaign lives on past the flight.',
  },
];

export const telemetrySample = {
  alt: '120 FT',
  spd: '32 KM/H',
  bat: '94%',
  zone: 'Event area',
  visibility: 'High',
};

export const reachDefaults = {
  city: 'Bengaluru',
  flightHeight: 120, // ft
  displaySize: 'Large' as 'Small' | 'Medium' | 'Large',
  duration: 20, // minutes
};

export const campaigns = [
  {
    category: 'Concerts',
    label: 'Concerts & tours',
    description: 'Synchronized LED drone formations floating above live music crowds, displaying real-time song lyrics, artist logos, and dynamic light effects synced perfectly to performance beats.',
  },
  {
    category: 'Sports',
    label: 'Sports events',
    description: 'Sky-high aerial scoreboards, team crests, and sponsor reveals dominating stadium and arena skylines during major tournaments and championship matches.',
  },
  {
    category: 'Festivals',
    label: 'Festivals',
    description: 'Vivid animated drone LED light shows illuminating night festival skies, creating captivating visual spectacles visible across massive venue grounds.',
  },
  {
    category: 'Brand launches',
    label: 'Brand launches',
    description: 'Unmissable 3D aerial product reveals and floating illuminated brand logos engineered to generate massive audience excitement and viral social media coverage.',
  },
  {
    category: 'Real estate',
    label: 'Real-estate promotions',
    description: 'Highlighting luxury residential towers, sky villa dimensions, and developer branding directly over project construction sites and launch venues.',
  },
  {
    category: 'Corporate',
    label: 'Corporate events',
    description: 'Sophisticated aerial brand storytelling, leadership messages, and illuminated annual theme formations for high-profile galas and corporate summits.',
  },
  {
    category: 'Store openings',
    label: 'Store openings',
    description: 'Attracting venue crowds from miles away with vibrant floating directional arrows, grand opening countdowns, and promotional offers glowing overhead.',
  },
  {
    category: 'City events',
    label: 'City celebrations',
    description: 'Massive civic drone light displays for national holidays, new year countdowns, and cultural festivals for tens of thousands of spectators.',
  },
];

export const stats = [
  { value: '20+', label: 'Campaigns flown' },
  { value: '15+', label: 'Brands served' },
  { value: '20+', label: 'Cities active' },
  { value: '∞', label: 'Ways to be seen' },
];

export const contact = {
  email: 'hr@connect2future.com',
  phone: '+91 90359 99272',
  location: '',
  whatsapp: 'https://wa.me/919035999272?text=Hi%20Connect2Air%20team!%20I%20am%20interested%20in%20planning%20a%20drone%20LED%20display%20campaign.%20Please%20share%20more%20details.',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/_connect2air?stkn=NnE1NzBsYnNqeTF' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/connect2future/' },
    { label: 'WhatsApp', href: 'https://wa.me/919035999272?text=Hi%20Connect2Air%20team!%20I%20am%20interested%20in%20planning%20a%20drone%20LED%20display%20campaign.%20Please%20share%20more%20details.' },
    { label: 'Email', href: 'mailto:hr@connect2future.com' },
  ],
};
