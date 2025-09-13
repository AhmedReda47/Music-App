import { defineStore } from 'pinia'
import { auth, userCollection } from '@/includes/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password)
      await setDoc(doc(userCollection, userCred.user.uid), {
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      })

      await updateProfile(userCred.user, {
        displayName: values.name,
      })

      this.userLoggedIn = true
    },
    async authenticate(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      this.userLoggedIn = true
    },
    async signOut() {
      await signOut(auth)
      this.userLoggedIn = false
    },
    init() {
      // Listen for authentication state changes
      onAuthStateChanged(auth, (user) => {
        this.userLoggedIn = !!user
        console.log('Auth state changed:', user ? 'User logged in' : 'User logged out')
        if (user) {
          console.log('Current user:', {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
          })
        }
      })
    },
  },
})
