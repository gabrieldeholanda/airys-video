# Stripe Products Configuration Guide

## Product Structure Overview

We offer two categories of subscriptions:
1. Personal (Basic, Premium, and Pro) - For home and personal use
2. Business (Basic, Premium, and Enterprise) - For business and commercial use

Each tier includes mandatory feature packs and optional add-ons, with yearly billing offering a 20% discount.

## Personal Plans

### 1. Personal Basic
- **Product Name**: "Personal Basic Plan"
- **Product Description**: "Essential video monitoring for home use"
- **Base Features** (R$ 129,90/month):
  - Max Cameras: 2
  - Storage: 50GB
  - Retention: 7 days
  - Core Features:
    - Real-time object detection
    - Basic motion detection
    - RTSP streaming
    - WebRTC live view
    - Home Assistant integration
    - MQTT integration
- **Mandatory Feature Pack** (R$ 49,90/month):
  - Basic AI detection
  - Email notifications
  - Mobile app access
  - Basic support (email support, response within 24h)
  - 720p video quality
- **Optional Add-ons**:
  - Extra Storage: R$ 29,90/50GB/month
  - Additional Camera: R$ 39,90/camera/month
  - Extended Retention: R$ 19,90/7 days/month
- **Total Starting Price**: R$ 179,80/month
- **Yearly Price**: R$ 1.726,08 (R$ 143,84/month, save 20%)
- **Metadata**:
  ```json
  {
    "type": "personal",
    "tier": "basic",
    "maxCameras": 2,
    "storageGB": 50,
    "retentionDays": 7,
    "videoQuality": "720p",
    "supportLevel": "basic",
    "aiFeatures": ["basic-detection"],
    "integrations": ["home-assistant", "mqtt"],
    "basePrice": 12990,
    "mandatoryFeaturePrice": 4990,
    "currency": "BRL",
    "billingOptions": ["monthly", "yearly"],
    "yearlyDiscount": 20
  }
  ```

### 2. Personal Premium
- **Product Name**: "Personal Premium Plan"
- **Product Description**: "Advanced home monitoring with enhanced features"
- **Base Features** (R$ 249,90/month):
  - Max Cameras: 4
  - Storage: 200GB
  - Retention: 30 days
  - All Basic features plus:
    - Advanced motion detection
    - Custom zones and masks
    - Birdseye view
    - Multi-camera view
    - Advanced event filtering
    - Smart object tracking
- **Mandatory Feature Pack** (R$ 99,90/month):
  - Advanced AI detection
  - Custom notifications
  - Premium mobile features
  - Priority support (email & chat, response within 12h)
  - 1080p video quality
  - Basic semantic search
  - Basic audio detection
- **Optional Add-ons**:
  - Extra Storage: R$ 29,90/100GB/month
  - Additional Camera: R$ 49,90/camera/month
  - Extended Retention: R$ 29,90/15 days/month
  - AI Analytics Pack: R$ 99,90/month
- **Total Starting Price**: R$ 349,80/month
- **Yearly Price**: R$ 3.358,08 (R$ 279,84/month, save 20%)
- **Metadata**:
  ```json
  {
    "type": "personal",
    "tier": "premium",
    "maxCameras": 4,
    "storageGB": 200,
    "retentionDays": 30,
    "videoQuality": "1080p",
    "supportLevel": "priority",
    "aiFeatures": [
      "advanced-detection",
      "custom-zones",
      "object-tracking",
      "basic-audio-detection"
    ],
    "integrations": [
      "home-assistant",
      "mqtt",
      "semantic-search",
      "mobile-premium"
    ],
    "basePrice": 24990,
    "mandatoryFeaturePrice": 9990,
    "currency": "BRL",
    "billingOptions": ["monthly", "yearly"],
    "yearlyDiscount": 20
  }
  ```

### 3. Personal Pro
- **Product Name**: "Personal Pro Plan"
- **Product Description**: "Professional-grade home security solution"
- **Base Features** (R$ 499,90/month):
  - Max Cameras: 8
  - Storage: 500GB
  - Retention: 60 days
  - All Premium features plus:
    - Advanced hardware acceleration
    - Custom object detection training
    - Multi-zone analytics
    - Advanced event correlation
    - Smart home automation
    - Advanced scene analysis
