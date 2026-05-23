"use client";
import { create } from "zustand";

/* UI orchestration — drawer/search/menu open state. Lives in its own store
   so commerce components can `openCart()` after a successful add without
   prop-drilling through layout. */

interface UIStore {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openMenu: () => void;
  closeMenu: () => void;
}

export const useUI = create<UIStore>((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  openCart:   () => set({ cartOpen: true,  searchOpen: false, menuOpen: false }),
  closeCart:  () => set({ cartOpen: false }),
  openSearch: () => set({ searchOpen: true, cartOpen: false, menuOpen: false }),
  closeSearch:() => set({ searchOpen: false }),
  openMenu:   () => set({ menuOpen: true }),
  closeMenu:  () => set({ menuOpen: false }),
}));
