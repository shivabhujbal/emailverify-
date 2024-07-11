import React, { useState } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from '../firebase';
import { sendSignInLinkToEmail,isSignInWithEmailLink,signInWithEmailLink } from '../firebase';
import { signInWithCredential } from 'firebase/auth';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FormComponent.css'; // Assuming this file contains your custom styles
import img1 from '../images/img1.jpg';

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

  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false); // State to control OTP verification popup


  //for Email 
  const requestEmailVerification = () => {
    const actionCodeSettings = {
      url: 'http://localhost:3000/', // Replace with your application URL
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        setVerificationEmailSent(true);
        toast.success('Verification email sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending verification email:', error);
        toast.error('Failed to send verification email. Please try again.');
      });
  };

  const handleEmailVerification = () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, window.location.href)
        .then((result) => {
          console.log('Email verification successful:', result);
          toast.success('Email verified successfully!');
          // Proceed with user registration or any other actions after verification
          // Example: You can create a new user profile in Firestore or Realtime Database
        })
        .catch((error) => {
          console.error('Error verifying email:', error);
          toast.error('Failed to verify email. Please try again.');
        });
    } else {
      toast.error('Invalid or expired email verification link.');
    }
  };
  





  //End for Email
  

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
        setShowVerifyModal(false); // Hide OTP verification popup after successful verification
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        toast.error('Failed to verify OTP. Please try again.');
      });
  };

  const handleSignIn = (e) => {
    e.preventDefault();

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

    setPhoneNumber('');
    toast.success('Form submitted successfully!');
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row">
        <div className="col-md-6 image-container">
          <img src={img1} alt="Background" className="img-fluid" />
        </div>
        <div className="col-md-6 form-container">
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
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Enter Email"
                    required
                  />
                </div>
                <button type="button" className="btn btn-primary mt-3 w-100" onClick={requestEmailVerification}>
  Send Email Link
</button>
{verificationEmailSent ? (
                  <div>
                    <p>A verification link has been sent to your email.</p>
                    <button
                      type="button"
                      className="btn btn-success mt-3 w-100"
                      onClick={handleEmailVerification}
                    >
                      Verify Email
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={requestEmailVerification}
                  >
                    Send Verification Email
                  </button>
                )}



                <div className="mb-3">
                  <PhoneInput
                    country={'in'}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder='Enter Mobile'
                    inputClass="form-control"
                  />
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
                <button type="button" className="btn btn-primary mt-3 w-100" onClick={requestOtp}>
                  Send OTP
                </button>
                {showVerifyModal && verificationId && (
                  <div className="modal-wrapper">
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
                <button type="submit" className="btn btn-success mt-3 w-100" onClick={handleSignIn}>
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
