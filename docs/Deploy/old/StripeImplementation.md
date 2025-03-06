# Stripe Implementation Guide

## Overview
This document outlines the implementation of Stripe for subscription management in our application. We'll use Stripe for handling payments, subscriptions, and billing.

## Prerequisites
1. Stripe account
2. API Keys (Test and Production)
3. Node.js Stripe SDK

## Implementation Steps

### 1. Initial Setup

```bash
# Install required dependencies
npm install @stripe/stripe-js @stripe/stripe-react-js stripe
```

### 2. Environment Configuration
```env
# web/.env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

### 3. Subscription Plans Structure

```typescript
// web/src/types/stripe.ts
export interface StripePlan {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'business';
  price: {
    base: {
      monthly: string;  // Stripe Price ID for monthly base price
      yearly: string;   // Stripe Price ID for yearly base price (20% discount)
    };
    mandatoryFeatures: {
      monthly: string;  // Stripe Price ID for monthly mandatory features
      yearly: string;   // Stripe Price ID for yearly mandatory features (20% discount)
    };
  };
  features: {
    base: {
      maxCameras: number;
      storageLimit: number; // in GB
      retentionDays: number;
      videoQuality: '720p' | '1080p' | '4k';
      coreFeatures: string[];
    };
    mandatory: string[];
    optional: {
      storage?: {
        packSize: number;
        price: number;
      };
      cameras?: {
        price: number;
      };
      retention?: {
        days: number;
        price: number;
      };
      features?: {
        api?: number;
        ai?: number;
        customIntegration?: number;
      };
    };
  };
}

