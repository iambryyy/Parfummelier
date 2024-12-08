export const accordColors: Record<string, string> = {
  aldehydic: "#d8e9f6",
  almond: "#f1e3c5",
  amber: "#bc4d10",
  animalic: "#8E4B13",
  anis: "#e7ceec",
  aquatic: "#63cce2",
  aromatic: "#37a089",
  balsamic: "#ad8359",
  beeswax: "#F0B642",
  bitter: "#C1C316",
  cacao: "#9a3a0d",
  camphor: "#5D6E27",
  caramel: "#DDA356",
  cherry: "#ce1d33",
  chocolate: "#603000",
  cinnamon: "#D2691E",
  citrus: "#F9FF52",
  coconut: "#f1e8d4",
  coffee: "#503B1D",
  conifer: "#1b422f",
  earthy: "#544838",
  floral: "#FF5F8D",
  fresh: "#9be5ed",
  "fresh spicy": "#83C928",
  fruity: "#FC4B29",
  green: "#0E8C1D",
  herbal: "#6CA47F",
  honey: "#FAA907",
  iris: "#b7a7d7",
  lactonic: "#fbf9f2",
  lavender: "#e7ceec",
  leather: "#78483A",
  marine: "#0E529B",
  metallic: "#97B0B7",
  mineral: "#71BBBF",
  mossy: "#5B6B32",
  musky: "#E7D8EA",
  nutty: "#b4955f",
  oud: "#544136",
  ozonic: "#C9FDFB",
  patchouli: "#63652e",
  powdery: "#EEDDCC",
  rose: "#FE016B",
  rum: "#AC2005",
  salty: "#e9fff9",
  smoky: "#827487",
  soapy: "#E3F6FC",
  "soft spicy": "#E27752",
  sweet: "#ee363b",
  terpenic: "#d89f00",
  tobacco: "#ad7727",
  tropical: "#f6af09",
  tuberose: "#ebfaf3",
  vanilla: "#FFFEC0",
  violet: "#9c1dff",
  "warm spicy": "#CC3300",
  whiskey: "#D89E36",
  "white floral": "#edf2fb",
  woody: "#774414",
  "yellow floral": "#FFDC10",
};

// Utility function to determine if a color is light
export const isLightColor = (hexColor: string): boolean => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};