- **Mandatory Feature Pack** (R$ 149,90/month):
  - Advanced AI object detection
  - Full semantic search
  - Advanced audio detection
  - Camera autotracking
  - 4K video quality
  - 24/7 priority support (phone, email & chat)
  - Advanced analytics dashboard
  - Custom alert rules
- **Optional Add-ons**:
  - Extra Storage: R$ 29,90/200GB/month
  - Additional Camera: R$ 59,90/camera/month
  - Extended Retention: R$ 39,90/30 days/month
  - Advanced AI Pack: R$ 149,90/month
  - API Access: R$ 99,90/month
- **Total Starting Price**: R$ 649,80/month
- **Yearly Price**: R$ 6.238,08 (R$ 519,84/month, save 20%)
- **Metadata**:
  ```json
  {
    "type": "personal",
    "tier": "pro",
    "maxCameras": 8,
    "storageGB": 500,
    "retentionDays": 60,
    "videoQuality": "4k",
    "supportLevel": "24/7-priority",
    "aiFeatures": [
      "advanced-detection",
      "custom-training",
      "advanced-audio",
      "autotracking",
      "scene-analysis"
    ],
    "integrations": [
      "home-assistant",
      "mqtt",
      "full-semantic-search",
      "api-access",
      "advanced-analytics",
      "smart-automation"
    ],
    "basePrice": 49990,
    "mandatoryFeaturePrice": 14990,
    "currency": "BRL",
    "billingOptions": ["monthly", "yearly"],
    "yearlyDiscount": 20
  }
  ```

## Business Plans

### 1. Business Basic
- **Product Name**: "Business Basic Plan"
- **Product Description**: "Essential video surveillance for small businesses"
- **Base Features** (R$ 349,90/month):
  - Max Cameras: 5
  - Storage: 200GB
  - Retention: 14 days
  - All Personal Premium features plus:
    - Business-grade motion detection
    - Multi-location support
    - Export capabilities
    - Basic compliance reports
    - User activity logs
    - Remote access management
- **Mandatory Feature Pack** (R$ 149,90/month):
  - Business AI detection
  - Compliance reports
  - Basic API access
  - Business hour support (8/5)
  - 1080p video quality
  - Multi-user access (2 users)
  - Basic audit logs
- **Optional Add-ons**:
  - Extra Storage: R$ 39,90/100GB/month
  - Additional Camera: R$ 69,90/camera/month
  - Extended Retention: R$ 49,90/15 days/month
  - Business API Pack: R$ 149,90/month
  - Additional Users: R$ 29,90/user/month
- **Total Starting Price**: R$ 499,80/month
- **Yearly Price**: R$ 4.798,08 (R$ 399,84/month, save 20%)
- **Metadata**:
  ```json
  {
    "type": "business",
    "tier": "basic",
    "maxCameras": 5,
    "storageGB": 200,
    "retentionDays": 14,
    "videoQuality": "1080p",
    "supportLevel": "business-hours",
    "aiFeatures": [
      "business-detection",
      "multi-location",
      "export-features"
    ],
    "integrations": [
      "basic-api",
      "compliance-reports",
      "audit-logs",
      "multi-user"
    ],
    "maxUsers": 2,
    "basePrice": 34990,
    "mandatoryFeaturePrice": 14990,
    "currency": "BRL",
    "billingOptions": ["monthly", "yearly"],
    "yearlyDiscount": 20
  }
  ```

### 2. Business Premium
- **Product Name**: "Business Premium Plan"
- **Product Description**: "Professional surveillance solution for growing businesses"
- **Base Features** (R$ 799,90/month):
  - Max Cameras: 15
  - Storage: 1TB
  - Retention: 60 days
  - All Business Basic features plus:
    - Advanced hardware acceleration
    - Full API access
    - Custom webhooks
    - Advanced compliance reporting
    - Multi-site management
    - Advanced export features