export const SUBSCRIPTION_PLANS: StripePlan[] = [
  {
    id: 'personal-basic',
    name: 'Personal Basic Plan',
    description: 'Essential video monitoring for home use',
    type: 'personal',
    price: {
      base: {
        monthly: 'price_personal_basic_base_monthly',      // R$ 129,90
        yearly: 'price_personal_basic_base_yearly'         // R$ 1.246,70 (20% off)
      },
      mandatoryFeatures: {
        monthly: 'price_personal_basic_features_monthly',  // R$ 49,90
        yearly: 'price_personal_basic_features_yearly'     // R$ 479,04 (20% off)
      }
    },
    features: {
      base: {
        maxCameras: 2,
        storageLimit: 50,
        retentionDays: 7,
        videoQuality: '720p',
        coreFeatures: [
          'Real-time object detection',
          'Basic motion detection',
          'RTSP streaming',
          'WebRTC live view',
          'Home Assistant integration',
          'MQTT integration'
        ]
      },
      mandatory: [
        'Basic AI detection',
        'Email notifications'
      ],
      optional: {
        storage: {
          packSize: 50,
          price: 29.90
        },
        cameras: {
          price: 39.90
        },
        retention: {
          days: 7,
          price: 19.90
        }
      }
    }
  },
  {
    id: 'personal-premium',
    name: 'Personal Premium Plan',
    description: 'Advanced home monitoring with enhanced features',
    type: 'personal',
    price: {
      base: {
        monthly: 'price_personal_premium_base_monthly',     // R$ 249,90
        yearly: 'price_personal_premium_base_yearly'        // R$ 2.399,04 (20% off)
      },
      mandatoryFeatures: {
        monthly: 'price_personal_premium_features_monthly', // R$ 99,90
        yearly: 'price_personal_premium_features_yearly'    // R$ 959,04 (20% off)
      }
    },
    features: {
      base: {
        maxCameras: 4,
        storageLimit: 200,
        retentionDays: 30,
        videoQuality: '1080p',
        coreFeatures: [
          'Advanced motion detection',
          'Multi-camera view',
          'Smart object tracking',
          'Mobile app access',
          'Custom zones',
          'All Basic features'
        ]
      },
      mandatory: [
        'Priority support (email & chat, response within 12h)',
        'Advanced AI detection',
        'Custom alert rules'
      ],
      optional: {
        storage: {
          packSize: 100,
          price: 29.90
        },
        cameras: {
          price: 49.90
        },
        retention: {
          days: 15,
          price: 29.90
        },
        features: {
          ai: 149.90,
          api: 99.90
        }
      }
    }
  },
  {
    id: 'personal-pro',
    name: 'Personal Pro Plan',
    description: 'Professional-grade home security solution',
    type: 'personal',
    price: {
      base: {
        monthly: 'price_personal_pro_base_monthly',     // R$ 499,90
        yearly: 'price_personal_pro_base_yearly'        // R$ 4.799,04 (20% off)
      },
      mandatoryFeatures: {
        monthly: 'price_personal_pro_features_monthly', // R$ 149,90
        yearly: 'price_personal_pro_features_yearly'    // R$ 1.439,04 (20% off)
      }
    },
    features: {
      base: {
        maxCameras: 8,
        storageLimit: 500,
        retentionDays: 60,
        videoQuality: '4k',
        coreFeatures: [
          'Multi-zone analytics',
          'Advanced scene analysis',
          'Family account sharing',
          'Automated backup',
          'Custom integrations',
          'All Premium features'
        ]
      },
      mandatory: [
        '24/7 priority support (phone, email & chat)',
        'Advanced AI analytics',
        'Custom alert automation'
      ],
      optional: {
        storage: {
          packSize: 200,
          price: 29.90
        },
        cameras: {
          price: 59.90
        },
        retention: {
          days: 30,
          price: 39.90
        },
        features: {
          ai: 199.90,
          api: 149.90,
          customIntegration: 299.90
        }
      }
    }
  },
  {
    id: 'business-basic',
    name: 'Business Basic Plan',
    description: 'Essential video surveillance for small businesses',
    type: 'business',
    price: {
      base: {
        monthly: 'price_business_basic_base_monthly',     // R$ 349,90
        yearly: 'price_business_basic_base_yearly'        // R$ 3.359,04 (20% off)
      },
      mandatoryFeatures: {
        monthly: 'price_business_basic_features_monthly', // R$ 149,90
        yearly: 'price_business_basic_features_yearly'    // R$ 1.439,04 (20% off)
      }
    },
    features: {
      base: {
        maxCameras: 5,
        storageLimit: 200,
        retentionDays: 14,
        videoQuality: '1080p',
        coreFeatures: [
          'Business hour monitoring',
          'Basic compliance reports',
          'User activity logs',
          'Multi-user access',
          'API access',
          'All Personal Basic features'
        ]
      },
      mandatory: [
        'Business hour support (8/5)',
        'Basic audit logs',
        'Standard SLA'
      ],
      optional: {
        storage: {
          packSize: 100,
          price: 39.90
        },
        cameras: {
          price: 69.90
        },
        retention: {
          days: 15,
          price: 49.90
        },
        features: {
          ai: 199.90,
          api: 199.90,
          customIntegration: 399.90
        }
      }
    }
  },
  {
    id: 'business-premium',
    name: 'Business Premium Plan',
    description: 'Professional surveillance solution for growing businesses',
    type: 'business',
    price: {
      base: {
        monthly: 'price_business_premium_base_monthly',     // R$ 799,90
        yearly: 'price_business_premium_base_yearly'        // R$ 7.679,04 (20% off)
      },
      mandatoryFeatures: {
        monthly: 'price_business_premium_features_monthly', // R$ 299,90
        yearly: 'price_business_premium_features_yearly'    // R$ 2.879,04 (20% off)
      }
    },
    features: {
      base: {
        maxCameras: 15,
        storageLimit: 1000,
        retentionDays: 60,
        videoQuality: '4k',
        coreFeatures: [
          'Advanced compliance reporting',
          'Multi-site management',
          'Advanced audit system',
          'Role-based access control',
          'Custom dashboards',
          'All Business Basic features'
        ]
      },
      mandatory: [
        '24/7 priority support',
        'Advanced audit system',
        'Premium SLA'
      ],
      optional: {
        storage: {
          packSize: 250,
          price: 39.90
        },
        cameras: {
          price: 89.90
        },
        retention: {
          days: 30,
          price: 69.90
        },
        features: {
          ai: 299.90,
          api: 299.90,
          customIntegration: 499.90
        }
      }
    }
  },
  {
    id: 'business-enterprise',
    name: 'Business Enterprise Plan',
    description: 'Enterprise-grade surveillance system with full features',
    type: 'business',
    price: {
      base: {
        monthly: 'price_business_enterprise_base_monthly',     // R$ 2.499,90
        yearly: 'price_business_enterprise_base_yearly'        // R$ 23.999,04 (20% off)
      },
      mandatoryFeatures: {
        monthly: 'price_business_enterprise_features_monthly', // R$ 999,90
        yearly: 'price_business_enterprise_features_yearly'    // R$ 9.599,04 (20% off)
      }
    },
    features: {
      base: {
        maxCameras: 50,
        storageLimit: 5000,
        retentionDays: 180,
        videoQuality: '4k',
        coreFeatures: [
          'Enterprise analytics',
          'Custom compliance frameworks',
          'Enterprise-grade security',
          'Advanced user management',
          'Custom development support',
          'All Business Premium features'
        ]
      },
      mandatory: [
        '24/7 dedicated support with SLA',
        'Custom security policies',
        'Enterprise SLA'
      ],
      optional: {
        storage: {
          packSize: 500,
          price: 'Custom'
        },
        cameras: {
          price: 'Custom'
        },
        retention: {
          days: 'Custom',
          price: 'Custom'
        },
        features: {
          ai: 'Custom',
          api: 'Custom',
          customIntegration: 'Custom'
        }
      }
    }
  }
];
```

### 4. Stripe Service Implementation

```typescript
// web/src/services/stripe.service.ts
import { loadStripe } from '@stripe/stripe-js';
import type { StripePlan } from '../types/stripe';

export class StripeService {
  private static stripe: any = null;

  static async initialize() {
    if (!this.stripe) {
      this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    }
    return this.stripe;
  }

