/* ============================================================================
 * ✏️  BRAND CONFIG — the single place to swap name, texts, colors, menu, etc.
 * ========================================================================== */

// ✏️ SWAP TEXTS: brand name
export const BRAND = {
  name: '[BRAND NOMI]',
  tagline: 'Specialty coffee roaster & cafe',
  since: 2016,
};

// 🎨 SWAP COLORS: keep in sync with tailwind.config.js
export const COLORS = {
  espresso: '#2B1B12',
  cream: '#F5EBDD',
  caramel: '#C68B59',
  gold: '#D4A24C',
};

export const NAV = [
  { label: 'Bosh sahifa', href: '#home' },
  { label: 'Biz haqimizda', href: '#about' },
  { label: 'Menyu', href: '#menu' },
  { label: 'Jarayon', href: '#process' },
  { label: 'Aloqa', href: '#contact' },
];

export const HERO = {
  eyebrow: 'Specialty coffee roaster & cafe',
  line1: 'Har bir qultumda —',
  line2: "san'at",
  subtitle:
    "Dunyoning eng yaxshi plantatsiyalaridan saralangan donlar, o'zimiz qovurgan va ustalarimiz qo'lida damlangan. Har bir finjon — kichik bir marosim.",
  ctaPrimary: 'Buyurtma berish',
  ctaSecondary: "Menyuni ko'rish",
};

export const STORY = {
  eyebrow: 'Biz haqimizda',
  title: "Qahva — bu sabr va mehr bilan yozilgan hikoya",
  paragraphs: [
    "Biz kichik bir qovurish xonasidan boshladik. Bugun esa Efiopiya, Kolumbiya va Braziliyadagi fermerlar bilan to'g'ridan-to'g'ri ishlaymiz.",
    "Har bir partiya qo'lda saralanadi, kichik hajmlarda qovuriladi va 7 kun ichida finjoningizga yetib keladi. Tezlik emas — sifat bizning asosiy qoidamiz.",
  ],
  stats: [
    { value: '12', label: 'mamlakat' },
    { value: '40+', label: 'qahva navi' },
    { value: '7', label: 'kunlik yangilik' },
  ],
};

export const PROCESS = [
  {
    n: '01',
    title: 'Don',
    en: 'Bean',
    text: "Qahva gilosi 1500–2200 m balandlikda qo'lda teriladi. Faqat to'liq pishgan qizil mevalar saralanadi.",
  },
  {
    n: '02',
    title: 'Qovurish',
    en: 'Roast',
    text: "Kichik partiyalarda, har bir navning o'z profili bo'yicha qovuramiz — karamel, shokolad va meva notalari ochiladi.",
  },
  {
    n: '03',
    title: 'Maydalash',
    en: 'Grind',
    text: "Damlashdan bir necha soniya oldin maydalaymiz. Har bir usul uchun aniq zarracha o'lchami tanlanadi.",
  },
  {
    n: '04',
    title: 'Damlash',
    en: 'Brew',
    text: "Suv harorati 93°C, vaqt va nisbat grammgacha aniq. Natija — mukammal muvozanatli finjon.",
  },
];

export type DrinkArt = 'espresso' | 'latte' | 'cappuccino' | 'flatwhite' | 'coldbrew' | 'dessert';

export const MENU: { id: string; name: string; desc: string; price: number; art: DrinkArt; tag?: string }[] = [
  { id: 'espresso', name: 'Espresso', desc: "Quyuq, kuchli, karamel kremali klassika.", price: 22000, art: 'espresso' },
  { id: 'latte', name: 'Latte', desc: "Yumshoq sut ko'pigi va ipakdek ta'm.", price: 32000, art: 'latte', tag: 'Mashhur' },
  { id: 'cappuccino', name: 'Cappuccino', desc: "Teng nisbatdagi espresso, sut va ko'pik.", price: 30000, art: 'cappuccino' },
  { id: 'flatwhite', name: 'Flat White', desc: "Ikki karra ristretto va mikroko'pik.", price: 34000, art: 'flatwhite' },
  { id: 'coldbrew', name: 'Cold Brew', desc: "18 soat sovuq damlangan, tetiklantiruvchi.", price: 36000, art: 'coldbrew', tag: 'Yangi' },
  { id: 'dessert', name: 'Tiramisu', desc: "Uy usulida tayyorlangan espresso desert.", price: 38000, art: 'dessert' },
];

export const SIGNATURE = {
  eyebrow: 'Imzo qahvamiz',
  title: 'Reserve No. 7',
  subtitle: 'Efiopiya · Guji · Yuvilgan usul',
  callouts: [
    { k: 'Kelib chiqishi', v: 'Guji, Efiopiya — 2100 m' },
    { k: "Ta'm notalari", v: 'Jasmin, bergamot, asal' },
    { k: 'Qovurish', v: "O'rta-yengil (Medium light)" },
    { k: 'Narxi', v: "250 g — 189 000 so'm" },
  ],
  cta: 'Reserve buyurtma qilish',
};

export const TESTIMONIALS = [
  {
    name: 'Malika Rahimova',
    role: 'Dizayner',
    text: "Toshkentdagi eng yaxshi flat white. Atmosfera shunchalik iliqki, har ertalab shu yerga qaytgim keladi.",
  },
  {
    name: 'Jasur Karimov',
    role: 'Tadbirkor',
    text: "Reserve No. 7 ni uyga buyurtma qildim — jasmin notalari haqiqatan ham sezilarli. Bu oddiy qahva emas, tajriba.",
  },
  {
    name: 'Dilnoza Yusupova',
    role: 'Shifokor',
    text: "Baristalar har bir nav haqida soatlab gapira oladi. Xizmat, ta'm va dizayn — hammasi yuqori darajada.",
  },
  {
    name: 'Timur Aliyev',
    role: 'Dasturchi',
    text: "Cold brew yozning eng zo'r kashfiyoti bo'ldi. Telegram orqali buyurtma berish ham juda qulay.",
  },
];

// ✏️ SWAP TEXTS: contact details
export const CONTACT = {
  address: "Toshkent sh., Amir Temur ko'chasi, 15",
  phone: '+998 90 123 45 67',
  phoneHref: 'tel:+998901234567',
  instagram: '@brandnomi.coffee',
  instagramHref: 'https://instagram.com/',
  telegram: '@brandnomi_coffee',
  telegramHref: 'https://t.me/',
  hours: 'Har kuni 08:00 – 23:00',
  email: 'hello@brandnomi.uz',
};

export const CTA = {
  eyebrow: 'Sizni kutyapmiz',
  title: "Ta'mni his qiling",
  button: 'Buyurtma berish',
};

export const formatPrice = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;