- **Mandatory Feature Pack** (R$ 299,90/month):
  - Advanced AI detection models
  - Full semantic search
  - Advanced camera autotracking
  - Custom detection zones
  - 4K video quality
  - 24/7 email & phone support
  - Multi-user access (10 users)
  - Role-based access control
  - Advanced audit system
- **Optional Add-ons**:
  - Extra Storage: R$ 39,90/250GB/month
  - Additional Camera: R$ 89,90/camera/month
  - Extended Retention: R$ 69,90/30 days/month
  - Advanced API Pack: R$ 249,90/month
  - Additional Users: R$ 39,90/user/month
  - Custom Integrations: Starting at R$ 399,90/month
- **Total Starting Price**: R$ 1.099,80/month
- **Yearly Price**: R$ 10.558,08 (R$ 879,84/month, save 20%)
- **Metadata**:
  ```json
  {
    "type": "business",
    "tier": "premium",
    "maxCameras": 15,
    "storageGB": 1000,
    "retentionDays": 60,
    "videoQuality": "4k",
    "supportLevel": "24/7",
    "aiFeatures": [
      "advanced-detection",
      "autotracking",
      "custom-zones",
      "multi-site"
    ],
    "integrations": [
      "full-api",
      "webhooks",
      "semantic-search",
      "advanced-compliance",
      "rbac"
    ],
    "maxUsers": 10,
    "basePrice": 79990,
    "mandatoryFeaturePrice": 29990,
    "currency": "BRL",
    "billingOptions": ["monthly", "yearly"],
    "yearlyDiscount": 20
  }
  ```

### 3. Business Enterprise
- **Product Name**: "Business Enterprise Plan"
- **Product Description**: "Enterprise-grade surveillance system with full features"
- **Base Features** (R$ 2.499,90/month):
  - Max Cameras: 50
  - Storage: 5TB
  - Retention: 180 days
  - All Business Premium features plus:
    - High availability setup
    - Custom hardware acceleration options
    - Advanced multi-site management
    - Global deployment options
    - Custom compliance frameworks
    - Enterprise-grade security
- **Mandatory Feature Pack** (R$ 999,90/month):
  - Custom AI model training
  - Advanced Generative AI features
  - Enterprise-grade semantic search
  - Custom integrations
  - 4K video quality with custom bitrate
  - 24/7 priority support with SLA
  - Unlimited users with custom roles
  - Dedicated account manager
  - Compliance and audit support
  - Custom security policies
- **Optional Add-ons**:
  - Custom Storage Solutions
  - Additional Camera: Custom pricing
  - Extended Retention: Custom pricing
  - Enterprise API Access: Custom pricing
  - Custom Development: Custom pricing
- **Total Starting Price**: R$ 3.499,80/month
- **Yearly Price**: R$ 33.598,08 (R$ 2.799,84/month, save 20%)
- **Metadata**:
  ```json
  {
    "type": "business",
    "tier": "enterprise",
    "maxCameras": 50,
    "storageGB": 5000,
    "retentionDays": 180,
    "videoQuality": "4k-custom",
    "supportLevel": "24/7-sla",
    "aiFeatures": [
      "custom-ai",
      "generative-ai",
      "enterprise-search",
      "custom-training"
    ],
    "integrations": [
      "enterprise-api",
      "custom-integrations",
      "global-deployment",
      "high-availability",
      "custom-security"
    ],
    "maxUsers": "unlimited",
    "basePrice": 249990,
    "mandatoryFeaturePrice": 99990,
    "currency": "BRL",
    "billingOptions": ["monthly", "yearly"],
    "yearlyDiscount": 20,
    "customFeatures": true
  }
  ```

## Volume Discounts
- 5-10 cameras: 10% discount
- 11-20 cameras: 15% discount
- 21-50 cameras: 20% discount
- 50+ cameras: Custom pricing

## Long-term Commitments
- 1-year contract: 20% discount (included in yearly pricing)
- 2-year contract: 30% discount
- 3-year contract: 35% discount
- Custom terms available for Enterprise plans

## Implementation Notes

1. **Stripe Product Structure**:
   - Create separate products for base plans and mandatory feature packs
   - Set up add-ons as separate products with metered billing
   - Configure volume pricing tiers
   - Set up coupon codes for long-term commitments

