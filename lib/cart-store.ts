import { create } from "zustand"

interface CartStore {
  itemCount: number
  addItem: () => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  itemCount: 0,
  addItem: () => set((state) => ({ itemCount: state.itemCount + 1 })),
  clearCart: () => set({ itemCount: 0 }),
}))
