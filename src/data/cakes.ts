export interface TCakeListing {
  id: string
  vendorName: string
  title: string
  deliveryAreas: string[]
  price: number
  rating: number
  reviewsCount: number
  featuredImage: string
}

export const DEMO_CAKES_DATA: TCakeListing[] = [
  {
    id: 'cake-1',
    vendorName: 'Sweet Tooth Bakers',
    title: 'Custom Chocolate Truffle Birthday Cake',
    deliveryAreas: ['Colombo 03', 'Colombo 07', 'Nugegoda'],
    price: 5500,
    rating: 4.8,
    reviewsCount: 124,
    featuredImage:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cake-2',
    vendorName: 'Nimru Cakes',
    title: 'Elegant Vanilla Fondant Wedding Cake',
    deliveryAreas: ['Colombo 07', 'Dehiwala', 'Maharagama'],
    price: 12000,
    rating: 4.9,
    reviewsCount: 89,
    featuredImage:
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cake-3',
    vendorName: 'Crumbs & Frost',
    title: 'Assorted Cupcake Box (12 pcs)',
    deliveryAreas: ['Colombo 03', 'Nugegoda', 'Dehiwala'],
    price: 3200,
    rating: 4.6,
    reviewsCount: 203,
    featuredImage:
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cake-4',
    vendorName: 'The Cake Studio',
    title: 'Red Velvet Celebration Cake',
    deliveryAreas: ['Colombo 07', 'Maharagama'],
    price: 4800,
    rating: 4.7,
    reviewsCount: 67,
    featuredImage:
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cake-5',
    vendorName: 'Batter & Bake',
    title: 'Premium Fruit Cake with Dry Fruits',
    deliveryAreas: ['Nugegoda', 'Dehiwala', 'Maharagama'],
    price: 6800,
    rating: 4.5,
    reviewsCount: 156,
    featuredImage:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cake-6',
    vendorName: 'Frosted Bliss',
    title: 'French Macaron Tower (50 pcs)',
    deliveryAreas: ['Colombo 03', 'Colombo 07', 'Dehiwala'],
    price: 9500,
    rating: 4.9,
    reviewsCount: 42,
    featuredImage:
      'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cake-7',
    vendorName: 'Cake Cartel',
    title: 'Custom Photo Cake for Any Occasion',
    deliveryAreas: ['Colombo 03', 'Nugegoda', 'Maharagama'],
    price: 3800,
    rating: 4.4,
    reviewsCount: 218,
    featuredImage:
      'https://images.unsplash.com/photo-1486427944544-d2c246c4e0c6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cake-8',
    vendorName: 'Sugar & Spice',
    title: ' artisan Cheesecake with Berry Topping',
    deliveryAreas: ['Colombo 07', 'Nugegoda', 'Dehiwala', 'Maharagama'],
    price: 4200,
    rating: 4.7,
    reviewsCount: 95,
    featuredImage:
      'https://images.unsplash.com/photo-1509365465985-25d11c1e4c6a?auto=format&fit=crop&w=800&q=80',
  },
]