2. **Billing Integration**:
   - Implement metered billing for add-ons
   - Set up usage tracking for cameras and storage
   - Configure automatic proration for plan changes
   - Implement volume discount logic

3. **Feature Management**:
   - Base features enabled by default
   - Mandatory features activated with subscription
   - Add-ons managed through feature flags
   - Usage limits enforced through API

4. **Customer Portal Configuration**:
   - Enable plan switching
   - Show add-on management
   - Display usage metrics
   - Provide billing history

## Notes
- All prices are in Brazilian Real (BRL)
- Yearly plans include a 20% discount
- Storage limits are soft limits with overage charges
- Each plan includes all features of previous tiers
- Business plans include additional legal compliance features
- Enterprise plans include custom integration support
- Prices include taxes as per Brazilian regulations

## Hardware Requirements (Google Cloud)

### Personal Basic
- **Compute Engine**:
  - Machine Type: e2-standard-2
  - vCPUs: 2
  - Memory: 8GB
  - AI Acceleration: None (CPU-based detection)
- **Storage**:
  - Boot disk: 50GB Standard persistent disk
  - Data disk: 100GB Balanced persistent disk
- **Network**:
  - Network bandwidth: 4 Gbps
  - Network tier: Standard
- **Estimated Performance**:
  - Up to 2 cameras at 720p
  - 10-15 FPS object detection
  - Suitable for basic home monitoring
- **Estimated Monthly Costs** (São Paulo region):
  - Compute (e2-standard-2): ~R$ 280
  - Storage:
    - Boot disk (Standard): ~R$ 10
    - Data disk (Balanced): ~R$ 45
  - Network: ~R$ 85
  - Cloud Monitoring: ~R$ 20
  - **Total Estimated Cost**: ~R$ 440/month
  - **Margin at R$ 49,90/month**: Limited, recommended to use spot instances

### Personal Premium
- **Compute Engine**:
  - Machine Type: e2-standard-4
  - vCPUs: 4
  - Memory: 16GB
  - AI Acceleration: NVIDIA T4 GPU (1/4 configuration)
- **Storage**:
  - Boot disk: 50GB Standard persistent disk
  - Data disk: 250GB Balanced persistent disk
- **Network**:
  - Network bandwidth: 8 Gbps
  - Network tier: Premium
- **Estimated Performance**:
  - Up to 4 cameras at 1080p
  - 20-25 FPS object detection
  - Suitable for advanced home security
- **Estimated Monthly Costs** (São Paulo region):
  - Compute (e2-standard-4): ~R$ 560
  - GPU (T4 1/4): ~R$ 450
  - Storage:
    - Boot disk (Standard): ~R$ 10
    - Data disk (Balanced): ~R$ 112
  - Network: ~R$ 150
  - Cloud Monitoring: ~R$ 30
  - **Total Estimated Cost**: ~R$ 1.312/month
  - **Margin at R$ 99,90/month**: Requires high utilization and spot instances

### Personal Pro
- **Compute Engine**:
  - Machine Type: c2-standard-8
  - vCPUs: 8
  - Memory: 32GB
  - AI Acceleration: NVIDIA T4 GPU (full)
- **Storage**:
  - Boot disk: 100GB SSD persistent disk
  - Data disk: 600GB SSD persistent disk
- **Network**:
  - Network bandwidth: 16 Gbps
  - Network tier: Premium
- **Estimated Performance**:
  - Up to 8 cameras at 4K
  - 30+ FPS object detection
  - Advanced AI processing capabilities
- **Estimated Monthly Costs** (São Paulo region):
  - Compute (c2-standard-8): ~R$ 1.200
  - GPU (T4 full): ~R$ 1.800
  - Storage:
    - Boot disk (SSD): ~R$ 40
    - Data disk (SSD): ~R$ 300
  - Network: ~R$ 250
  - Cloud Monitoring: ~R$ 50
  - **Total Estimated Cost**: ~R$ 3.640/month
  - **Margin at R$ 199,90/month**: Requires multi-tenant architecture

