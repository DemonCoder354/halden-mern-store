const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

const products = [
  {
    name: 'Aurel Over-Ear Headphones',
    slug: 'aurel-over-ear-headphones',
    tagline: 'Closed-back comfort for long listening sessions.',
    description:
      'Aurel pairs soft protein-leather cushions with a lightweight steel headband, so you can wear it all day without pressure points. Tuned for a warm, balanced sound with a clean low end.',
    price: 189,
    compareAtPrice: 229,
    category: 'audio',
    image: img('1505740420928-5e560c06d30e'),
    colors: [
      { name: 'Graphite', hex: '#2B2F33' },
      { name: 'Sand', hex: '#D8CBB5' },
    ],
    specs: [
      { label: 'Driver', value: '40 mm dynamic' },
      { label: 'Battery', value: 'Up to 30 h' },
      { label: 'Weight', value: '265 g' },
    ],
    stock: 24,
    featured: true,
  },
  {
    name: 'Halden Studio Headphones',
    slug: 'halden-studio-headphones',
    tagline: 'Brushed aluminium, walnut-tone cushions.',
    description:
      'A wired studio headphone with machined aluminium cups and a detachable braided cable. Designed for honest monitoring and easy repair: every part can be replaced.',
    price: 249,
    category: 'audio',
    image: img('1484704849700-f032a568e944'),
    colors: [{ name: 'Silver', hex: '#C9CCCF' }],
    specs: [
      { label: 'Impedance', value: '32 ohm' },
      { label: 'Cable', value: '1.8 m detachable' },
      { label: 'Weight', value: '310 g' },
    ],
    stock: 12,
    featured: true,
    isNewArrival: true,
  },
  {
    name: 'Monitor Wired Headphones',
    slug: 'monitor-wired-headphones',
    tagline: 'Everyday on-ear sound, no charging required.',
    description:
      'A folding on-ear headphone with a flat-tangle-free cable and an in-line mic. Simple, durable and ready to go whenever you are.',
    price: 69,
    category: 'audio',
    image: img('1583394838336-acd977736f90'),
    colors: [{ name: 'Charcoal', hex: '#3A3D40' }],
    specs: [
      { label: 'Driver', value: '32 mm' },
      { label: 'Connector', value: '3.5 mm' },
    ],
    stock: 40,
  },
  {
    name: 'Atlas Automatic Watch',
    slug: 'atlas-automatic-watch',
    tagline: 'Open-heart dial, Italian leather strap.',
    description:
      'Atlas shows its self-winding movement through an open-heart window. Sapphire-coated crystal, 41 mm steel case and a hand-stitched leather strap that ages beautifully.',
    price: 420,
    category: 'wearables',
    image: img('1524805444758-089113d48a6d'),
    colors: [{ name: 'Cognac', hex: '#8A4B2A' }],
    specs: [
      { label: 'Case', value: '41 mm steel' },
      { label: 'Movement', value: 'Automatic' },
      { label: 'Water resistance', value: '5 ATM' },
    ],
    stock: 6,
    featured: true,
  },
  {
    name: 'Meridian Chronograph',
    slug: 'meridian-chronograph',
    tagline: 'Panda dial inspired by classic racing watches.',
    description:
      'A quartz chronograph with a cream dial, contrasting sub-dials and a tachymeter bezel. Comes on a dark brown leather strap with a quick-release pin.',
    price: 310,
    compareAtPrice: 360,
    category: 'wearables',
    image: img('1593998066526-65fcab3021a2'),
    colors: [{ name: 'Espresso', hex: '#3E2A20' }],
    specs: [
      { label: 'Case', value: '40 mm steel' },
      { label: 'Movement', value: 'Quartz chronograph' },
    ],
    stock: 9,
  },
  {
    name: 'Pulse Smartwatch',
    slug: 'pulse-smartwatch',
    tagline: 'Health tracking in a slim aluminium case.',
    description:
      'Heart rate, sleep and activity tracking with a bright always-on display. Swap faces and straps to match your day, from the gym to the office.',
    price: 279,
    category: 'wearables',
    image: img('1546868871-7041f2a55e12'),
    colors: [
      { name: 'Midnight', hex: '#1C1F24' },
      { name: 'Silver', hex: '#D4D6D8' },
    ],
    specs: [
      { label: 'Display', value: '1.8" OLED' },
      { label: 'Battery', value: 'Up to 2 days' },
    ],
    stock: 18,
    featured: true,
    isNewArrival: true,
  },
  {
    name: 'Nord Minimal Watch',
    slug: 'nord-minimal-watch',
    tagline: 'A white dial and nothing more than you need.',
    description:
      'Clean Scandinavian design with a slim 38 mm case and a soft silicone strap. Light enough to forget you are wearing it.',
    price: 149,
    category: 'wearables',
    image: img('1523275335684-37898b6baf30'),
    colors: [{ name: 'White', hex: '#F2F2F0' }],
    specs: [
      { label: 'Case', value: '38 mm' },
      { label: 'Strap', value: 'Silicone' },
    ],
    stock: 30,
  },
  {
    name: 'Nomad Daypack',
    slug: 'nomad-daypack',
    tagline: 'Recycled canvas, padded 16" laptop sleeve.',
    description:
      'A 20 L daypack made from recycled water-resistant canvas. Hidden back pocket, magnetic strap keepers and a suitcase pass-through for travel days.',
    price: 119,
    category: 'lifestyle',
    image: img('1553062407-98eeb64c6a62'),
    colors: [
      { name: 'Navy', hex: '#1F2A44' },
      { name: 'Olive', hex: '#55603F' },
    ],
    specs: [
      { label: 'Volume', value: '20 L' },
      { label: 'Laptop', value: 'Up to 16"' },
    ],
    stock: 22,
    featured: true,
  },
  {
    name: 'Coast Sunglasses',
    slug: 'coast-sunglasses',
    tagline: 'Polarised lenses in a timeless frame.',
    description:
      'Hand-polished acetate frames with polarised, UV400 lenses. Includes a recycled-leather case and a microfibre cloth.',
    price: 95,
    category: 'lifestyle',
    image: img('1572635196237-14b3f281503f'),
    colors: [{ name: 'Black', hex: '#111111' }],
    specs: [
      { label: 'Lens', value: 'Polarised UV400' },
      { label: 'Frame', value: 'Acetate' },
    ],
    stock: 35,
  },
  {
    name: 'Trail Runner Sneaker',
    slug: 'trail-runner-sneaker',
    tagline: 'Knit upper, responsive foam midsole.',
    description:
      'A breathable knit runner with a cushioned foam midsole and grippy rubber outsole. Built for daily miles and weekend trails.',
    price: 135,
    compareAtPrice: 160,
    category: 'lifestyle',
    image: img('1491553895911-0055eca6402d'),
    colors: [{ name: 'Slate', hex: '#4A4E54' }],
    specs: [
      { label: 'Drop', value: '8 mm' },
      { label: 'Weight', value: '255 g' },
    ],
    stock: 16,
  },
  {
    name: 'Thermal Steel Bottle',
    slug: 'thermal-steel-bottle',
    tagline: 'Keeps drinks cold for 24 hours.',
    description:
      'Double-wall vacuum insulated bottle with a powder-coated finish that will not slip in your hand. 500 ml, leak-proof and dishwasher safe.',
    price: 34,
    category: 'lifestyle',
    image: img('1602143407151-7111542de6e8'),
    colors: [
      { name: 'Sage', hex: '#5E7F6A' },
      { name: 'Stone', hex: '#CFCAC0' },
    ],
    specs: [
      { label: 'Capacity', value: '500 ml' },
      { label: 'Material', value: '18/8 steel' },
    ],
    stock: 60,
    isNewArrival: true,
  },
  {
    name: 'Essential Cotton Tee',
    slug: 'essential-cotton-tee',
    tagline: 'Heavyweight organic cotton, relaxed fit.',
    description:
      'A 220 gsm organic cotton tee with a dense, structured feel. Pre-shrunk and garment-dyed for a soft hand from the first wear.',
    price: 39,
    category: 'lifestyle',
    image: img('1618354691373-d851c5c3a990'),
    colors: [
      { name: 'Black', hex: '#141414' },
      { name: 'Bone', hex: '#EDE6D9' },
    ],
    specs: [
      { label: 'Fabric', value: '220 gsm organic cotton' },
      { label: 'Fit', value: 'Relaxed' },
    ],
    stock: 80,
  },
  {
    name: 'Low-Profile Keyboard',
    slug: 'low-profile-keyboard',
    tagline: 'Quiet scissor switches, full-size layout.',
    description:
      'A slim aluminium keyboard with quiet, precise keys and Bluetooth pairing for up to three devices. Charges over USB-C and lasts weeks per charge.',
    price: 99,
    category: 'workspace',
    image: img('1587829741301-dc798b83add3'),
    colors: [{ name: 'Silver', hex: '#DADCDE' }],
    specs: [
      { label: 'Connection', value: 'Bluetooth / USB-C' },
      { label: 'Battery', value: 'Up to 1 month' },
    ],
    stock: 28,
    featured: true,
  },
  {
    name: 'Contour Wireless Mouse',
    slug: 'contour-wireless-mouse',
    tagline: 'Sculpted for a natural hand position.',
    description:
      'An ergonomic wireless mouse with a silent click, adjustable DPI and a 2.4 GHz receiver that stores inside the shell.',
    price: 45,
    category: 'workspace',
    image: img('1527864550417-7fd91fc51a46'),
    colors: [{ name: 'Titanium', hex: '#7D7F82' }],
    specs: [
      { label: 'DPI', value: '800 - 3200' },
      { label: 'Battery', value: 'AA, up to 12 months' },
    ],
    stock: 45,
  },
  {
    name: 'Arc Desk Lamp',
    slug: 'arc-desk-lamp',
    tagline: 'Adjustable arm, warm dimmable light.',
    description:
      'A steel task lamp with a fully adjustable arm and a dimmable LED that shifts from warm to neutral white. Focused light where you need it, no glare where you do not.',
    price: 129,
    category: 'workspace',
    image: img('1507473885765-e6ed057f782c'),
    colors: [{ name: 'Slate grey', hex: '#5C6166' }],
    specs: [
      { label: 'Light', value: '2700 - 4000 K' },
      { label: 'Power', value: '8 W LED' },
    ],
    stock: 14,
    featured: true,
    isNewArrival: true,
  },
  {
    name: 'Dome Pendant Light',
    slug: 'dome-pendant-light',
    tagline: 'A classic metal dome for kitchens and dining.',
    description:
      'Spun aluminium shade with a matte white finish and an adjustable fabric cord. Pairs well over a dining table or a kitchen island.',
    price: 159,
    category: 'home',
    image: img('1513506003901-1e6a229e2d15'),
    colors: [{ name: 'Matte white', hex: '#F4F4F2' }],
    specs: [
      { label: 'Diameter', value: '35 cm' },
      { label: 'Cord', value: '1.5 m adjustable' },
    ],
    stock: 10,
  },
  {
    name: 'Oak Counter Stool',
    slug: 'oak-counter-stool',
    tagline: 'Solid oak, finished by hand.',
    description:
      'A sturdy counter-height stool in solid white oak with a natural oil finish. Simple joinery, built to last for decades.',
    price: 185,
    category: 'home',
    image: img('1503602642458-232111445657'),
    colors: [{ name: 'Natural oak', hex: '#D9C6A5' }],
    specs: [
      { label: 'Seat height', value: '65 cm' },
      { label: 'Material', value: 'Solid white oak' },
    ],
    stock: 8,
    featured: true,
  },
  {
    name: 'Stoneware Mug',
    slug: 'stoneware-mug',
    tagline: 'Hand-glazed, 350 ml.',
    description:
      'A generous stoneware mug with a satin white glaze and a comfortable handle. Microwave and dishwasher safe.',
    price: 22,
    category: 'home',
    image: img('1514228742587-6b1558fcca3d'),
    colors: [{ name: 'Satin white', hex: '#F1F0EC' }],
    specs: [
      { label: 'Capacity', value: '350 ml' },
      { label: 'Material', value: 'Stoneware' },
    ],
    stock: 70,
  },
  {
    name: 'Lounge Two-Seater Sofa',
    slug: 'lounge-two-seater-sofa',
    tagline: 'Deep seat, compact footprint.',
    description:
      'A two-seater with a deep, supportive seat and removable, washable covers. Fits comfortably in smaller living rooms without giving up comfort.',
    price: 890,
    compareAtPrice: 990,
    category: 'home',
    image: img('1567016432779-094069958ea5'),
    colors: [
      { name: 'Terracotta', hex: '#B4522F' },
      { name: 'Oat', hex: '#D9CDB8' },
    ],
    specs: [
      { label: 'Width', value: '160 cm' },
      { label: 'Covers', value: 'Removable, washable' },
    ],
    stock: 4,
    isNewArrival: true,
  },
];

export default products;
