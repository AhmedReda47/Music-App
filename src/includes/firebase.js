// includes/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDZ4UkTUrFREA1WwRL0rdYa3UvUzGne7_I',
  authDomain: 'music-f0ed6.firebaseapp.com',
  projectId: 'music-f0ed6',
  storageBucket: 'music-f0ed6.appspot.com',
  appId: '1:961908369096:web:43eba4e2563e7d91a427fd',
  measurementId: 'G-9VBVR308LH',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app, 'gs://music-f0ed6.firebasestorage.app')

// enableMultiTabIndexedDbPersistence(db).catch((err) => {
//   if (err.code === 'failed-precondition') {
//     console.error('Multi-tab persistence failed (multiple tabs without support).')
//   } else if (err.code === 'unimplemented') {
//     console.error('Persistence not supported in this browser.')
//   }
// })

// ✅ أنشئ reference للكوليكشن user
const userCollection = collection(db, 'users')
const songsCollection = collection(db, 'songs')
const commentsCollection = collection(db, 'comments')

export { auth, db, storage, userCollection, songsCollection, commentsCollection }
