import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  ShieldCheck, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  Banknote
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentPage = () => {
  const { bookings, activeBookingId, processPayment, setCurrentScreen, t, shramiks } = useApp();
  const booking = bookings.find(b => b.id === activeBookingId) || bookings[0] || null;

  const [paymentSuccess, setPaymentSuccess] = useState(booking?.status === 'Paid');
  const [paymentMethod, setPaymentMethod] = useState('online');

  // Anonymized label for the assigned shramik — customer never sees the real name.
  const bookingWorker = booking ? shramiks.find(s => s.id === booking.shramikId) || null : null;
  const bookingLabel = booking
    ? (bookingWorker && bookingWorker.shramikId
        ? `${t('verifiedShramikLabel', 'Verified Shramik')} • ${bookingWorker.shramikId}`
        : t('newShramikLabel', 'New Shramik'))
    : '';

  if (!booking) {
    return (
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-3">
          <p className="font-bold text-slate-900">{t('noBookingPayment', 'No booking found')}</p>
          <p className="text-xs text-slate-500">{t('bookingPaymentEmpty', 'Create a booking before proceeding to payment.')}</p>
          <button
            onClick={() => setCurrentScreen('search')}
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
          >
            {t('backToSearch', 'Back to Search Results')}
          </button>
        </div>
      </div>
    );
  }

  const handlePayNow = async () => {
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

    const paid = await processPayment(booking.id, paymentMethod);
    if (paid !== false) setPaymentSuccess(true);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        <button
          onClick={() => setCurrentScreen('track_booking')}
          className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToTracking', 'Back to Booking Tracking')}
        </button>

        {!paymentSuccess ? (
          <div className="space-y-6">
            
            <div className="text-center space-y-1">
              <span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                {t('transparentCheckout', 'Transparent Checkout')}
              </span>
              <h1 className="text-2xl font-extrabold font-heading text-slate-900 pt-2">
                {t('paymentSummary', 'Payment Summary')}
              </h1>
              <p className="text-xs text-slate-500">
                {t('checkoutDesc', '100% transparent fee distribution with direct Shramik payout.')}
              </p>
            </div>

            {/* Fee Breakdown Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>{t('serviceAmount', 'Service Amount')} ({booking.serviceName})</span>
                  <span className="font-semibold font-mono text-slate-900">₹{booking.serviceFee}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>{t('platformVerificationFee', 'Platform & Verification Fee')}</span>
                  <span className="font-semibold font-mono text-slate-900">₹{booking.platformFee}</span>
                </div>

                <hr className="border-slate-200 my-2" />

                <div className="flex justify-between items-center text-base font-bold text-slate-900">
                  <span>{t('totalPayable', 'Total Payable')}</span>
                  <span className="text-xl font-mono text-emerald-700">₹{booking.totalAmount}</span>
                </div>
              </div>

              {/* Transparent Payout Split Highlight (Key Requirement) */}
              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl text-xs space-y-2">
                <p className="font-bold text-emerald-900 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> {t('transparentFeeDistribution', 'Transparent Fee Distribution')}
                </p>

                <div className="flex justify-between text-slate-700 font-mono">
                  <span>{t('shramikReceives', { name: bookingLabel })}</span>
                  <span className="font-bold text-emerald-800">₹{booking.serviceFee}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-mono">
                  <span>{t('platformFee', 'Platform fee:')}</span>
                  <span className="font-bold text-slate-800">₹{booking.platformFee}</span>
                </div>
              </div>

            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-900 text-xs flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950">{t('securePayment', 'Secure Payment')}</p>
                <p className="text-emerald-800 mt-0.5">
                  {t('securePaymentDesc', 'Your payment is protected by our secure payment gateway. Funds are released only after work confirmation.')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPaymentMethod('online')} className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'online' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'}`}>
                <CreditCard className="w-5 h-5 text-emerald-700 mb-2" /><p className="font-bold text-sm">Online payment</p><p className="text-[11px] text-slate-500 mt-1">UPI, card or net banking</p>
              </button>
              <button onClick={() => setPaymentMethod('cash')} className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'cash' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'}`}>
                <Banknote className="w-5 h-5 text-emerald-700 mb-2" /><p className="font-bold text-sm">Pay by cash</p><p className="text-[11px] text-slate-500 mt-1">Hand cash to the Shramik</p>
              </button>
            </div>

            <button
              onClick={handlePayNow}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl shadow-xl shadow-emerald-600/20 transition-all text-base flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>{paymentMethod === 'cash' ? `Confirm cash payment of ₹${booking.totalAmount}` : t('payAmount', { amount: booking.totalAmount })}</span>
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
                {t('paidSuccessfully', '✓ Paid Successfully')}
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-slate-900">
                {t('paymentConfirmed', 'Payment Confirmed!')}
              </h2>
              <p className="text-sm text-slate-600">
                {t('paymentConfirmedDesc', { amount: booking.totalAmount })}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p>{t('bookingId', 'Booking ID:')} <strong>{booking.id}</strong></p>
              <p>Payment method: <strong>{paymentMethod === 'cash' ? 'Cash' : 'Online'}</strong></p>
              <p>{t('shramik', 'Shramik:')} <strong>{bookingLabel}</strong> ({t('receivedAmount', { amount: booking.serviceFee })})</p>
            </div>

            <button
              onClick={() => setCurrentScreen('search')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              {t('backToHome', 'Back to Home / Search')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