### Business Basic
- **Compute Engine**:
  - Machine Type: e2-standard-8
  - vCPUs: 8
  - Memory: 32GB
  - AI Acceleration: NVIDIA T4 GPU (full)
- **Storage**:
  - Boot disk: 100GB SSD persistent disk
  - Data disk: 300GB SSD persistent disk
  - Cloud Storage: Standard Storage bucket
- **Network**:
  - Network bandwidth: 16 Gbps
  - Network tier: Premium
  - Cloud CDN enabled
- **Estimated Performance**:
  - Up to 5 cameras at 1080p
  - 25-30 FPS object detection
  - Multi-user access support
- **Estimated Monthly Costs** (São Paulo region):
  - Compute (e2-standard-8): ~R$ 1.120
  - GPU (T4 full): ~R$ 1.800
  - Storage:
    - Boot disk (SSD): ~R$ 40
    - Data disk (SSD): ~R$ 150
    - Cloud Storage: ~R$ 100
  - Network & CDN: ~R$ 300
  - Cloud Monitoring: ~R$ 50
  - **Total Estimated Cost**: ~R$ 3.560/month
  - **Margin at R$ 149,90/month**: Requires multi-tenant optimization

### Business Premium
- **Compute Engine**:
  - Machine Type: c2-standard-16
  - vCPUs: 16
  - Memory: 64GB
  - AI Acceleration: 
    - Primary: NVIDIA L4 GPU
    - Secondary: Cloud TPU v3-8
- **Storage**:
  - Boot disk: 100GB SSD persistent disk
  - Data disk: 1.2TB SSD persistent disk
  - Cloud Storage: Standard Storage bucket with lifecycle management
- **Network**:
  - Network bandwidth: 32 Gbps
  - Network tier: Premium
  - Cloud CDN enabled
  - Load balancer
- **High Availability**:
  - Regional deployment
  - Auto-scaling enabled
- **Estimated Performance**:
  - Up to 15 cameras at 4K
  - 30+ FPS object detection
  - Advanced AI processing with GPU acceleration
- **Estimated Monthly Costs** (São Paulo region):
  - Compute (c2-standard-16): ~R$ 2.400
  - GPU (L4): ~R$ 2.500
  - Cloud TPU v3-8: ~R$ 3.800
  - Storage:
    - Boot disk (SSD): ~R$ 40
    - Data disk (SSD): ~R$ 600
    - Cloud Storage: ~R$ 300
  - Network, CDN & Load Balancer: ~R$ 500
  - High Availability: ~R$ 1.200
  - Cloud Monitoring: ~R$ 100
  - **Total Estimated Cost**: ~R$ 11.440/month
  - **Margin at R$ 399,90/month**: Requires minimum 29 active customers

### Business Enterprise
- **Compute Engine**:
  - Machine Type: c2-standard-30
  - vCPUs: 30
  - Memory: 120GB
  - AI Acceleration:
    - Primary: 2x NVIDIA L4 GPUs
    - Secondary: Cloud TPU v3-32
- **Storage**:
  - Boot disk: 200GB SSD persistent disk
  - Data disk: 6TB SSD persistent disk
  - Cloud Storage: Standard and Archive Storage buckets with lifecycle management
- **Network**:
  - Network bandwidth: 32+ Gbps
  - Network tier: Premium
  - Global Load Balancing
  - Cloud CDN with custom configurations
- **High Availability**:
  - Multi-regional deployment
  - Auto-scaling across regions
  - Failover configuration
- **Additional Infrastructure**:
  - Dedicated Cloud SQL instance
  - Redis for caching
  - Cloud Pub/Sub for event handling
- **Estimated Performance**:
  - Up to 50 cameras at 4K
  - 30+ FPS object detection
  - Enterprise-grade AI processing
  - Multi-site support
