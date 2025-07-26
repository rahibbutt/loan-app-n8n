import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },

  actions: {
    login(user: User, token: string) {
      this.user = user
      this.token = token

      const expiry = Date.now() + 60 * 60 * 1000 // 1 hour from now

      localStorage.setItem('jwt', token)
      localStorage.setItem('jwt_expiry', expiry.toString())
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('jwt')
      localStorage.removeItem('jwt_expiry')
      localStorage.removeItem('user')
    },

    loadFromStorage() {
      const token = localStorage.getItem('jwt')
      const expiry = localStorage.getItem('jwt_expiry')
      const userStr = localStorage.getItem('user')

      if (token && expiry && userStr) {
        if (Date.now() > parseInt(expiry)) {
          console.log('Token expired, logging out')
          this.logout()
          return
        }

        try {
          const user = JSON.parse(userStr) as User
          this.user = user
          this.token = token
        } catch {
          this.logout()
        }
      } else {
        console.log('No auth data in localStorage')
      }
    },
  },
})
