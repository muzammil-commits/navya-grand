import type { Category, Product, SiteContent } from "./types";

export const INITIAL_CATEGORIES: Omit<Category, "id">[] = [
  {
    slug: "biryani",
    name: "Biryani",
    description:
      "Slow-cooked dum biryanis layered with fragrant aged basmati rice, hand-roasted spices, and saffron.",
    imageUrl: "/images/dishes/chicken-biryani.png",
    sortOrder: 1,
  },
  {
    slug: "andhra-specials",
    name: "Andhra Specials",
    description:
      "Authentic Guntur & coastal Andhra classics crafted with fiery red chillies, curry leaves, and traditional thalis.",
    imageUrl: "/images/dishes/andhra-thali.png",
    sortOrder: 2,
  },
  {
    slug: "starters",
    name: "Starters",
    description:
      "Crisp, aromatic appetizers tossed to order with signature Andhra and South Indian masalas.",
    imageUrl: "/images/dishes/starters.png",
    sortOrder: 3,
  },
  {
    slug: "tandoori",
    name: "Tandoori",
    description:
      "Charcoal-grilled kebabs and tikkas marinated overnight in hung curd and royal North Indian spices.",
    imageUrl: "/images/dishes/tandoori.png",
    sortOrder: 4,
  },
  {
    slug: "chinese",
    name: "Chinese",
    description:
      "Wok-tossed Indo-Chinese favourites prepared piping hot with fresh crunch and balanced sauces.",
    imageUrl: "/images/dishes/chinese.png",
    sortOrder: 5,
  },
  {
    slug: "south-indian",
    name: "South Indian",
    description:
      "Golden dosas, pillowy idlis, and crisp vadas paired with freshly ground chutneys and aromatic sambar.",
    imageUrl: "/images/dishes/south-indian.png",
    sortOrder: 6,
  },
  {
    slug: "seafood",
    name: "Seafood",
    description:
      "Fresh coastal prawns and river/sea fish fillets seared in bold spices, pepper, and curry leaf tadka.",
    imageUrl: "/images/dishes/seafood.png",
    sortOrder: 7,
  },
  {
    slug: "desserts",
    name: "Desserts",
    description:
      "Classic Indian mithai and royal Hyderabadi sweets to end every family meal on a warm note.",
    imageUrl: "/images/dishes/desserts.png",
    sortOrder: 8,
  },
  {
    slug: "beverages",
    name: "Beverages",
    description:
      "Traditional cooling lassis, spiced buttermilk, rose milk, and freshly brewed filter coffee.",
    imageUrl: "/images/dishes/beverages.png",
    sortOrder: 9,
  },
];

