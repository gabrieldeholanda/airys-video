#!/bin/bash

# Set strict error handling
set -euo pipefail

# Configuration
PROJECT_ID="airys-production"
KEYRING_NAME="airys-keyring"
KEYRING_LOCATION="us-central1"
SECURE_KEYS_DIR="secure-keys"

# Service account configurations
declare -A SERVICE_ACCOUNTS=(
    ["video-processor"]="airys-video-processor@${PROJECT_ID}.iam.gserviceaccount.com"
    ["cloud-run"]="airys-cloud-run@${PROJECT_ID}.iam.gserviceaccount.com"
    ["storage-manager"]="airys-storage-manager@${PROJECT_ID}.iam.gserviceaccount.com"
)

# Function to create service account key
create_key() {
    local name=$1
    local service_account=${SERVICE_ACCOUNTS[$name]}
    local key_file="${SECURE_KEYS_DIR}/${name}.json"
    
    echo "Creating key for ${service_account}..."
    gcloud iam service-accounts keys create "${key_file}" \
        --iam-account="${service_account}"
    chmod 600 "${key_file}"
    
    echo "Key created at ${key_file}"
}

# Function to store key in Secret Manager
store_key() {
    local name=$1
    local key_file="${SECURE_KEYS_DIR}/${name}.json"
    local secret_name="${name}-key"
    
    if [[ ! -f "${key_file}" ]]; then
        echo "Error: Key file ${key_file} not found"
        return 1
    fi
    
    echo "Storing ${name} key in Secret Manager..."
    gcloud secrets versions add "${secret_name}" \
        --data-file="${key_file}"
    
    echo "Key stored in Secret Manager as ${secret_name}"
}

# Function to rotate service account key
rotate_key() {
    local name=$1
    local service_account=${SERVICE_ACCOUNTS[$name]}
    local secret_name="${name}-key"
    local temp_dir
    local old_key_file
    local new_key_file
    
    echo "Starting key rotation for ${service_account}..."
    
    # Create temporary directory
    temp_dir=$(mktemp -d)
    old_key_file="${temp_dir}/old-${name}.json"
    new_key_file="${temp_dir}/new-${name}.json"
    
    # Get current key from Secret Manager
    gcloud secrets versions access latest --secret="${secret_name}" > "${old_key_file}"
    
    # Create new key
    gcloud iam service-accounts keys create "${new_key_file}" \
        --iam-account="${service_account}"
    
    # Store new key in Secret Manager
    gcloud secrets versions add "${secret_name}" --data-file="${new_key_file}"
    
    # List old keys to find the one to delete
    old_key_id=$(jq -r '.private_key_id' "${old_key_file}")
    
    # Delete old key after a delay (allowing for propagation)
    echo "Waiting 15 minutes for new key propagation..."
    sleep 900  # 15 minutes
    
    echo "Deleting old key ${old_key_id}..."
    gcloud iam service-accounts keys delete "${old_key_id}" \
        --iam-account="${service_account}" \
        --quiet
    
    # Cleanup
    rm -rf "${temp_dir}"
    
    echo "Key rotation completed for ${service_account}"
}

# Main execution
main() {
    local command=$1
    local name=$2
    
    case ${command} in
        "create-key")
            create_key "${name}"
            ;;
        "store-key")
            store_key "${name}"
            ;;
        "rotate-key")
            rotate_key "${name}"
            ;;
        *)
            echo "Unknown command: ${command}"
            echo "Usage: $0 [create-key|store-key|rotate-key] [video-processor|cloud-run|storage-manager]"
            exit 1
            ;;
    esac
}

# Execute main if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $# -ne 2 ]]; then
        echo "Usage: $0 [create-key|store-key|rotate-key] [video-processor|cloud-run|storage-manager]"
        exit 1
    fi
    main "$@"
fi 