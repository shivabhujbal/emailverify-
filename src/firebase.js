import {initializeApp} from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider,sendSignInLinkToEmail,isSignInWithEmailLink,signInWithEmailLink } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyAaIe5Qq_lRIhpTRKe2X0mrvuT7V42-nLc",
    authDomain: "otp-generation-bbbb8.firebaseapp.com",
    projectId: "otp-generation-bbbb8",
    storageBucket: "otp-generation-bbbb8.appspot.com",
    messagingSenderId: "876320032358",
    appId: "1:876320032358:web:a38354e7cd43b38b900fa7"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  export { auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider,sendSignInLinkToEmail,isSignInWithEmailLink,signInWithEmailLink };