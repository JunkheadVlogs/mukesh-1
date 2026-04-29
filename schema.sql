-- Schema for Mukesh Saree Centre Orders
-- This file provides the SQL structure for the orders table

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email_or_phone VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    pin_code VARCHAR(20),
    payment_method VARCHAR(50),
    total_amount DECIMAL(10, 2) NOT NULL,
    items TEXT NOT NULL,
    razorpay_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster order lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_email_phone ON orders(email_or_phone);
