export type PlanType = 'personal' | 'business';
export type PlanTier = 'basic' | 'premium' | 'pro' | 'enterprise';
export type BillingPeriod = 'monthly' | 'yearly';

export interface StripePlan {
  id: string;
  name: string;
  description: string;
  type: PlanType;
  tier: PlanTier;
  price: {
    monthly: string; // Stripe Price ID for monthly billing
    yearly: string;  // Stripe Price ID for yearly billing
  };
  features: {
    maxCameras: number;
    storageLimit: number; // in GB
    retentionDays: number;
    videoQuality: 'standard' | 'hd' | '4k';
    additionalFeatures: string[];
  };
  metadata: {
    type: PlanType;
    tier: PlanTier;
    maxCameras: number;
    storageGB: number;
    retentionDays: number;
  };
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid';
  planId: string;
  planType: PlanType;
  planTier: PlanTier;
  billingPeriod: BillingPeriod;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export const STRIPE_PRICE_IDS = {
  personal: {
    basic: {
      monthly: 'price_personal_basic_monthly',
      yearly: 'price_personal_basic_yearly'
    },
    premium: {
      monthly: 'price_personal_premium_monthly',
      yearly: 'price_personal_premium_yearly'
    },
    pro: {
      monthly: 'price_personal_pro_monthly',
      yearly: 'price_personal_pro_yearly'
    }
  },
  business: {
    basic: {
      monthly: 'price_business_basic_monthly',
      yearly: 'price_business_basic_yearly'
    },
    premium: {
      monthly: 'price_business_premium_monthly',
      yearly: 'price_business_premium_yearly'
    },
    enterprise: {
      monthly: 'price_business_enterprise_monthly',
      yearly: 'price_business_enterprise_yearly'
    }
  }
};

export const SUBSCRIPTION_PLANS: StripePlan[] = [
  // Personal Plans
  {
    id: 'personal-basic',
    name: 'Personal Basic Plan',
    description: 'Essential video monitoring for home use',
    type: 'personal',
    tier: 'basic',
    price: STRIPE_PRICE_IDS.personal.basic,
    features: {
      maxCameras: 2,
      storageLimit: 50,
      retentionDays: 7,
      videoQuality: 'standard',
      additionalFeatures: ['Basic motion detection', 'Email support', 'Standard quality video']
    },
    metadata: {
      type: 'personal',
      tier: 'basic',
      maxCameras: 2,
      storageGB: 50,
      retentionDays: 7
    }
  },
  {
    id: 'personal-premium',
    name: 'Personal Premium Plan',
    description: 'Advanced home monitoring with enhanced features',
    type: 'personal',
    tier: 'premium',
    price: STRIPE_PRICE_IDS.personal.premium,
    features: {
      maxCameras: 4,
      storageLimit: 200,
      retentionDays: 30,
      videoQuality: 'hd',
      additionalFeatures: [
        'Advanced motion detection',
        'Priority email support',
        'HD video quality',
        'Custom alerts',
        'Mobile app access'
      ]
    },
    metadata: {
      type: 'personal',
      tier: 'premium',
      maxCameras: 4,
      storageGB: 200,
      retentionDays: 30
    }
  },
  {
    id: 'personal-pro',
    name: 'Personal Pro Plan',
    description: 'Professional-grade home security solution',
    type: 'personal',
    tier: 'pro',
    price: STRIPE_PRICE_IDS.personal.pro,
    features: {
      maxCameras: 8,
      storageLimit: 500,
      retentionDays: 60,
      videoQuality: '4k',
      additionalFeatures: [
        'AI-powered detection',
        'Priority 24/7 support',
        '4K video quality',
        'Advanced analytics',
        'Smart home integrations',
        'Family account sharing (up to 5 users)',
        'Automated backup'
      ]
    },
    metadata: {
      type: 'personal',
      tier: 'pro',
      maxCameras: 8,
      storageGB: 500,
      retentionDays: 60
    }
  },
  // Business Plans
  {
    id: 'business-basic',
    name: 'Business Basic Plan',
    description: 'Essential video surveillance for small businesses',
    type: 'business',
    tier: 'basic',
    price: STRIPE_PRICE_IDS.business.basic,
    features: {
      maxCameras: 5,
      storageLimit: 200,
      retentionDays: 14,
      videoQuality: 'hd',
      additionalFeatures: [
        'Basic motion detection',
        'Business hour support',
        'HD video quality',
        'Basic reporting'
      ]
    },
    metadata: {
      type: 'business',
      tier: 'basic',
      maxCameras: 5,
      storageGB: 200,
      retentionDays: 14
    }
  },
  {
    id: 'business-premium',
    name: 'Business Premium Plan',
    description: 'Professional surveillance solution for growing businesses',
    type: 'business',
    tier: 'premium',
    price: STRIPE_PRICE_IDS.business.premium,
    features: {
      maxCameras: 15,
      storageLimit: 1000,
      retentionDays: 60,
      videoQuality: '4k',
      additionalFeatures: [
        'Advanced motion detection',
        '24/7 email & phone support',
        '4K video quality',
        'Advanced analytics',
        'Custom alerts',
        'Multi-user access',
        'API access'
      ]
    },
    metadata: {
      type: 'business',
      tier: 'premium',
      maxCameras: 15,
      storageGB: 1000,
      retentionDays: 60
    }
  },
  {
    id: 'business-enterprise',
    name: 'Business Enterprise Plan',
    description: 'Enterprise-grade surveillance system with full features',
    type: 'business',
    tier: 'enterprise',
    price: STRIPE_PRICE_IDS.business.enterprise,
    features: {
      maxCameras: 50,
      storageLimit: 5000,
      retentionDays: 180,
      videoQuality: '4k',
      additionalFeatures: [
        'AI-powered detection',
        '24/7 priority support with SLA',
        '4K video quality',
        'Enterprise analytics',
        'Custom integrations',
        'Advanced user management',
        'Dedicated account manager',
        'Custom development support'
      ]
    },
    metadata: {
      type: 'business',
      tier: 'enterprise',
      maxCameras: 50,
      storageGB: 5000,
      retentionDays: 180
    }
  }
]; 