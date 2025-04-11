// store/modules/cart.js
import { getCartItems, deleteCartItem, updateCartItem } from '@/api/shoppingCart'

export default {
  namespaced: true,
  state: () => ({
    cartItems: []
  }),
  getters: {
    totalAmount(state) {
      return state.cartItems.reduce((sum, item) => sum + item.price * item.num, 0)
    }
  },
  mutations: {
    setCartItems(state, items) {
      state.cartItems = items
    }
  },
  actions: {
    async fetchCart({ commit }) {
      const res = await getCartItems()
      if (res.code === 20000) {
        commit('setCartItems', res.data)
      }
    },
    async updateQuantity({ dispatch }, item) {
      const res = await updateCartItem(item)
      if (res.code === 20000) {
        await dispatch('fetchCart')
      }
    },
    async deleteItem({ dispatch }, id) {
      const res = await deleteCartItem(id)
      if (res.code === 20000) {
        await dispatch('fetchCart')
      }
    }
  }
}
