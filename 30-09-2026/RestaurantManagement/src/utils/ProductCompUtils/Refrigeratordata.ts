export interface FridgeColor {
  name: string;
  hex: string;
}

export type FridgeConfiguration =
  | "Top Freezer"
  | "Bottom Freezer"
  | "Double Door"
  | "Side-by-Side"
  | "French Door"
  | "Single Door";

export interface Refrigerator {
  id: string;
  category: "refrigerators";

  brand: string;
  model: string;
  name: string;
  variant: string;
  image: string;
  price: number;
  releaseDate: string;

  color: FridgeColor;

  capacity: {
    total: string;
    refrigerator: string;
    freezer: string;
  };

  configuration: FridgeConfiguration;

  doors: string;

  convertible: {
    available: boolean;
    description?: string;
  };

  cooling: {
    technology: string;
    type: string;
  };

  compressor: string;

  energyRating: string;

  dimensions: {
    height: string;
    width: string;
    depth: string;
  };

  shelves: string[];

  features: string[];

  dispenser: string;

  smartFeatures: string[];

  noiseLevel: string;

  weight: string;

  warranty: {
    product: string;
    compressor: string;
  };
}


export const refrigeratorSeed: Refrigerator[] = [
  {
    id: "fridge_lg_655",
    category: "refrigerators",
    brand: "LG",
    model: "GL-S257CPZY",
    name: "LG 655L Side-by-Side Refrigerator",
    variant: "655L, Silver",
    image: "",
    price: 89999,
    releaseDate: "2024-01-15",

    color: {
      name: "Shiny Steel",
      hex: "#a7a9ac",
    },

    capacity: {
      total: "655 L",
      refrigerator: "416 L",
      freezer: "239 L",
    },

    configuration: "Side-by-Side",

    doors: "2 Door",

    convertible: {
      available: false,
    },

    cooling: {
      technology: "Multi Air Flow",
      type: "Frost Free",
    },

    compressor: "Smart Inverter Compressor",

    energyRating: "3 Star",

    dimensions: {
      height: "1790 mm",
      width: "912 mm",
      depth: "738 mm",
    },

    shelves: [
      "Tempered Glass Shelves",
      "Door Bins",
      "Vegetable Drawer",
    ],

    features: [
      "Express Freeze",
      "Door Alarm",
      "Smart Diagnosis",
      "Multi Air Flow",
    ],

    dispenser: "Water & Ice Dispenser",

    smartFeatures: [
      "Wi-Fi",
      "Smart Diagnosis",
    ],

    noiseLevel: "Low Noise",

    weight: "110 kg",

    warranty: {
      product: "1 Year",
      compressor: "10 Years",
    },
  },

  {
    id: "fridge_samsung_653",
    category: "refrigerators",
    brand: "Samsung",
    model: "RS76CG8113S9",
    name: "Samsung 653L Side-by-Side Refrigerator",
    variant: "653L, Silver",
    image: "",
    price: 84999,
    releaseDate: "2024-02-10",

    color: {
      name: "Elegant Inox",
      hex: "#8f9193",
    },

    capacity: {
      total: "653 L",
      refrigerator: "409 L",
      freezer: "244 L",
    },

    configuration: "Side-by-Side",

    doors: "2 Door",

    convertible: {
      available: true,
      description: "Convertible freezer",
    },

    cooling: {
      technology: "All Around Cooling",
      type: "Frost Free",
    },

    compressor: "Digital Inverter Compressor",

    energyRating: "3 Star",

    dimensions: {
      height: "1780 mm",
      width: "912 mm",
      depth: "716 mm",
    },

    shelves: [
      "Tempered Glass Shelves",
      "Door Bins",
      "Vegetable Box",
    ],

    features: [
      "Power Cool",
      "Power Freeze",
      "Door Alarm",
      "Twin Cooling Plus",
    ],

    dispenser: "Water Dispenser",

    smartFeatures: [
      "SmartThings",
      "Wi-Fi",
    ],

    noiseLevel: "Low Noise",

    weight: "111 kg",

    warranty: {
      product: "1 Year",
      compressor: "20 Years",
    },
  },

  {
    id: "fridge_whirlpool_265",
    category: "refrigerators",
    brand: "Whirlpool",
    model: "FP 283D",
    name: "Whirlpool 265L Double Door Refrigerator",
    variant: "265L, Steel",
    image: "",
    price: 32999,
    releaseDate: "2024-01-20",

    color: {
      name: "Steel",
      hex: "#777777",
    },

    capacity: {
      total: "265 L",
      refrigerator: "190 L",
      freezer: "75 L",
    },

    configuration: "Double Door",

    doors: "2 Door",

    convertible: {
      available: true,
      description: "Convertible mode",
    },

    cooling: {
      technology: "Zeofrost Technology",
      type: "Frost Free",
    },

    compressor: "Intellisense Inverter Compressor",

    energyRating: "3 Star",

    dimensions: {
      height: "1595 mm",
      width: "560 mm",
      depth: "662 mm",
    },

    shelves: [
      "Toughened Glass Shelves",
      "Bottle Rack",
      "Vegetable Drawer",
    ],

    features: [
      "Fast Cooling",
      "Fast Ice Making",
      "Door Alarm",
      "Humidity Control",
    ],

    dispenser: "No Dispenser",

    smartFeatures: [],

    noiseLevel: "Low Noise",

    weight: "54 kg",

    warranty: {
      product: "1 Year",
      compressor: "10 Years",
    },
  },
];