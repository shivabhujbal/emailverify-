import React, { useState } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from '../firebase';
// import { sendSignInLinkToEmail,isSignInWithEmailLink,signInWithEmailLink } from '../firebase';
import { signInWithCredential } from 'firebase/auth';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FormComponent.css'; // Assuming this file contains your custom styles

const PhoneVerification = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isotpVerified, setIsOtpVerified] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false); // State to control OTP verification popup
  const [showSignIn, setShowSignIn] = useState(false); // State to control OTP verification popup

  const requestOtp = () => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log("reCAPTCHA solved");
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired");
      }
    });

    const mobNumber = `+${phoneNumber}`;
    signInWithPhoneNumber(auth, mobNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        toast.success('OTP sent successfully!');
        setShowVerifyModal(true); // Show OTP verification popup/modal
      })
      .catch((error) => {
        console.error("Error during signInWithPhoneNumber:", error);
        toast.error('Failed to send OTP. Please try again.');
      });
  };

  const verifyOtp = () => {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    signInWithCredential(auth, credential)
      .then((result) => {
        console.log("User signed in successfully:", result);
        toast.success('OTP verified successfully!');
        setIsOtpVerified(true)
        setShowSignIn(true)
        setShowVerifyModal(false); // Hide OTP verification popup after successful verification
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        toast.error('Wrong Otp');
      });
  };

  //from validatoions

  const [formErrors, setFormErrors] = useState({ });
  const [isFormValid,setIsFormValid] = useState(false);

  const validateForm = () => {

    const newErrors = {};

    const namePattern = /^[A-Z a-z]+$/;
    if (!formData.fullName|| formData.fullName.length < 4 || !namePattern.test(formData.fullName) ) {
        newErrors.fullName = 'Enter Min. 4 characters and Only Alphabets';
    }
    if (!formData.username|| formData.username.length < 4 || !namePattern.test(formData.username) ) {
        newErrors.username = 'Enter Min. 4 characters and Only Alphabets';
    }
    
    

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
        newErrors.email = 'Invalid email format';
    }

    
    
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])*([a-z])*([A-Z])/;
    if (formData.password.length < 6 || !passwordPattern.test(formData.password)) {
        newErrors.password = 'Use Strong password Include Number and Symbols ';
    }


    return newErrors;


}


  const handleSignIn = (e) => {
    e.preventDefault();


    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
    // Simulate form validation since actual form validation is not provided here
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: phoneNumber,
      username: formData.username,
      password: formData.password
    };

    localStorage.setItem('formData', JSON.stringify(userData));
    console.log('formData saved', userData);

    setFormData({
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      otp: ''
    });
    setIsFormValid(true)
    setFormErrors({})
    setIsOtpVerified(false)
    setPhoneNumber('');
    toast.success('Form submitted successfully!');
  }else{

    toast.error('Please fill out the form correctly.');
    setFormErrors(errors);

  }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row">
        
        <div className="m-1">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Phone Number Verification</h2>
              <form>
                <div className="mb-3">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Full Name"
                    required
                  />
                {formErrors.fullName && <span className="error">{formErrors.fullName}</span>}

                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Email"
                    required
                  />

{formErrors.email && <span className="error">{formErrors.email}</span>}

                </div>
                <div className="mb-3 ">
                  <PhoneInput
                    country={'in'}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder='Enter Mobile'
                    inputClass="form-control "
                    
                  />

                  {
                    !isotpVerified ? (

                    <button type="btn button" className="btn btn-info mt-3 w-100" onClick={requestOtp}>
                      Verify
                    </button>

                    ):(

                      <button type="button" className="btn btn-secondary mt-3" disabled >
                      Verified
                    </button>

                    )
                  }

               
                {showVerifyModal && verificationId && (
  <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Verify OTP</h5>
          <button type="button" className="btn-close" onClick={() => setShowVerifyModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              className="form-control"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
          </div>
          <button className="btn btn-success mt-3 w-100" onClick={verifyOtp}>
            Verify OTP
          </button>
        </div>

      </div>
    </div>
  </div>
)}

                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Username"
                    required
                  />
                {formErrors.username && <span className="error">{formErrors.username}</span>}

                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Password"
                    required
                  />
                                  {formErrors.password && <span className="error">{formErrors.password}</span>}

                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                <div id="recaptcha-container"></div>
            
                {
  isotpVerified  ? (
    <button type="submit" className="btn btn-success mt-3 w-100"  onClick={handleSignIn}>
      Sign In
    </button>
  ) : (
    <button type="submit" className="btn btn-success mt-3 w-100" disabled onClick={handleSignIn}>
      Sign In
    </button>
  )
}

              </form>
            </div>
          </div>
          <p className='copy'> &copy; Shiva Bhujbal</p>

        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
