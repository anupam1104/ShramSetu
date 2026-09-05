import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  ShieldCheck, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentPage = () => {
<<<<<<< HEAD
  const { bookings, activeBookingId, processPayment, setCurrentScreen } = useApp();
=======
  const { bookings, activeBookingId, processPayment, setCurrentScreen, t } = useApp();
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
  const booking = bookings.find(b => b.id === activeBookingId) || bookings[0];

  const [paymentSuccess, setPaymentSuccess] = useState(booking.status === 'Paid');

  const handlePayNow = () => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }

    processPayment(booking.id);
    setPaymentSuccess(true);
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
=======
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        <button
          onClick={() => setCurrentScreen('track_booking')}
          className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
        >
<<<<<<< HEAD
          <ArrowLeft className="w-4 h-4" /> Back to Booking Tracking
=======
          <ArrowLeft className="w-4 h-4" /> {t('backToTracking', 'Back to Booking Tracking')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
        </button>

        {!paymentSuccess ? (
          <div className="space-y-6">
            
            <div className="text-center space-y-1">
              <span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
<<<<<<< HEAD
                Transparent Checkout
              </span>
              <h1 className="text-2xl font-extrabold font-heading text-slate-900 pt-2">
                Payment Summary
              </h1>
              <p className="text-xs text-slate-500">
                100% transparent fee distribution with direct Shramik payout.
=======
                {t('transparentCheckout', 'Transparent Checkout')}
              </span>
              <h1 className="text-2xl font-extrabold font-heading text-slate-900 pt-2">
                {t('paymentSummary', 'Payment Summary')}
              </h1>
              <p className="text-xs text-slate-500">
                {t('checkoutDesc', '100% transparent fee distribution with direct Shramik payout.')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              </p>
            </div>

            {/* Fee Breakdown Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-slate-600">
<<<<<<< HEAD
                  <span>Service Amount ({booking.serviceName})</span>
=======
                  <span>{t('serviceAmount', 'Service Amount')} ({booking.serviceName})</span>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  <span className="font-semibold font-mono text-slate-900">₹{booking.serviceFee}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
<<<<<<< HEAD
                  <span>Platform & Verification Fee</span>
=======
                  <span>{t('platformVerificationFee', 'Platform & Verification Fee')}</span>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  <span className="font-semibold font-mono text-slate-900">₹{booking.platformFee}</span>
                </div>

                <hr className="border-slate-200 my-2" />

                <div className="flex justify-between items-center text-base font-bold text-slate-900">
<<<<<<< HEAD
                  <span>Total Payable</span>
=======
                  <span>{t('totalPayable', 'Total Payable')}</span>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  <span className="text-xl font-mono text-emerald-700">₹{booking.totalAmount}</span>
                </div>
              </div>

              {/* Transparent Payout Split Highlight (Key Requirement) */}
              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl text-xs space-y-2">
                <p className="font-bold text-emerald-900 flex items-center gap-1">
<<<<<<< HEAD
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transparent Fee Distribution
                </p>

                <div className="flex justify-between text-slate-700 font-mono">
                  <span>Shramik ({booking.shramikName}) receives:</span>
                  <span className="font-bold text-emerald-800">₹{booking.serviceFee}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-mono">
                  <span>Platform fee:</span>
=======
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> {t('transparentFeeDistribution', 'Transparent Fee Distribution')}
                </p>

                <div className="flex justify-between text-slate-700 font-mono">
                  <span>{t('shramikReceives', { name: booking.shramikName })}</span>
                  <span className="font-bold text-emerald-800">₹{booking.serviceFee}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-mono">
                  <span>{t('platformFee', 'Platform fee:')}</span>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  <span className="font-bold text-slate-800">₹{booking.platformFee}</span>
                </div>
              </div>

            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-900 text-xs flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
<<<<<<< HEAD
                <p className="font-bold text-emerald-950">Secure Payment</p>
                <p className="text-emerald-800 mt-0.5">
                  Your payment is protected by our secure payment gateway. Funds are released only after work confirmation.
=======
                <p className="font-bold text-emerald-950">{t('securePayment', 'Secure Payment')}</p>
                <p className="text-emerald-800 mt-0.5">
                  {t('securePaymentDesc', 'Your payment is protected by our secure payment gateway. Funds are released only after work confirmation.')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                </p>
              </div>
            </div>

            <button
              onClick={handlePayNow}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl shadow-xl shadow-emerald-600/20 transition-all text-base flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
<<<<<<< HEAD
              <span>Pay ₹{booking.totalAmount}</span>
=======
              <span>{t('payAmount', { amount: booking.totalAmount })}</span>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
            </button>

          </div>
        ) : (
          /* Payment Success View */
          <div className="text-center space-y-6 py-4 animate-scale-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
<<<<<<< HEAD
                ✓ Paid Successfully
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-slate-900">
                Payment Confirmed!
              </h2>
              <p className="text-sm text-slate-600">
                Thank you for using Shram Setu. ₹{booking.totalAmount} demo payment has been recorded.
=======
                {t('paidSuccessfully', '✓ Paid Successfully')}
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-slate-900">
                {t('paymentConfirmed', 'Payment Confirmed!')}
              </h2>
              <p className="text-sm text-slate-600">
                {t('paymentConfirmedDesc', { amount: booking.totalAmount })}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
<<<<<<< HEAD
              <p>Booking ID: <strong>{booking.id}</strong></p>
              <p>Shramik: <strong>{booking.shramikName}</strong> (Received ₹{booking.serviceFee})</p>
=======
              <p>{t('bookingId', 'Booking ID:')} <strong>{booking.id}</strong></p>
              <p>{t('shramik', 'Shramik:')} <strong>{booking.shramikName}</strong> ({t('receivedAmount', { amount: booking.serviceFee })})</p>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
            </div>

            <button
              onClick={() => setCurrentScreen('search')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
<<<<<<< HEAD
              Back to Home / Search
=======
              {t('backToHome', 'Back to Home / Search')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