- **Estimated Monthly Costs** (São Paulo region):
  - Compute (c2-standard-30): ~R$ 4.500
  - GPUs (2x L4): ~R$ 5.000
  - Cloud TPU v3-32: ~R$ 15.200
  - Storage:
    - Boot disk (SSD): ~R$ 80
    - Data disk (SSD): ~R$ 3.000
    - Cloud Storage: ~R$ 1.500
  - Network & Global Load Balancing: ~R$ 1.200
  - High Availability: ~R$ 2.400
  - Additional Infrastructure:
    - Cloud SQL: ~R$ 800
    - Redis: ~R$ 500
    - Cloud Pub/Sub: ~R$ 300
  - Cloud Monitoring: ~R$ 200
  - **Total Estimated Cost**: ~R$ 34.680/month
  - **Margin at R$ 999,90/month**: Requires minimum 35 active customers

### Notes on Hardware Requirements:
- All configurations include monitoring via Cloud Monitoring
- Backup and disaster recovery included in higher tiers
- Storage calculations include both live data and retention periods
- Network bandwidth can be adjusted based on actual usage
- GPU and TPU configurations can be adjusted based on workload and region availability
- Auto-scaling policies adjust resources based on demand
- Higher tiers include redundancy and failover capabilities
- GPU and TPU pricing varies by region and commitment term

### Notes on Cost Estimates:
- All prices are in Brazilian Real (BRL) and approximate
- Costs assume 730 hours per month (24/7 operation)
- Network costs vary significantly based on actual usage
- Storage costs assume average utilization
- Costs can be optimized through:
  - Use of committed use discounts (1 or 3 years)
  - Spot instances for non-critical workloads
  - Regional pricing variations
  - Resource scheduling
  - Multi-tenant optimizations
- Actual costs may vary based on:
  - Real usage patterns
  - Data transfer volumes
  - Region selection
  - Reserved capacity agreements
  - Special pricing agreements
- Recommended to maintain minimum 30% margin for operational overhead 

## Add-on Services

### Storage Packs
- **Basic Storage Pack**
  - 50GB additional storage
  - Pricing varies by plan tier
  - Automatic cleanup policies
  - Available for all plans

- **Advanced Storage Pack**
  - 100GB-500GB additional storage
  - Custom retention policies
  - Backup included
  - Available for Premium and above

- **Enterprise Storage**
  - Custom storage limits
  - Multi-region replication
  - Custom retention policies
  - Available for Enterprise plans

### Analytics Features
- **Basic Analytics**
  - Motion heatmaps
  - Basic object counting
  - Simple reports
  - R$ 49,90/month

- **Advanced Analytics**
  - AI-powered object detection
  - Behavior analysis
  - Custom alerts
  - Advanced reporting
  - R$ 99,90/month

- **Enterprise Analytics**
  - Custom AI models
  - Real-time analytics
  - Custom reporting
  - API access
  - Custom pricing

### API Access Packages
- **Basic API**
  - 1000 calls/day
  - Basic endpoints
  - Standard support
  - R$ 99,90/month

- **Advanced API**
  - 10000 calls/day
  - All endpoints
  - Priority support
  - Webhooks
  - R$ 199,90/month

- **Enterprise API**
  - Unlimited calls
  - Custom endpoints
  - 24/7 support
  - Custom integrations
  - Custom pricing

### Custom Integrations
- **Basic Integration**
  - Standard protocols
  - Pre-built connectors
  - R$ 299,90/month

- **Advanced Integration**
  - Custom protocols
  - Custom development
  - SLA support
  - Starting at R$ 999,90/month

- **Enterprise Integration**
  - Full customization
  - Dedicated development
  - Custom SLA
  - Custom pricing

## Volume Discounts
- 5-10 cameras: 5% discount
- 11-20 cameras: 10% discount
- 21-50 cameras: 15% discount
- 50+ cameras: Custom pricing

## Long-term Commitments
- 1-year contract: 20% discount (included in yearly pricing)
- 2-year contract: 25% discount
- 3-year contract: 30% discount
- Custom terms available for Enterprise plans

## Notes
- All prices are in Brazilian Real (BRL)
- Yearly plans include a 20% discount
- Enterprise plans include custom pricing based on specific requirements
- Add-on services can be combined for additional functionality
- Volume discounts cannot be combined with long-term commitment discounts
- Prices include taxes as per Brazilian regulations
- Custom development and integration prices may vary based on requirements 