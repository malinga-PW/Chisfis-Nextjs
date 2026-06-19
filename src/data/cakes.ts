export interface TCakeListing {
  id: string
  vendorName: string
  vendorLogo: string
  title: string
  province: string
  town: string
  subArea: string
  deliveryAreas: string[]
  price: number
  rating: number
  reviewsCount: number
  featuredImage: string
  gallery: string[]
  categories: string[]
  specialties: string[]
  isEgglessAvailable: boolean
  isGlutenFreeAvailable: boolean
  isHalalCertified: boolean
  minOrderNotice: string
}

const LOGO = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6B35&color=fff&size=128&bold=true&format=png`

const IMG = {
  cake1: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  cake2: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80',
  cake3: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
  cake4: 'https://images.unsplash.com/photo-1486427944544-d2c246c4e0c6?auto=format&fit=crop&w=800&q=80',
  cake5: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
  cake6: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
  cake7: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
  cake8: 'https://images.unsplash.com/photo-1509365465985-25d11c1e4c6a?auto=format&fit=crop&w=800&q=80',
  cake9: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  cake10: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80',
}

const gallery = (main: string): string[] => {
  const all = Object.values(IMG)
  const others = all.filter((img) => img !== main)
  const shuffled = [...others].sort(() => Math.random() - 0.5)
  return [main, shuffled[0], shuffled[1]]
}

export const DEMO_CAKES_DATA: TCakeListing[] = [
  {
    id: 'nimru-athurugiriya',
    vendorName: 'Nimru Cakes with Love',
    vendorLogo: LOGO('Nimru'),
    title: 'Elegant Wedding & Birthday Cakes – Custom Orders',
    province: 'Western Province',
    town: 'Athurugiriya',
    subArea: 'Athurugiriya Town',
    deliveryAreas: ['Athurugiriya', 'Malabe', 'Kaduwela', 'Battaramulla', 'Colombo 05'],
    price: 8500,
    rating: 4.9,
    reviewsCount: 124,
    featuredImage: IMG.cake1,
    gallery: gallery(IMG.cake1),
    categories: ['Wedding Cakes', 'Birthday Cakes', 'Custom Design'],
    specialties: ['Fondant', 'Buttercream', 'Sugar Flowers'],
    isEgglessAvailable: true,
    isGlutenFreeAvailable: false,
    isHalalCertified: true,
    minOrderNotice: '48 hours',
  },
  {
    id: 'kcct-kiribathgoda',
    vendorName: 'KCCT Cakes',
    vendorLogo: LOGO('KCCT'),
    title: 'Artisan Cupcakes & Celebration Cakes',
    province: 'Western Province',
    town: 'Kiribathgoda',
    subArea: 'Kiribathgoda Town',
    deliveryAreas: ['Kiribathgoda', 'Kelaniya', 'Wattala', 'Colombo 02', 'Colombo 10'],
    price: 4200,
    rating: 4.7,
    reviewsCount: 89,
    featuredImage: IMG.cake2,
    gallery: gallery(IMG.cake2),
    categories: ['Cupcakes', 'Celebration Cakes', 'Desserts'],
    specialties: ['Whipped Cream', 'Chocolate Ganache', 'Fruit Toppings'],
    isEgglessAvailable: true,
    isGlutenFreeAvailable: true,
    isHalalCertified: true,
    minOrderNotice: '24 hours',
  },
  {
    id: 'kavi-happy-rajanganaya',
    vendorName: 'Kavi Happy Cakes',
    vendorLogo: LOGO('Kavi'),
    title: 'Traditional Sri Lankan Cakes & Party Bakes',
    province: 'North Western Province',
    town: 'Rajanganaya',
    subArea: 'Rajanganaya Town',
    deliveryAreas: ['Rajanganaya', 'Anuradhapura', 'Thambuttegama', 'Galgamuwa', 'Ehetuwewa'],
    price: 3200,
    rating: 4.8,
    reviewsCount: 67,
    featuredImage: IMG.cake3,
    gallery: gallery(IMG.cake3),
    categories: ['Traditional Cakes', 'Party Cakes', 'Fruit Cakes'],
    specialties: ['Love Cake', 'Biscuit Pudding', 'Sri Lankan Bakes'],
    isEgglessAvailable: false,
    isGlutenFreeAvailable: false,
    isHalalCertified: true,
    minOrderNotice: '72 hours',
  },
  {
    id: 'perera-mulleriyawa',
    vendorName: 'Perera & Sons',
    vendorLogo: LOGO('Perera+Sons'),
    title: 'Fresh Cream Cakes & Pastries for Every Occasion',
    province: 'Western Province',
    town: 'Mulleriyawa',
    subArea: 'Mulleriyawa Town',
    deliveryAreas: ['Mulleriyawa', 'Angoda', 'Kotikawatta', 'Colombo 09', 'Wellampitiya'],
    price: 3800,
    rating: 4.5,
    reviewsCount: 203,
    featuredImage: IMG.cake4,
    gallery: gallery(IMG.cake4),
    categories: ['Cream Cakes', 'Pastries', 'Celebration Cakes'],
    specialties: ['Fresh Cream', 'Chocolate Mousse', 'Fruit Cocktail'],
    isEgglessAvailable: true,
    isGlutenFreeAvailable: false,
    isHalalCertified: true,
    minOrderNotice: '24 hours',
  },
  {
    id: 'perera-malabe',
    vendorName: 'Perera & Sons',
    vendorLogo: LOGO('Perera+Sons'),
    title: 'Designer Cakes & Custom Birthday Specials',
    province: 'Western Province',
    town: 'Malabe',
    subArea: 'Malabe Town',
    deliveryAreas: ['Malabe', 'Kaduwela', 'Battaramulla', 'Athurugiriya', 'Colombo 07'],
    price: 5500,
    rating: 4.6,
    reviewsCount: 156,
    featuredImage: IMG.cake5,
    gallery: gallery(IMG.cake5),
    categories: ['Designer Cakes', 'Birthday Cakes', 'Custom Design'],
    specialties: ['Mirror Glaze', 'Drip Cakes', 'Photo Cakes'],
    isEgglessAvailable: true,
    isGlutenFreeAvailable: true,
    isHalalCertified: true,
    minOrderNotice: '48 hours',
  },
]
