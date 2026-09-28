
export const products = [
  {
    id: 1,
    name: "Vega 55\" 4K Smart TV",
    category: "TVs",
    price: 45999,
    stock: 5,
    description:
      "55-inch 4K UHD Smart TV with HDR10, Dolby Audio, and built-in streaming apps.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4FWfH8VGMpp3TCSjl3iYeB1axKjIGXzUFcU2wQpVxdQ&s=10",
  },
  {
    id: 2,
    name: "Nova X12 Pro Smartphone",
    category: "Mobile Phones",
    price: 54999,
    stock: 24,
    description:
      "6.7-inch AMOLED smartphone with a triple-camera system, 5G connectivity, and fast charging.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIgr25T0wY7JBnz77Ntkq2FsX2Eo_lFXYk-S47eIehWw&s",
  },
  {
    id: 3,
    name: "Frostline Double-Door Refrigerator",
    category: "Large Appliances",
    price: 62999,
    stock: 8,
    description:
      "Double-door frost-free refrigerator with spacious storage and adjustable temperature control.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMHyqEiNs0k-fH5_V9LCidob000ib5m7PK99uKYQNTGQ&s=10",
  },
  {
    id: 4,
    name: "CleanCycle Front-Load Washer",
    category: "Large Appliances",
    price: 38999,
    stock: 11,
    description:
      "Front-load washing machine with steam wash, quick wash mode, and multiple wash programs.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm0lmxDL9Jt0TDuKrLzc77q0HzcC8kT2-iM9Yv2kprPQ&s=10",
  },
  {
    id: 5,
    name: "Zenbook Pro 14 Laptop",
    category: "Computers",
    price: 59000,
    stock: 18,
    description:
      "14-inch performance laptop with 12-core processor, 16GB RAM, and 512GB SSD.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8oNCV7csoInS5ym2pfrzq_-OtEqXpCVaX7EPC7LPWIQ&s=10",
  },
  {
    id: 6,
    name: "Lumix Pro DSLR Camera",
    category: "Cameras",
    price: 74999,
    stock: 9,
    description:
      "24MP DSLR camera with kit lens, 4K video recording, fast autofocus, and image stabilization.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA3eeCCQrrHl2gpN2rtnSNSD6nbxn0TEFebjjf6RpRgJ6BD04dV0OY8_A&s=10",
  },
];
export const productColumns = [
  {
    key: "name",
    label: "Product Name",
    type: "text",
    required: true,
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      "TVs",
      "Mobile Phones",
      "Large Appliances",
      "Computers",
      "Cameras",
    ],
  },
  {
    key: "price",
    label: "Price",
    type: "number",
    required: true,
  },
  {
    key: "stock",
    label: "Stock",
    type: "number",
    required: true,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  {
    key: "image",
    label: "Image URL",
    type: "text",
    required: true,
  },
];
