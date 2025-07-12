
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Building, 
  Users,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp' | 'profile' | 'organization'>('email');
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    role: '',
    organization: '',
    inviteCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('profile');
    }, 1000);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('organization');
    }, 1000);
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold">Archi</span>
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">
            Get started with Archi in just a few steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {['email', 'otp', 'profile', 'organization'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                ['email', 'otp', 'profile', 'organization'].indexOf(step) >= index
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {['email', 'otp', 'profile', 'organization'].indexOf(step) > index ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div className={`w-8 h-px ${
                  ['email', 'otp', 'profile', 'organization'].indexOf(step) > index
                    ? 'bg-primary'
                    : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === 'email' && 'Enter your email'}
              {step === 'otp' && 'Verify your email'}
              {step === 'profile' && 'Complete your profile'}
              {step === 'organization' && 'Join or create organization'}
            </CardTitle>
            {step === 'otp' && (
              <p className="text-sm text-muted-foreground text-center">
                We've sent a 6-digit code to <strong>{formData.email}</strong>
              </p>
            )}
          </CardHeader>
          <CardContent>
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending code...' : 'Continue'}
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="otp"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter 6-digit code"
                      value={formData.otp}
                      onChange={(e) => updateFormData('otp', e.target.value)}
                      className="pl-10 pr-10"
                      maxLength={6}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading || formData.otp.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </form>
            )}

            {step === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="PM">Project Manager</SelectItem>
                      <SelectItem value="Reviewer">Reviewer</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading || !formData.name || !formData.role}>
                  {loading ? 'Saving...' : 'Continue'}
                </Button>
              </form>
            )}

            {step === 'organization' && (
              <form onSubmit={handleOrganizationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="organization"
                      type="text"
                      placeholder="Enter organization name"
                      value={formData.organization}
                      onChange={(e) => updateFormData('organization', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">or</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Join with Invite Code</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="inviteCode"
                      type="text"
                      placeholder="Enter invite code"
                      value={formData.inviteCode}
                      onChange={(e) => updateFormData('inviteCode', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || (!formData.organization && !formData.inviteCode)}
                >
                  {loading ? 'Creating account...' : 'Complete Setup'}
                </Button>
              </form>
            )}

            {step !== 'email' && (
              <div className="text-center mt-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const steps = ['email', 'otp', 'profile', 'organization'];
                    const currentIndex = steps.indexOf(step);
                    if (currentIndex > 0) {
                      setStep(steps[currentIndex - 1] as any);
                    }
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
