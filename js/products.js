// RETRO BELLA — Temporary Product Data (dummy dataset)
// ---------------------------------------------------------------
// Ye ek hi jagah hai jahan saare products ka data rehta hai.
// Cart, Wishlist, Sort & Filter — sab isi array se kaam karenge.
// Baad mein jab MySQL database ready hoga, bas is array ko
// API / fetch() se aane wale data se replace kar dena.
//
// Fields:
//   id        -> unique id (cart / wishlist isi se product pehchante hain)
//   name      -> product ka naam
//   category  -> women | men | bags | dresses | footwear  (filter ke liye)
//   price     -> NUMBER (sort aur total calculation ke liye; "$" nahi)
//   image     -> image ka path
//   contain   -> true = poori image dikhao (white bg wali photos)
//   sizes     -> available sizes (size filter ke liye)
//   color     -> main colour name (colour filter ke liye)
//   c1, c2    -> image na mile to gradient ke colors
// ---------------------------------------------------------------

const PRODUCTS = [
  { id: "w01", name: "Structured Blazer", category: "women", price: 420, image: "Images/top1.jpg", contain: false, sizes: ["S", "M", "L", "XL", "XXL"], color: "Red", c1: "#F7ECE4", c2: "#C9998C" },
  { id: "w02", name: "Silk Wrap Blouse", category: "women", price: 260, image: "Images/top2.jpg", contain: false, sizes: ["XS", "M", "L", "XL", "XXL"], color: "Neutral", c1: "#F2E3D8", c2: "#E4CFC2" },
  { id: "w03", name: "Tapered Wool Trousers", category: "women", price: 340, image: "Images/top3.jpg", contain: false, sizes: ["XS", "S", "L", "XL", "XXL"], color: "Red", c1: "#C9998C", c2: "#4D0909" },
  { id: "w04", name: "Women's Style 04", category: "women", price: 180, image: "Images/top4.jpg", contain: false, sizes: ["XS", "S", "M", "XL", "XXL"], color: "Neutral", c1: "#F2E3D8", c2: "#B37868" },
  { id: "w05", name: "Women's Style 05", category: "women", price: 220, image: "Images/top5.jpg", contain: false, sizes: ["XS", "S", "M", "L", "XXL"], color: "Neutral", c1: "#E4CFC2", c2: "#4D0909" },
  { id: "w06", name: "Women's Style 06", category: "women", price: 240, image: "Images/top6.jpg", contain: false, sizes: ["XS", "S", "M", "L", "XL"], color: "Neutral", c1: "#F7ECE4", c2: "#320606" },
  { id: "w07", name: "Women's Style 07", category: "women", price: 260, image: "Images/top1.jpg", contain: false, sizes: ["S", "M", "L", "XL", "XXL"], color: "Neutral", c1: "#C9998C", c2: "#B37868" },
  { id: "w08", name: "Women's Style 08", category: "women", price: 280, image: "Images/top8.jpg", contain: false, sizes: ["XS", "M", "L", "XL", "XXL"], color: "Neutral", c1: "#F2E3D8", c2: "#4D0909" },
  { id: "w09", name: "Women's Style 09", category: "women", price: 300, image: "Images/top9.jpg", contain: false, sizes: ["XS", "S", "L", "XL", "XXL"], color: "Neutral", c1: "#E4CFC2", c2: "#320606" },
  { id: "w10", name: "Women's Style 10", category: "women", price: 320, image: "Images/top10.jpg", contain: false, sizes: ["XS", "S", "M", "XL", "XXL"], color: "Neutral", c1: "#F7ECE4", c2: "#B37868" },
  { id: "w11", name: "Women's Style 11", category: "women", price: 350, image: "Images/top11.jpg", contain: false, sizes: ["XS", "S", "M", "L", "XXL"], color: "Neutral", c1: "#F7ECE4", c2: "#B37868" },
  { id: "w12", name: "Women's Style 12", category: "women", price: 380, image: "Images/top12.jpg", contain: false, sizes: ["XS", "S", "M", "L", "XL"], color: "Neutral", c1: "#F7ECE4", c2: "#B37868" },
  { id: "m01", name: "Half-Black Knitted Collar Shirt", category: "men", price: 560, image: "Images/men1.jpeg", contain: false, sizes: ["S", "M", "XL", "XXL"], color: "Black", c1: "#B37868", c2: "#4D0909" },
  { id: "m02", name: "Half-White Knitted Collar Shirt", category: "men", price: 190, image: "Images/men2.jpeg", contain: false, sizes: ["S", "M", "L", "XXL"], color: "White", c1: "#E4CFC2", c2: "#4D0909" },
  { id: "m03", name: "Black T-Shirt", category: "men", price: 310, image: "Images/men3.jpeg", contain: false, sizes: ["S", "M", "L", "XL"], color: "Black", c1: "#320606", c2: "#320606" },
  { id: "m04", name: "Knitted Brown Shirt", category: "men", price: 560, image: "Images/men4.jpeg", contain: false, sizes: ["M", "L", "XL", "XXL"], color: "Brown", c1: "#B37868", c2: "#4D0909" },
  { id: "m05", name: "Cotton Half Sleeved Black Shirt", category: "men", price: 560, image: "Images/men5.jpeg", contain: false, sizes: ["S", "L", "XL", "XXL"], color: "Black", c1: "#B37868", c2: "#4D0909" },
  { id: "m06", name: "Full Sleeves White Shirt", category: "men", price: 560, image: "Images/men6.jpeg", contain: false, sizes: ["S", "M", "XL", "XXL"], color: "White", c1: "#B37868", c2: "#4D0909" },
  { id: "m07", name: "White Shirt with Black Stripes", category: "men", price: 560, image: "Images/men7.jpeg", contain: false, sizes: ["S", "M", "L", "XXL"], color: "Multi", c1: "#B37868", c2: "#4D0909" },
  { id: "m08", name: "Sea-Blue Cotton Shirt", category: "men", price: 560, image: "Images/men8.jpeg", contain: false, sizes: ["S", "M", "L", "XL"], color: "Blue", c1: "#B37868", c2: "#4D0909" },
  { id: "m09", name: "Designer Full Sleeves Shirt", category: "men", price: 560, image: "Images/men9.jpeg", contain: false, sizes: ["M", "L", "XL", "XXL"], color: "Multi", c1: "#B37868", c2: "#4D0909" },
  { id: "m10", name: "Maroon Textured Half-Sleeved Shirt", category: "men", price: 560, image: "Images/men10.jpeg", contain: false, sizes: ["S", "L", "XL", "XXL"], color: "Red", c1: "#B37868", c2: "#4D0909" },
  { id: "m11", name: "Acid-Wash Black T-Shirt", category: "men", price: 560, image: "Images/men11.jpeg", contain: false, sizes: ["S", "M", "XL", "XXL"], color: "Black", c1: "#B37868", c2: "#4D0909" },
  { id: "m12", name: "Knitted Polo Navy Blue T-Shirt", category: "men", price: 560, image: "Images/men12.jpeg", contain: false, sizes: ["S", "M", "L", "XXL"], color: "Blue", c1: "#B37868", c2: "#4D0909" },
  { id: "b01", name: "Crystal Bead Top-Handle Bag", category: "bags", price: 395, image: "Images/bag1.jpg", contain: true, sizes: ["One Size"], color: "Neutral", c1: "#E4CFC2", c2: "#4D0909" },
  { id: "b02", name: "Tapestry Chain Shoulder Bag", category: "bags", price: 550, image: "Images/bag2.jpg", contain: true, sizes: ["One Size"], color: "Multi", c1: "#F2E3D8", c2: "#C9998C" },
  { id: "b03", name: "Suede Shearling Hobo", category: "bags", price: 475, image: "Images/bag3.jpg", contain: true, sizes: ["One Size"], color: "Brown", c1: "#C9998C", c2: "#320606" },
  { id: "b04", name: "Floral Saddle Bag", category: "bags", price: 625, image: "Images/bag4.jpg", contain: true, sizes: ["One Size"], color: "Multi", c1: "#F7ECE4", c2: "#B37868" },
  { id: "b05", name: "Floral Sequin Shoulder Bag", category: "bags", price: 410, image: "Images/bag5.jpg", contain: true, sizes: ["One Size"], color: "Multi", c1: "#E4CFC2", c2: "#C9998C" },
  { id: "b06", name: "Tweed Classic Flap", category: "bags", price: 790, image: "Images/bag6.jpg", contain: true, sizes: ["One Size"], color: "Brown", c1: "#320606", c2: "#320606" },
  { id: "b07", name: "Sunset Woven Shoulder Bag", category: "bags", price: 610, image: "Images/bag7.jpg", contain: true, sizes: ["One Size"], color: "Multi", c1: "#F7ECE4", c2: "#B37868" },
  { id: "b08", name: "Striped Crochet Tote", category: "bags", price: 340, image: "Images/bag8.jpg", contain: true, sizes: ["One Size"], color: "Multi", c1: "#E4CFC2", c2: "#4D0909" },
  { id: "d01", name: "Satin Lace-Trim Slip Dress", category: "dresses", price: 340, image: "Images/dress1.jpg", contain: true, sizes: ["XS", "S", "L", "XL"], color: "Pink", c1: "#E4CFC2", c2: "#4D0909" },
  { id: "d02", name: "Tweed Halter Peplum Dress", category: "dresses", price: 455, image: "Images/dress2.jpg", contain: true, sizes: ["XS", "S", "M", "XL"], color: "Brown", c1: "#320606", c2: "#320606" },
  { id: "d03", name: "Ombré Sequin Mini Dress", category: "dresses", price: 520, image: "Images/dress3.jpg", contain: true, sizes: ["XS", "S", "M", "L"], color: "Multi", c1: "#F7ECE4", c2: "#C9998C" },
  { id: "d04", name: "One-Shoulder Satin Gown", category: "dresses", price: 780, image: "Images/dress4.jpg", contain: true, sizes: ["S", "M", "L", "XL"], color: "Neutral", c1: "#F2E3D8", c2: "#B37868" },
  { id: "d05", name: "Plunge Sequin Halter Dress", category: "dresses", price: 410, image: "Images/dress5.jpg", contain: true, sizes: ["XS", "M", "L", "XL"], color: "Neutral", c1: "#B37868", c2: "#320606" },
  { id: "d06", name: "Polka Dot Halter Mini Dress", category: "dresses", price: 295, image: "Images/dress6.jpg", contain: true, sizes: ["XS", "S", "L", "XL"], color: "Multi", c1: "#E4CFC2", c2: "#4D0909" },
  { id: "d07", name: "Ivory Bow Tweed Mini Dress", category: "dresses", price: 800, image: "Images/dress7.png", contain: true, sizes: ["XS", "S", "M", "XL"], color: "White", c1: "#E4CFC2", c2: "#4D0909" },
  { id: "d08", name: "Ombré Sequin Mini Dress", category: "dresses", price: 520, image: "Images/dress8.jpg", contain: true, sizes: ["XS", "S", "M", "L"], color: "Multi", c1: "#F7ECE4", c2: "#C9998C" },
  { id: "d09", name: "Ombré Sequin Mini Dress", category: "dresses", price: 520, image: "Images/dress9.jpg", contain: true, sizes: ["S", "M", "L", "XL"], color: "Multi", c1: "#F7ECE4", c2: "#C9998C" },
  { id: "d10", name: "Ombré Sequin Mini Dress", category: "dresses", price: 520, image: "Images/dress10.jpg", contain: true, sizes: ["XS", "M", "L", "XL"], color: "Multi", c1: "#F7ECE4", c2: "#C9998C" },
  { id: "d11", name: "Ombré Sequin Mini Dress", category: "dresses", price: 520, image: "Images/dress11.jpg", contain: true, sizes: ["XS", "S", "L", "XL"], color: "Multi", c1: "#F7ECE4", c2: "#C9998C" },
  { id: "f01", name: "Bloom Strap Sandal", category: "footwear", price: 890, image: "Images/shoe1.png", contain: true, sizes: ["6", "7", "8", "10"], color: "Multi", c1: "#4E8E86", c2: "#4D0909" },
  { id: "f02", name: "Ombré Crystal Pump", category: "footwear", price: 1450, image: "Images/shoe2.png", contain: true, sizes: ["6", "7", "8", "9"], color: "Multi", c1: "#E8C948", c2: "#C9337A" },
  { id: "f03", name: "Lilac Fringe Sandal", category: "footwear", price: 980, image: "Images/shoe3.png", contain: true, sizes: ["7", "8", "9", "10"], color: "Purple", c1: "#E8C9DD", c2: "#8A6E96" },
  { id: "f04", name: "Denim Monogram Sandal", category: "footwear", price: 1290, image: "Images/shoe4.png", contain: true, sizes: ["6", "8", "9", "10"], color: "Multi", c1: "#1F2E4A", c2: "#C9998C" },
  { id: "f05", name: "Slouch Knee-High Boot", category: "footwear", price: 760, image: "Images/shoe5.png", contain: true, sizes: ["6", "7", "9", "10"], color: "Brown", c1: "#3B2417", c2: "#4D0909" },
  { id: "f06", name: "Butter Yellow Slide", category: "footwear", price: 650, image: "Images/shoe6.png", contain: true, sizes: ["6", "7", "8", "10"], color: "Yellow", c1: "#F2D97B", c2: "#C9998C" },
  { id: "f07", name: "Bow Slingback Pump", category: "footwear", price: 890, image: "Images/shoe7.png", contain: true, sizes: ["6", "7", "8", "9"], color: "Red", c1: "#5A1414", c2: "#C9998C" },
  { id: "f08", name: "Emerald Retro Sneaker", category: "footwear", price: 120, image: "Images/shoe8.png", contain: true, sizes: ["7", "8", "9", "10"], color: "Green", c1: "#1E4A3A", c2: "#4D0909" },
  { id: "f09", name: "Toile Print Slide", category: "footwear", price: 650, image: "Images/shoe9.png", contain: true, sizes: ["6", "8", "9", "10"], color: "Multi", c1: "#E58BA6", c2: "#8A1F3D" },
  { id: "f10", name: "Pistachio Crystal Mule", category: "footwear", price: 980, image: "Images/shoe10.png", contain: true, sizes: ["6", "7", "9", "10"], color: "Green", c1: "#B6D98A", c2: "#4D0909" },
  { id: "f11", name: "Ivory Crystal Ankle-Strap Pump", category: "footwear", price: 980, image: "Images/shoe11.jpg", contain: true, sizes: ["6", "7", "8", "10"], color: "White", c1: "#B6D98A", c2: "#4D0909" },
  { id: "f12", name: "Blush Lace Slingback", category: "footwear", price: 980, image: "Images/shoe14.png", contain: true, sizes: ["6", "7", "8", "9"], color: "Pink", c1: "#B6D98A", c2: "#4D0909" },
];

// Helper: id se product dhundo
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