  static async createSubscription(
    planId: string,
    userId: string,
    billingPeriod: 'monthly' | 'yearly',
    addOns?: {
      storage?: { packSize: number; quantity: number };
      cameras?: { quantity: number };
      retention?: { days: number };
      features?: {
        api?: boolean;
        ai?: boolean;
        customIntegration?: boolean;
      };
    }
  ) {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
          billingPeriod,
          addOns,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const session = await response.json();
      return session;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static async updateSubscription(
    subscriptionId: string,
    updates: {
      planId?: string;
      billingPeriod?: 'monthly' | 'yearly';
      addOns?: {
        storage?: { packSize: number; quantity: number };
        cameras?: { quantity: number };
        retention?: { days: number };
        features?: {
          api?: boolean;
          ai?: boolean;
          customIntegration?: boolean;
        };
      };
    }
  ) {
    try {
      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          ...updates,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  static async getSubscriptionDetails(subscriptionId: string) {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get subscription details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting subscription details:', error);
      throw error;
    }
  }

  static async calculatePrice(
    planId: string,
    billingPeriod: 'monthly' | 'yearly',
    addOns?: {
      storage?: { packSize: number; quantity: number };
      cameras?: { quantity: number };
      retention?: { days: number };
      features?: {
        api?: boolean;
        ai?: boolean;
        customIntegration?: boolean;
      };
    }
  ) {
    try {
      const response = await fetch('/api/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingPeriod,
          addOns,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate price');
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating price:', error);
      throw error;
    }
  }
}

// Backend API implementation
// api/src/routes/stripe.ts

import express from 'express';
import Stripe from 'stripe';
import { auth } from '../middleware/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Create a subscription
router.post('/create-subscription', auth, async (req, res) => {
  try {
    const { planId, userId, billingPeriod, addOns } = req.body;
    
    // Find the plan
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Get or create customer
    let customer = await stripe.customers.create({
      metadata: {
        userId
      }
    });

    // Create subscription items array
    const items = [
      // Base plan
      {
        price: plan.price.base[billingPeriod],
        quantity: 1
      },
      // Mandatory features
      {
        price: plan.price.mandatoryFeatures[billingPeriod],
        quantity: 1
      }
    ];

    // Add optional add-ons if selected
    if (addOns) {
      if (addOns.storage) {
        items.push({
          price: `price_${plan.id}_storage_${addOns.storage.packSize}`,
          quantity: addOns.storage.quantity
        });
      }
      if (addOns.cameras) {
        items.push({
          price: `price_${plan.id}_camera`,
          quantity: addOns.cameras.quantity
        });
      }
      if (addOns.retention) {
        items.push({
          price: `price_${plan.id}_retention_${addOns.retention.days}`,
          quantity: 1
        });
      }
      if (addOns.features) {
        if (addOns.features.api) {
          items.push({
            price: `price_${plan.id}_api`,
            quantity: 1
          });
        }
        if (addOns.features.ai) {
          items.push({
            price: `price_${plan.id}_ai`,
            quantity: 1
          });
        }
        if (addOns.features.customIntegration) {
          items.push({
            price: `price_${plan.id}_custom_integration`,
            quantity: 1
          });
        }
      }
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        planId,
        billingPeriod,
        addOns: JSON.stringify(addOns)
      }
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(400).json({ error: error.message });
  }
});

// Calculate price
router.post('/calculate-price', auth, async (req, res) => {
  try {
    const { planId, billingPeriod, addOns } = req.body;
    
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Calculate base price
    let total = parseFloat(plan.price.base[billingPeriod]) +
                parseFloat(plan.price.mandatoryFeatures[billingPeriod]);

    // Calculate add-ons
    if (addOns) {
      if (addOns.storage) {
        total += plan.features.optional.storage!.price * addOns.storage.quantity;
      }
      if (addOns.cameras) {
        total += plan.features.optional.cameras!.price * addOns.cameras.quantity;
      }
      if (addOns.retention) {
        total += plan.features.optional.retention!.price;
      }
      if (addOns.features) {
        if (addOns.features.api && plan.features.optional.features?.api) {
          total += plan.features.optional.features.api;
        }
        if (addOns.features.ai && plan.features.optional.features?.ai) {
          total += plan.features.optional.features.ai;
        }
        if (addOns.features.customIntegration && plan.features.optional.features?.customIntegration) {
          total += plan.features.optional.features.customIntegration;
        }
      }
    }

    // Apply yearly discount if applicable
    if (billingPeriod === 'yearly') {
      total = total * 12 * 0.8; // 20% discount
    }

    res.json({
      total,
      currency: 'BRL',
      breakdown: {
        base: parseFloat(plan.price.base[billingPeriod]),
        mandatoryFeatures: parseFloat(plan.price.mandatoryFeatures[billingPeriod]),
        addOns: total - (parseFloat(plan.price.base[billingPeriod]) + parseFloat(plan.price.mandatoryFeatures[billingPeriod]))
      }
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
```

### 5. Backend API Implementation

```