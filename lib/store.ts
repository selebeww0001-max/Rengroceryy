import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: string
  description: string
}

export interface PaymentMethod {
  id: string
  type: 'qris' | 'number'
  name: string
  value: string
  qrisImage?: string
}

export interface Order {
  id: string
  productId: string
  productName: string
  telegramUsername: string
  paymentProof: string
  paymentMethod: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  createdAt: string
}

export interface Message {
  id: string
  from: string
  content: string
  createdAt: string
  read: boolean
}

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

interface StoreState {
  isModeratorMode: boolean
  products: Product[]
  paymentMethods: PaymentMethod[]
  orders: Order[]
  messages: Message[]
  reviews: Review[]
  
  login: (password: string) => boolean
  logout: () => void
  
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => void
  deletePaymentMethod: (id: string) => void
  
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void
  updateOrderStatus: (id: string, status: Order['status'], rejectionReason?: string) => void
  
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void
  markMessageRead: (id: string) => void
  deleteMessage: (id: string) => void

  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  deleteReview: (id: string) => void
}

const MODERATOR_PASSWORD = '852013'

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      isModeratorMode: false,
      products: [
        { id: '1', name: 'Premium Account', price: 50000, image: '/products/product1.jpg', stock: '99+', description: 'Akun premium dengan fitur lengkap' },
        { id: '2', name: 'VIP Membership', price: 100000, image: '/products/product2.jpg', stock: '50', description: 'Membership VIP akses unlimited' },
        { id: '3', name: 'Digital License', price: 75000, image: '/products/product3.jpg', stock: '25', description: 'Lisensi digital original' },
        { id: '4', name: 'Game Credits', price: 25000, image: '/products/product4.jpg', stock: '999+', description: 'Top up kredit game' },
      ],
      paymentMethods: [
        { id: '1', type: 'qris', name: 'QRIS', value: 'Scan QR untuk bayar', qrisImage: '' },
        { id: '2', type: 'number', name: 'DANA', value: '081234567890' },
      ],
      orders: [],
      messages: [],
      reviews: [
        { id: '1', name: 'Budi Santoso', rating: 5, comment: 'Pelayanan cepat dan responsif! Produk langsung dikirim setelah transfer dikonfirmasi.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '2', name: 'Rina Wijaya', rating: 5, comment: 'Sudah langganan dari dulu, tidak pernah mengecewakan. Admin ramah dan fast response.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: '3', name: 'Ahmad Fauzi', rating: 5, comment: 'Harga murah, proses cepat. Mantap! Pasti balik lagi untuk order berikutnya.', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      ],

      login: (password) => {
        if (password === MODERATOR_PASSWORD) { set({ isModeratorMode: true }); return true }
        return false
      },
      logout: () => set({ isModeratorMode: false }),

      addProduct: (product) => set((state) => ({ products: [...state.products, { ...product, id: Date.now().toString() }] })),
      updateProduct: (id, product) => set((state) => ({ products: state.products.map((p) => p.id === id ? { ...p, ...product } : p) })),
      deleteProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

      addPaymentMethod: (method) => set((state) => ({ paymentMethods: [...state.paymentMethods, { ...method, id: Date.now().toString() }] })),
      updatePaymentMethod: (id, method) => set((state) => ({ paymentMethods: state.paymentMethods.map((m) => m.id === id ? { ...m, ...method } : m) })),
      deletePaymentMethod: (id) => set((state) => ({ paymentMethods: state.paymentMethods.filter((m) => m.id !== id) })),

      addOrder: (order) => set((state) => ({ orders: [...state.orders, { ...order, id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'pending' }] })),
      updateOrderStatus: (id, status, rejectionReason) => set((state) => ({ orders: state.orders.map((o) => o.id === id ? { ...o, status, rejectionReason: status === 'rejected' ? rejectionReason : undefined } : o) })),

      addMessage: (message) => set((state) => ({ messages: [...state.messages, { ...message, id: Date.now().toString(), createdAt: new Date().toISOString(), read: false }] })),
      markMessageRead: (id) => set((state) => ({ messages: state.messages.map((m) => m.id === id ? { ...m, read: true } : m) })),
      deleteMessage: (id) => set((state) => ({ messages: state.messages.filter((m) => m.id !== id) })),

      addReview: (review) => set((state) => ({ reviews: [...state.reviews, { ...review, id: Date.now().toString(), createdAt: new Date().toISOString() }] })),
      deleteReview: (id) => set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),
    }),
    {
      name: 'ren-grocery-store',
    }
  )
)
