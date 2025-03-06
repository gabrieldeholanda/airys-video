#!/bin/bash
set -e

# Configuration
PROJECT_ID="airys-production"
SERVICE_NAME="airys-video"
REGION="us-central1"
MONITORING_DIR="$(dirname "$0")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

# Check if required commands are available
check_requirements() {
    log "Checking requirements..."
    
    if ! command -v gcloud &> /dev/null; then
        error "gcloud command not found. Please install Google Cloud SDK."
    fi
    
    if ! gcloud auth print-access-token &> /dev/null; then
        error "Not authenticated with Google Cloud. Please run 'gcloud auth login'."
    fi
    
    success "Requirements check passed"
}

# Enable required APIs
enable_apis() {
    log "Enabling required APIs..."
    
    gcloud services enable monitoring.googleapis.com --project=${PROJECT_ID}
    gcloud services enable cloudmonitoring.googleapis.com --project=${PROJECT_ID}
    
    success "APIs enabled"
}

# Create notification channels
create_notification_channels() {
    log "Setting up notification channels..."
    
    # Check if email channel exists
    EMAIL_CHANNEL=$(gcloud alpha monitoring channels list \
        --project=${PROJECT_ID} \
        --filter="displayName=GPU Alerts Email" \
        --format="value(name)" 2>/dev/null || echo "")
    
    if [ -z "$EMAIL_CHANNEL" ]; then
        info "Creating email notification channel"
        gcloud alpha monitoring channels create \
            --project=${PROJECT_ID} \
            --display-name="GPU Alerts Email" \
            --type=email \
            --channel-content="email-addresses=alerts@airys.com"
    else
        info "Email notification channel already exists"
    fi
    
    # Check if Slack channel exists
    SLACK_CHANNEL=$(gcloud alpha monitoring channels list \
        --project=${PROJECT_ID} \
        --filter="displayName=GPU Alerts Slack" \
        --format="value(name)" 2>/dev/null || echo "")
    
    if [ -z "$SLACK_CHANNEL" ]; then
        info "Creating Slack notification channel"
        gcloud alpha monitoring channels create \
            --project=${PROJECT_ID} \
            --display-name="GPU Alerts Slack" \
            --type=slack \
            --channel-content="auth-token=TOKEN,channel-name=#gpu-alerts"
    else
        info "Slack notification channel already exists"
    fi
    
    success "Notification channels set up"
}

# Create dashboards
create_dashboards() {
    log "Creating dashboards..."
    
    # GPU Performance Dashboard
    DASHBOARD_FILE="${MONITORING_DIR}/gpu-performance-dashboard.json"
    if [ -f "$DASHBOARD_FILE" ]; then
        info "Creating GPU Performance Dashboard"
        gcloud monitoring dashboards create \
            --project=${PROJECT_ID} \
            --config-from-file=${DASHBOARD_FILE}
    else
        error "Dashboard file not found: ${DASHBOARD_FILE}"
    fi
    
    success "Dashboards created"
}

# Create alert policies
create_alert_policies() {
    log "Creating alert policies..."
    
    # GPU Utilization Alert
    ALERT_FILE="${MONITORING_DIR}/gpu-utilization-alert.json"
    if [ -f "$ALERT_FILE" ]; then
        info "Creating GPU Utilization Alert"
        gcloud alpha monitoring policies create \
            --project=${PROJECT_ID} \
            --policy-from-file=${ALERT_FILE}
    else
        error "Alert policy file not found: ${ALERT_FILE}"
    fi
    
    success "Alert policies created"
}

# Configure budget alerts
configure_budget_alerts() {
    log "Configuring budget alerts..."
    
    # Get billing account
    BILLING_ACCOUNT=$(gcloud billing accounts list --format="value(name)" | head -n 1)
    
    if [ -z "$BILLING_ACCOUNT" ]; then
        error "No billing account found. Please set up a billing account."
    fi
    
    info "Using billing account: ${BILLING_ACCOUNT}"
    
    # Check if budget already exists
    BUDGET_EXISTS=$(gcloud billing budgets list \
        --billing-account=${BILLING_ACCOUNT} \
        --filter="displayName=GPU Budget" \
        --format="value(name)" 2>/dev/null || echo "")
    
    if [ -z "$BUDGET_EXISTS" ]; then
        info "Creating GPU budget alert"
        gcloud billing budgets create \
            --billing-account=${BILLING_ACCOUNT} \
            --display-name="GPU Budget" \
            --budget-amount=1000USD \
            --threshold-rule=percent=80 \
            --threshold-rule=percent=100 \
            --email=finance@airys.com
    else
        info "GPU budget alert already exists"
    fi
    
    success "Budget alerts configured"
}

# Main function
main() {
    log "Starting GPU monitoring setup for ${SERVICE_NAME} in ${PROJECT_ID}"
    
    check_requirements
    enable_apis
    create_notification_channels
    create_dashboards
    create_alert_policies
    configure_budget_alerts
    
    success "GPU monitoring setup completed"
    info "Please review the created dashboards and alert policies in the Google Cloud Console"
}

# Execute main if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 