import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast, Toaster } from 'sonner';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsSubmitted(true);
      toast.success('Reset link sent!');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-surface p-6">
      <Toaster position="top-right" />
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-xl bg-carbon-black flex items-center justify-center mb-6 shadow-xl shadow-carbon-black/10 transform hover:scale-105 transition-transform">
            <span className="text-white font-bold text-2xl tracking-tighter" style={{ fontFamily: "'Brush Script MT', cursive" }}>C</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-carbon-black">Reset password</h2>
          <p className="text-text-description mt-1 text-sm">We'll send you a link to reset your account password.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-border-light">
          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="name@company.com" 
                className="h-11 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="h-4 w-4" />}
              />

              <Button className="w-full h-11 text-xs rounded-lg btn-emerald" isLoading={isLoading}>
                Send Reset Link
              </Button>

              <Link to="/login" className="flex items-center justify-center text-xs font-bold text-slate-400 hover:text-carbon-black transition-colors">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to login
              </Link>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="mx-auto h-16 w-16 rounded-xl bg-emerald-tint/20 flex items-center justify-center border border-emerald-solid/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-solid" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-carbon-black">Check your email</h3>
                <p className="text-sm text-text-description leading-relaxed">
                  We've sent a password reset link to <span className="font-bold text-carbon-black">{email}</span>.
                </p>
              </div>
              <Link to="/login" className="inline-block text-xs font-bold text-carbon-black hover:text-emerald-solid transition-colors">
                Return to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
