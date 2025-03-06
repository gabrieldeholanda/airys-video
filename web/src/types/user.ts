export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  cpf?: string;
  rg?: string;
  ssn?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface BusinessDetails {
  companyName: string;
  tradingName?: string;
  businessType?: string;
  businessCategory?: string;
  cnpj?: string;
  ein?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  website?: string;
  industry?: string;
  country?: string;
}

export type UserType = 'personal' | 'business';

export interface User {
  id: string;
  email: string;
  displayName: string;
  userType: UserType;
  createdAt: Date;
  updatedAt?: Date;
  personalDetails?: PersonalDetails;
  businessDetails?: BusinessDetails;
  isEmailVerified: boolean;
  photoURL?: string;
  lastLoginAt?: Date;
  disabled?: boolean;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  timezone?: string;
}
