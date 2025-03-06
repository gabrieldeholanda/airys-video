import sqlite3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def migrate(conn):
    cursor = conn.cursor()
    
    # Create subscription_plans table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subscription_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        description TEXT,
        price_monthly DECIMAL(10,2) NOT NULL,
        price_yearly DECIMAL(10,2) NOT NULL,
        max_cameras INTEGER NOT NULL,
        storage_limit_gb INTEGER NOT NULL,
        retention_days INTEGER NOT NULL,
        features JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create user_subscriptions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        plan_id INTEGER REFERENCES subscription_plans(id),
        status VARCHAR(20) NOT NULL,
        current_period_start TIMESTAMP WITH TIME ZONE,
        current_period_end TIMESTAMP WITH TIME ZONE,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        payment_method_id VARCHAR(100),
        billing_cycle VARCHAR(10) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create camera_configurations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS camera_configurations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(100) NOT NULL,
        rtsp_url TEXT,
        configuration JSONB,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create billing_information table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS billing_information (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        customer_id VARCHAR(100),
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        address JSONB,
        tax_id VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create indexes
    cursor.execute("""
    CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
    CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);
    CREATE INDEX idx_camera_configurations_user_id ON camera_configurations(user_id);
    CREATE INDEX idx_billing_information_user_id ON billing_information(user_id);
    CREATE INDEX idx_billing_information_customer_id ON billing_information(customer_id);
    """)

    # Insert default subscription plans
    cursor.execute("""
    INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, max_cameras, storage_limit_gb, retention_days, features)
    VALUES 
        ('Basic', 'Basic plan for home use', 9.99, 99.99, 2, 50, 7, '{"live_streaming": true, "motion_detection": true, "basic_alerts": true}'::jsonb),
        ('Premium', 'Premium plan for advanced users', 19.99, 199.99, 5, 200, 30, '{"live_streaming": true, "motion_detection": true, "basic_alerts": true, "ai_detection": true, "zone_monitoring": true}'::jsonb),
        ('Enterprise', 'Enterprise plan for businesses', 49.99, 499.99, 20, 1000, 90, '{"live_streaming": true, "motion_detection": true, "basic_alerts": true, "ai_detection": true, "zone_monitoring": true, "api_access": true, "priority_support": true}'::jsonb)
    ON CONFLICT DO NOTHING;
    """)

    conn.commit()

def rollback(conn):
    cursor = conn.cursor()
    
    # Drop tables in reverse order
    cursor.execute("DROP TABLE IF EXISTS billing_information CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS camera_configurations CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS user_subscriptions CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS subscription_plans CASCADE;")
    
    conn.commit() 