export const INITIAL_PRODUCTS: Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>[] = [
  // BIRYANI
  {
    slug: "chicken-biryani",
    name: "Chicken Biryani",
    description:
      "Our signature Navya Grand Chicken Dum Biryani prepared with succulent marinated chicken, aged long-grain basmati rice, caramelized onions, fresh mint, and pure ghee.",
    price: 360,
    categorySlug: "biryani",
    vegType: "non-veg",
    imageUrl: "/images/dishes/chicken-biryani.png",
    isAvailable: true,
    isSignature: true,
    variants: [
      { label: "Regular (Single)", price: 360 },
      { label: "Family Pack (Serves 3-4)", price: 890 },
    ],
    spiceLevel: "medium",
    sortOrder: 1,
  },
  {
    slug: "mutton-biryani",
    name: "Mutton Biryani",
    description:
      "Tender bone-in goat mutton slow-braised in aromatic spices and sealed on dum with saffron-infused basmati rice, served with mirchi ka salan and raita.",
    price: 420,
    categorySlug: "biryani",
    vegType: "non-veg",
    imageUrl: "/images/dishes/mutton-biryani.png",
    isAvailable: true,
    isSignature: true,
    variants: [
      { label: "Regular (Single)", price: 420 },
      { label: "Family Pack (Serves 3-4)", price: 1080 },
    ],
    spiceLevel: "medium",
    sortOrder: 2,
  },
  {
    slug: "veg-biryani",
    name: "Veg Biryani",
    description:
      "Garden-fresh vegetables, golden paneer cubes, roasted cashews, and fragrant basmati rice steamed on dum with whole garam masala.",
    price: 250,
    categorySlug: "biryani",
    vegType: "veg",
    imageUrl: "/images/dishes/veg-biryani.png",
    isAvailable: true,
    isSignature: true,
    variants: [
      { label: "Regular (Single)", price: 250 },
      { label: "Family Pack (Serves 3-4)", price: 620 },
    ],
    spiceLevel: "mild",
    sortOrder: 3,
  },
  {
    slug: "special-chicken-fry-piece-biryani",
    name: "Special Chicken Fry Piece Biryani",
    description:
      "Fragrant biryani rice crowned with crisp, fiery Guntur-style spiced boneless chicken roast pieces and roasted cashews.",
    price: 390,
    categorySlug: "biryani",
    vegType: "non-veg",
    imageUrl: "/images/dishes/chicken-biryani.png",
    isAvailable: true,
    isSignature: false,
    variants: [
      { label: "Single", price: 390 },
      { label: "Jumbo", price: 540 },
    ],
    spiceLevel: "spicy",
    sortOrder: 4,
  },
  {
    slug: "paneer-kaju-biryani",
    name: "Paneer Kaju Biryani",
    description:
      "Soft malai paneer tossed with whole roasted cashews and rich Andhra masala layered inside saffron basmati rice.",
    price: 290,
    categorySlug: "biryani",
    vegType: "veg",
    imageUrl: "/images/dishes/veg-biryani.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "mild",
    sortOrder: 5,
  },

  // ANDHRA SPECIALS
  {
    slug: "andhra-chicken-fry",
    name: "Andhra Chicken Fry",
    description:
      "Classic Guntur Kodi Vepudu pan-roasted with crushed black pepper, aromatic curry leaves, slit green chillies, and whole spices.",
    price: 320,
    categorySlug: "andhra-specials",
    vegType: "non-veg",
    imageUrl: "/images/dishes/andhra-chicken-fry.png",
    isAvailable: true,
    isSignature: true,
    variants: [
      { label: "Half", price: 220 },
      { label: "Full", price: 320 },
    ],
    spiceLevel: "spicy",
    sortOrder: 6,
  },
  {
    slug: "grand-andhra-veg-thali",
    name: "Grand Andhra Veg Thali",
    description:
      "Wholesome traditional Andhra Bhojanam featuring steamed rice, pappu, sambar, rasam, two seasonal curries, fry, gongura pachadi, curd, papad, and sweet.",
    price: 260,
    categorySlug: "andhra-specials",
    vegType: "veg",
    imageUrl: "/images/dishes/andhra-thali.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "medium",
    sortOrder: 7,
  },
  {
    slug: "gongura-mutton-curry",
    name: "Gongura Mutton Curry",
    description:
      "Signature tangy red sorrel leaves (gongura) slow-simmered with tender mutton chunks and Guntur chillies.",
    price: 410,
    categorySlug: "andhra-specials",
    vegType: "non-veg",
    imageUrl: "/images/dishes/andhra-chicken-fry.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "spicy",
    sortOrder: 8,
  },
  {
    slug: "natu-kodi-pulusu",
    name: "Natu Kodi Pulusu",
    description:
      "Traditional country chicken stewed in a deeply spiced onion-coriander gravy, best paired with ragi sangati or steamed rice.",
    price: 380,
    categorySlug: "andhra-specials",
    vegType: "non-veg",
    imageUrl: "/images/dishes/andhra-chicken-fry.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "spicy",
    sortOrder: 9,
  },

  // STARTERS
  {
    slug: "chicken-65",
    name: "Hyderabadi Chicken 65",
    description:
      "Crispy bite-sized boneless chicken tempered with yogurt, curry leaves, garlic, and red chilli glaze.",
    price: 290,
    categorySlug: "starters",
    vegType: "non-veg",
    imageUrl: "/images/dishes/starters.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "spicy",
    sortOrder: 10,
  },
  {
    slug: "crispy-chilli-paneer",
    name: "Paneer 65",
    description:
      "Soft cottage cheese cubes crisped in a spiced batter and tossed with fragrant curry leaves and crushed peppercorns.",
    price: 260,
    categorySlug: "starters",
    vegType: "veg",
    imageUrl: "/images/dishes/starters.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "medium",
    sortOrder: 11,
  },
  {
    slug: "crispy-baby-corn-pepper",
    name: "Crispy Pepper Corn",
    description:
      "Golden-fried sweet corn kernels tossed with diced bell peppers, spring onions, and freshly cracked black pepper.",
    price: 220,
    categorySlug: "starters",
    vegType: "veg",
    imageUrl: "/images/dishes/starters.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "mild",
    sortOrder: 12,
  },

  // TANDOORI
  {
    slug: "tandoori-chicken",
    name: "Royal Tandoori Chicken",
    description:
      "Charcoal-roasted chicken marinated in hung curd, Kashmiri red chilli, ginger-garlic, and kasuri methi, served with mint chutney.",
    price: 340,
    categorySlug: "tandoori",
    vegType: "non-veg",
    imageUrl: "/images/dishes/tandoori.png",
    isAvailable: true,
    isSignature: false,
    variants: [
      { label: "Half (4 Pcs)", price: 340 },
      { label: "Full (8 Pcs)", price: 620 },
    ],
    spiceLevel: "medium",
    sortOrder: 13,
  },
  {
    slug: "murgh-malai-tikka",
    name: "Murgh Malai Tikka",
    description:
      "Creamy boneless chicken morsels marinated with cheese, cardamom, and white pepper, grilled over glowing charcoal.",
    price: 330,
    categorySlug: "tandoori",
    vegType: "non-veg",
    imageUrl: "/images/dishes/tandoori.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "mild",
    sortOrder: 14,
  },
  {
    slug: "paneer-tikka-angara",
    name: "Paneer Tikka Angara",
    description:
      "Charred cottage cheese skewers layered with bell peppers and onions, finished with smoky ghee and chaat masala.",
    price: 280,
    categorySlug: "tandoori",
    vegType: "veg",
    imageUrl: "/images/dishes/tandoori.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "medium",
    sortOrder: 15,
  },

  // CHINESE
  {
    slug: "chicken-hakka-noodles",
    name: "Chicken Hakka Noodles",
    description:
      "Wok-tossed noodles with shredded chicken, crisp cabbage, carrots, capsicum, soy, and toasted garlic.",
    price: 240,
    categorySlug: "chinese",
    vegType: "non-veg",
    imageUrl: "/images/dishes/chinese.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "medium",
    sortOrder: 16,
  },
  {
    slug: "veg-manchurian-noodles",
    name: "Veg Manchurian & Schezwan Noodles",
    description:
      "Crispy vegetable dumplings simmered in tangy garlic soy glaze paired with fiery Schezwan wok noodles.",
    price: 220,
    categorySlug: "chinese",
    vegType: "veg",
    imageUrl: "/images/dishes/chinese.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "medium",
    sortOrder: 17,
  },
  {
    slug: "chilli-chicken-dry",
    name: "Chilli Chicken",
    description:
      "Crispy chicken strips tossed in soy-chilli sauce with green chillies, scallions, and diced onions.",
    price: 290,
    categorySlug: "chinese",
    vegType: "non-veg",
    imageUrl: "/images/dishes/chinese.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "spicy",
    sortOrder: 18,
  },

  // SOUTH INDIAN
  {
    slug: "ghee-masala-dosa",
    name: "Ghee Roast Masala Dosa",
    description:
      "Paper-crisp fermented lentil-rice crepe brushed with pure cow ghee, filled with spiced potato masala, served with 3 chutneys & sambar.",
    price: 140,
    categorySlug: "south-indian",
    vegType: "veg",
    imageUrl: "/images/dishes/south-indian.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "mild",
    sortOrder: 19,
  },
  {
    slug: "tiffin-combo-idli-vada",
    name: "South Indian Tiffin Combo",
    description:
      "Two fluffy steamed idlis, one crisp medu vada, and mini dosa accompanied by coconut chutney, ginger chutney, and hot sambar.",
    price: 160,
    categorySlug: "south-indian",
    vegType: "veg",
    imageUrl: "/images/dishes/south-indian.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "mild",
    sortOrder: 20,
  },

  // SEAFOOD
  {
    slug: "apollo-fish",
    name: "Apollo Fish",
    description:
      "Hyderabadi-style boneless fish fillets crisp-fried and tossed in garlic, curry leaves, green chillies, and spiced yogurt reduction.",
    price: 370,
    categorySlug: "seafood",
    vegType: "non-veg",
    imageUrl: "/images/dishes/seafood.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "spicy",
    sortOrder: 21,
  },
  {
    slug: "andhra-prawns-roast",
    name: "Andhra Prawns Roast",
    description:
      "Juicy tiger prawns pan-seared with Guntur chilli paste, shallots, black pepper, and fresh curry leaves.",
    price: 410,
    categorySlug: "seafood",
    vegType: "non-veg",
    imageUrl: "/images/dishes/seafood.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: "spicy",
    sortOrder: 22,
  },

  // DESSERTS
  {
    slug: "royal-gulab-jamun",
    name: "Royal Gulab Jamun (2 Pcs)",
    description:
      "Melt-in-mouth khoya dumplings soaked in warm cardamom and saffron sugar syrup, garnished with pistachios.",
    price: 120,
    categorySlug: "desserts",
    vegType: "veg",
    imageUrl: "/images/dishes/desserts.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: null,
    sortOrder: 23,
  },
  {
    slug: "double-ka-meetha",
    name: "Shahi Double Ka Meetha",
    description:
      "Rich bread pudding simmered in saffron milk rabri and topped with ghee-roasted cashews and raisins.",
    price: 150,
    categorySlug: "desserts",
    vegType: "veg",
    imageUrl: "/images/dishes/desserts.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: null,
    sortOrder: 24,
  },

  // BEVERAGES
  {
    slug: "kesar-mango-lassi",
    name: "Kesar Mango Lassi",
    description:
      "Thick churned yogurt blended with ripe Alphonso mango pulp, saffron strands, and slivered almonds.",
    price: 130,
    categorySlug: "beverages",
    vegType: "veg",
    imageUrl: "/images/dishes/beverages.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: null,
    sortOrder: 25,
  },
  {
    slug: "madras-filter-coffee",
    name: "Traditional Filter Coffee",
    description:
      "Aromatic Chikmagalur decoction brewed fresh and frothed with rich hot milk in traditional brassware.",
    price: 70,
    categorySlug: "beverages",
    vegType: "veg",
    imageUrl: "/images/dishes/beverages.png",
    isAvailable: true,
    isSignature: false,
    variants: [],
    spiceLevel: null,
    sortOrder: 26,
  },
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  heroSlides: [
    {
      id: "slide-biryani",
      eyebrow: "Welcome to",
      title: "Navya Grand",
      subtitle: "Multi-Cuisine Restaurant, Fine Dining & Banquet Hall",
      tagline: "Good Food • Great Ambience • Lasting Memories",
      desktopImage: "/images/hero/hero-desktop-biryani.png",
      mobileImage: "/images/hero/hero-mobile-biryani.png",
      ctaPrimaryLabel: "Explore Menu",
      ctaPrimaryHref: "/menu",
      ctaSecondaryLabel: "Book a Table",
      ctaSecondaryHref: "/book-a-table",
    },
    {
      id: "slide-dining",
      eyebrow: "Fine Dining in Guntur",
      title: "Royal Hospitality",
      subtitle: "Warm Family Dining, Authentic Andhra & Multi-Cuisine Kitchens",
      tagline: "Crafted Fresh Daily • Hygienic Kitchens • Memorable Evenings",
      desktopImage: "/images/spaces/restaurant-interior.png",
      mobileImage: "/images/spaces/fine-dining.png",
      ctaPrimaryLabel: "Order Online",
      ctaPrimaryHref: "/order-now",
      ctaSecondaryLabel: "Book a Table",
      ctaSecondaryHref: "/book-a-table",
    },
    {
      id: "slide-banquet",
      eyebrow: "Celebrate Every Milestone",
      title: "Grand Banquet Hall",
      subtitle: "Weddings, Receptions, Engagements & Corporate Gatherings",
      tagline: "Custom Catering • Elegant Decor • Dedicated Event Team",
      desktopImage: "/images/hero/hero-banquet.png",
      mobileImage: "/images/spaces/banquet-hall.png",
      ctaPrimaryLabel: "Explore Banquet Hall",
      ctaPrimaryHref: "/banquet-hall",
      ctaSecondaryLabel: "Enquire Now",
      ctaSecondaryHref: "/banquet-hall#enquire",
    },
    {
      id: "slide-andhra",
      eyebrow: "A Taste of Tradition",
      title: "Andhra Specialities",
      subtitle: "Signature Dum Biryanis, Guntur Fry & Traditional Banana Leaf Thalis",
      tagline: "Original Recipes • Hand-Ground Spices • Served with Pride",
      desktopImage: "/images/dishes/andhra-thali.png",
      mobileImage: "/images/dishes/andhra-chicken-fry.png",
      ctaPrimaryLabel: "Order Andhra Specials",
      ctaPrimaryHref: "/menu?category=andhra-specials",
      ctaSecondaryLabel: "Our Hygiene",
      ctaSecondaryHref: "/hygiene-standards",
    },
  ],
  services: [
    {
      id: "multi-cuisine",
      title: "Multi-Cuisine Restaurant & Fine Dining",
      shortDescription:
        "Warm family-friendly dining room serving Indian, Tandoori, Chinese, and Continental dishes.",
      fullDescription:
        "Enjoy an inviting fine-dining ambience in the heart of Vidyanagar, Guntur. From aromatic dum biryanis and North Indian curries to wok-tossed Chinese specialties, every plate is cooked fresh to order.",
      highlights: [
        "Spacious air-conditioned family dining",
        "Attentive table service for lunches & dinners",
        "Curated menu for all age groups",
      ],
      imageUrl: "/images/spaces/fine-dining.png",
      iconName: "utensils",
      actionLabel: "Explore Menu",
      actionHref: "/menu",
    },
    {
      id: "andhra-specials",
      title: "Traditional Andhra Specialities",
      shortDescription:
        "Authentic Guntur recipes, fiery vepudus, gongura curries, and grand banana leaf thalis.",
      fullDescription:
        "Rooted in Andhra culinary heritage, our chefs roast whole Guntur chillies, coriander, and spices in-house to deliver unmistakable regional depth and warmth.",
      highlights: [
        "Freshly ground traditional spice blends",
        "Signature Chicken & Mutton Dum Biryanis",
        "Wholesome Andhra Veg & Non-Veg Thalis",
      ],
      imageUrl: "/images/dishes/andhra-thali.png",
      iconName: "flame",
      actionLabel: "View Andhra Menu",
      actionHref: "/menu?category=andhra-specials",
    },
    {
      id: "banquet-hall",
      title: "Banquet Hall & Event Venue",
      shortDescription:
        "Elegant celebration hall for weddings, receptions, engagements, birthdays, and conferences.",
      fullDescription:
        "Host unforgettable milestones at Navya Grand's banquet venue with customizable seating, stage decor coordination, audiovisual support, and tailored multi-cuisine feast menus.",
      highlights: [
        "Flexible seating for intimate & grand gatherings",
        "Custom veg & non-veg banquet catering packages",
        "Dedicated hospitality & event coordination",
      ],
      imageUrl: "/images/spaces/banquet-hall.png",
      iconName: "crown",
      actionLabel: "Explore Banquet Hall",
      actionHref: "/banquet-hall",
    },
    {
      id: "delivery-takeaway",
      title: "Food Delivery & Takeaway Services",
      shortDescription:
        "Hygienically packed piping-hot meals delivered across Guntur or ready for quick pickup.",
      fullDescription:
        "Order directly through our online store for tamper-evident packaging, live order status updates, and reliable home delivery across supported Guntur neighbourhoods or express takeaway from Vidyanagar Main Road.",
      highlights: [
        "Spill-proof food-grade containers",
        "Real-time order tracking by reference",
        "Express restaurant counter pickup option",
      ],
      imageUrl: "/images/dishes/chicken-biryani.png",
      iconName: "bike",
      actionLabel: "Order Online Now",
      actionHref: "/order-now",
    },
    {
      id: "private-dining",
      title: "Private Dining & Special Gatherings",
      shortDescription:
        "Curated intimate dining setups for family celebrations, anniversaries, and business dinners.",
      fullDescription:
        "Celebrate birthdays, anniversaries, and executive dinners with dedicated seating zones, personalized hospitality, and customized set menus designed around your guests.",
      highlights: [
        "Reserved family & group seating arrangements",
        "Custom pre-order menu planning",
        "Warm celebratory atmosphere",
      ],
      imageUrl: "/images/spaces/private-dining.png",
      iconName: "users",
      actionLabel: "Book a Table",
      actionHref: "/book-a-table",
    },
  ],
  about: {
    heading: "About Navya Grand",
    summary:
      "Navya Grand is a trusted multi-cuisine restaurant, fine dining destination, and banquet hall in Vidyanagar, Guntur. We bring together authentic Andhra heritage and beloved pan-Indian & international cuisines under one welcoming roof.",
    extendedStory:
      "Located at Bolla's Mansion beside Don Bosco on Vidyanagar Main Road, Navya Grand was founded around a simple promise: serve fresh, honest, flavour-rich food with genuine warmth and uncompromised kitchen hygiene. Whether you are dropping in for a family biryani dinner, ordering online from home, or hosting hundreds of loved ones in our banquet hall, every detail is crafted for lasting memories.",
    pillars: [
      {
        title: "Quality Food",
        description: "Hand-picked ingredients, aged basmati, and freshly roasted spices daily.",
        icon: "gem",
      },
      {
        title: "Hygiene First",
        description: "Strict stainless-steel kitchen sanitization and food safety protocols.",
        icon: "shield",
      },
      {
        title: "Customer Satisfaction",
        description: "Warm, attentive hospitality focused on every guest's comfort.",
        icon: "smile",
      },
      {
        title: "Authentic Flavours",
        description: "Time-honoured Andhra & royal dum cooking techniques.",
        icon: "heart",
      },
    ],
    imageUrl: "/images/spaces/restaurant-interior.png",
  },
  testimonials: [
    {
      id: "sample-1",
      name: "Priya Sharma",
      role: "Sample Guest Review",
      quote:
        "Excellent food, warm ambience, and very courteous staff. The Chicken Biryani and Andhra starters are always our family's top pick in Guntur.",
      rating: 5,
      isSample: true,
    },
    {
      id: "sample-2",
      name: "Ramesh Babu",
      role: "Sample Guest Review",
      quote:
        "Authentic Andhra taste paired with clean, comfortable fine dining. Great portions, rich flavours, and seamless table service.",
      rating: 5,
      isSample: true,
    },
    {
      id: "sample-3",
      name: "Sneha Reddy",
      role: "Sample Guest Review",
      quote:
        "We hosted our family celebration in the banquet hall and the arrangements and food quality made the evening truly memorable.",
      rating: 5,
      isSample: true,
    },
    {
      id: "sample-4",
      name: "Karthik Chowdary",
      role: "Sample Guest Review",
      quote:
        "Online takeaway packaging is spill-proof and piping hot. Mutton Biryani and Andhra Chicken Fry are consistently flavourful.",
      rating: 5,
      isSample: true,
    },
  ],
  contact: {
    brandName: "Navya Grand",
    addressLine1: "Bolla's Mansion, Beside Don Bosco",
    addressLine2: "Vidyanagar Main Road",
    city: "Guntur, Andhra Pradesh",
    pincode: "522007",
    primaryPhone: "+91 8500212200",
    landline: "0863-2222100",
    email: "navyagrandguntur@gmail.com",
    whatsappNumber: "918500212200",
    openingHours: "Daily: 11:30 AM – 11:00 PM",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Vidyanagar+Main+Road,+Guntur,+Andhra+Pradesh+522007&output=embed",
    mapDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Navya+Grand+Vidyanagar+Main+Road+Guntur+522007",
  },
  deliveryConfig: {
    supportedCity: "Guntur",
    supportedPincodes: [
      "522001",
      "522002",
      "522003",
      "522004",
      "522005",
      "522006",
      "522007",
      "522008",
      "522009",
      "522034",
    ],
    deliveryFee: 40,
    freeDeliveryAbove: 600,
    taxRatePercent: 5,
    deliveryHoursNote:
      "Local delivery currently available across Guntur city pincodes (522001–522009, 522034). Express takeaway available for all orders.",
    upiId: process.env.RESTAURANT_UPI_ID || "navyagrand@okicici",
    gatewayConfigured: Boolean(
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ),
  },
};

