import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BusinessDetailsForm } from '@/components/forms/BusinessDetailsForm';
import { PersonalDetailsForm } from '@/components/forms/PersonalDetailsForm';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from '@/components/Logo';
import { useTheme } from '@/context/theme-provider';

interface PersonalDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  cpf: string;
  rg: string;
  ssn: string;
  phone: string;
  mobilePhone: string;
  address: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BusinessDetails {
  companyName: string;
  tradingName: string;
  businessType: string;
  businessCategory: string;
  cnpj: string;
  ein: string;
  stateRegistration: string;
  municipalRegistration: string;
  address: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  industry: string;
  country: string;
}

export default function Register() {
  const { t } = useTranslation('auth');
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('personal');
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    companyName: '',
    tradingName: '',
    businessType: 'corporation',
    businessCategory: '',
    cnpj: '',
    ein: '',
    stateRegistration: '',
    municipalRegistration: '',
    address: '',
    addressNumber: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
    industry: '',
    country: '',
  });
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    cpf: '',
    rg: '',
    ssn: '',
    phone: '',
    mobilePhone: '',
    address: '',
    addressNumber: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const validatePasswordStrength = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push(t('register.password.requirements.min_length'));
    }
    if (!/[A-Z]/.test(password)) {
      errors.push(t('register.password.requirements.uppercase'));
    }
    if (!/[a-z]/.test(password)) {
      errors.push(t('register.password.requirements.lowercase'));
    }
    if (!/[0-9]/.test(password)) {
      errors.push(t('register.password.requirements.number'));
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push(t('register.password.requirements.special'));
    }
    
    return errors;
  };

  // Update the password validation effect
  useEffect(() => {
    const errors = validatePasswordStrength(password);
    setPasswordErrors(errors);
    setPasswordValid(errors.length === 0 || password.length === 0);
    setPasswordMatch(password === confirmPassword || confirmPassword.length === 0);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state
    setError('');

    // Validate password strength
    const errors = validatePasswordStrength(password);
    if (errors.length > 0) {
      setError('Please ensure your password meets all requirements');
      return;
    }

    if (!passwordMatch) {
      setError('Passwords do not match');
      return;
    }

    // Validate details based on account type
    if (userType === 'business') {
      if (!businessDetails || Object.keys(businessDetails).length === 0) {
        setError('Please fill in the business details');
        return;
      }
    } else {
      if (!personalDetails || Object.keys(personalDetails).length === 0) {
        setError('Please fill in your personal details');
        return;
      }
    }

    try {
      setLoading(true);
      const { user } = await signUp(email, password);
      
      if (user) {
        // Set display name based on account type
        const displayName = userType === 'business' 
          ? businessDetails.companyName
          : `${personalDetails.firstName} ${personalDetails.lastName}`.trim();

        await updateProfile(user, {
          displayName: displayName
        });

        // Reload user to get updated profile
        await user.reload();

        // Save additional details to Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userData = {
          email: user.email,
          displayName: displayName,
          userType,
          createdAt: new Date(),
          ...(userType === 'business' ? { businessDetails } : { personalDetails })
        };

        await setDoc(userDocRef, userData);
      }
      
      navigate('/');
    } catch (err) {
      if (err instanceof FirebaseError) {
        // Handle specific Firebase errors
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('An account with this email already exists');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          case 'auth/weak-password':
            setError('Password should be at least 6 characters');
            break;
          case 'auth/operation-not-allowed':
            setError('Account creation is currently disabled');
            break;
          default:
            setError('Failed to create an account. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background overflow-y-auto py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-6">
            <Logo className="w-20 h-20" />
            <h2 className="text-center text-3xl font-extrabold text-foreground mt-6">
              {t('register.title')}
            </h2>
          </div>

          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Card */}
            <Card className="p-6">
              <div className="space-y-6">
                {/* Account Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('register.account_type.label')}</Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('register.account_type.label')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">
                        {t('register.account_type.personal')}
                      </SelectItem>
                      <SelectItem value="business">
                        {t('register.account_type.business')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email and Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="email-address" className="text-sm font-medium">
                    {t('register.email.label')}
                  </Label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder={t('register.email.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t('register.password.label')}
                  </Label>
                  <div className="relative">
                    <div className="flex items-center">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                          password.length > 0 && !passwordValid 
                            ? 'border-destructive focus:ring-destructive focus:border-destructive' 
                            : 'border-input focus:ring-primary focus:border-primary'
                        } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:z-10 sm:text-sm`}
                        placeholder={t('register.password.placeholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 absolute right-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="space-y-2 w-60">
                            <p className="font-medium">{t('register.password.requirements.title')}</p>
                            <ul className="text-sm space-y-1">
                              {[
                                t('register.password.requirements.min_length'),
                                t('register.password.requirements.uppercase'),
                                t('register.password.requirements.lowercase'),
                                t('register.password.requirements.number'),
                                t('register.password.requirements.special')
                              ].map((requirement) => (
                                <li key={requirement} className="flex items-center gap-2">
                                  {passwordErrors.includes(requirement) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  ) : password.length > 0 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                  <span className={password.length > 0 ? (passwordErrors.includes(requirement) ? 'text-destructive' : 'text-primary') : 'text-muted-foreground'}>
                                    {requirement}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    {t('register.password.confirm.label')}
                  </Label>
                  <div className="relative">
                    <div className="flex items-center">
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                          confirmPassword.length > 0 && !passwordMatch
                            ? 'border-destructive focus:ring-destructive focus:border-destructive' 
                            : 'border-input focus:ring-primary focus:border-primary'
                        } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:z-10 sm:text-sm`}
                        placeholder={t('register.password.confirm.placeholder')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Details Form Based on Account Type */}
            {userType === 'business' ? (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('register.business_info.title')}</h3>
                <BusinessDetailsForm
                  onChange={setBusinessDetails}
                  defaultValues={businessDetails}
                />
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('register.personal_info.title')}</h3>
                <PersonalDetailsForm
                  onChange={setPersonalDetails}
                  defaultValues={personalDetails}
                />
              </Card>
            )}

            {/* Footer Section */}
            <div className="space-y-6 pb-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('register.buttons.sign_up')}
              </button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t('register.buttons.have_account')}{' '}
                  <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                    {t('register.buttons.sign_in')}
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 