-- ============================================================================
-- MONEYX OFFICIAL cPanel MySQL / MariaDB COMPLETE DATABASE SCHEMA (v3.0 PRO)
-- Compatible with cPanel phpMyAdmin, MySQL 5.7+ / 8.0+ & MariaDB 10.3+
-- ============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+06:00";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uid` VARCHAR(32) NOT NULL UNIQUE,
  `mobile` VARCHAR(32) NOT NULL UNIQUE,
  `nickname` VARCHAR(100) NOT NULL DEFAULT 'MONEYX VIP',
  `email` VARCHAR(150) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `tx_pin` VARCHAR(16) DEFAULT NULL,
  `balance` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `locked_bonus_balance` DECIMAL(14,2) NOT NULL DEFAULT 200.00,
  `vip_level` INT NOT NULL DEFAULT 1,
  `kyc_status` ENUM('Unverified','Pending','Verified','Rejected') NOT NULL DEFAULT 'Unverified',
  `nid_number` VARCHAR(64) DEFAULT NULL,
  `two_factor_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `biometric_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `referral_code` VARCHAR(64) NOT NULL,
  `referred_by` VARCHAR(64) DEFAULT NULL,
  `status` ENUM('Active','Frozen','Banned') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. REFERRAL CLICKS TABLE
CREATE TABLE IF NOT EXISTS `referral_clicks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `referrer_uid` VARCHAR(32) NOT NULL,
  `ref_code` VARCHAR(64) NOT NULL,
  `visitor_ip` VARCHAR(64) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `clicked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`referrer_uid`),
  INDEX (`ref_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. REFERRALS (INVITED MEMBERS & COMMISSION TRACKING)
CREATE TABLE IF NOT EXISTS `referrals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `referrer_uid` VARCHAR(32) NOT NULL,
  `referred_uid` VARCHAR(32) NOT NULL UNIQUE,
  `referred_mobile` VARCHAR(32) NOT NULL,
  `ref_code` VARCHAR(64) NOT NULL,
  `total_deposit` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `total_turnover` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `qualified` TINYINT(1) NOT NULL DEFAULT 0,
  `commission_earned` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `commission_claimed` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`referrer_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TRANSACTIONS (DEPOSITS & WITHDRAWALS)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` VARCHAR(64) PRIMARY KEY,
  `uid` VARCHAR(32) NOT NULL,
  `type` ENUM('Deposit','Withdraw') NOT NULL,
  `method` ENUM('bKash','Nagad','Rocket','Upay','USDT') NOT NULL DEFAULT 'bKash',
  `amount` DECIMAL(14,2) NOT NULL,
  `account` VARCHAR(64) NOT NULL,
  `trx_id` VARCHAR(100) NOT NULL,
  `payment_id` VARCHAR(100) DEFAULT NULL,
  `order_id` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('Completed','Processing','Refunded') NOT NULL DEFAULT 'Processing',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`uid`),
  INDEX (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. BONUSES & LOCKED VAULT RECORDS
CREATE TABLE IF NOT EXISTS `bonuses` (
  `id` VARCHAR(64) PRIMARY KEY,
  `uid` VARCHAR(32) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `status` ENUM('Locked','Claimed','Expired') NOT NULL DEFAULT 'Locked',
  `required_deposit` DECIMAL(14,2) NOT NULL DEFAULT 1000.00,
  `required_turnover` DECIMAL(14,2) NOT NULL DEFAULT 5000.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. PROMO & GIFT CODES
CREATE TABLE IF NOT EXISTS `promo_codes` (
  `code` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `max_claims` INT NOT NULL DEFAULT 100,
  `claimed_count` INT NOT NULL DEFAULT 0,
  `min_deposit_required` DECIMAL(14,2) NOT NULL DEFAULT 500.00,
  `turnover_multiplier` INT NOT NULL DEFAULT 3,
  `status` ENUM('Active','Paused','Expired') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. WINGO 30S BETS
CREATE TABLE IF NOT EXISTS `wingo_bets` (
  `id` VARCHAR(64) PRIMARY KEY,
  `uid` VARCHAR(32) NOT NULL,
  `period` VARCHAR(32) NOT NULL,
  `choice` VARCHAR(32) NOT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `multiplier` INT NOT NULL DEFAULT 1,
  `status` ENUM('Pending','Win','Lose') NOT NULL DEFAULT 'Pending',
  `win_amount` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `result_number` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. BINARY OTC TRADES
CREATE TABLE IF NOT EXISTS `binary_trades` (
  `id` VARCHAR(64) PRIMARY KEY,
  `uid` VARCHAR(32) NOT NULL,
  `asset` VARCHAR(32) NOT NULL,
  `direction` ENUM('CALL','PUT') NOT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `entry_price` DECIMAL(18,6) NOT NULL,
  `exit_price` DECIMAL(18,6) DEFAULT NULL,
  `payout_percent` INT NOT NULL DEFAULT 96,
  `status` ENUM('OPEN','WIN','LOSE') NOT NULL DEFAULT 'OPEN',
  `profit` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. SAVED PLAYER WITHDRAWAL WALLETS
CREATE TABLE IF NOT EXISTS `saved_wallets` (
  `id` VARCHAR(64) PRIMARY KEY,
  `uid` VARCHAR(32) NOT NULL,
  `method` ENUM('bKash','Nagad','Rocket') NOT NULL,
  `account_number` VARCHAR(32) NOT NULL,
  `pin` VARCHAR(16) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. KYC VERIFICATION REQUESTS
CREATE TABLE IF NOT EXISTS `kyc_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uid` VARCHAR(32) NOT NULL,
  `mobile` VARCHAR(32) NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `doc_type` ENUM('NID','Passport','Driving_License') NOT NULL DEFAULT 'NID',
  `doc_number` VARCHAR(64) NOT NULL,
  `status` ENUM('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. GAMES CATALOG & RTP CONTROLLER
CREATE TABLE IF NOT EXISTS `games_catalog` (
  `game_id` VARCHAR(64) PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `provider` VARCHAR(80) NOT NULL,
  `category` VARCHAR(40) NOT NULL,
  `rtp_percent` DECIMAL(5,2) NOT NULL DEFAULT 96.50,
  `is_hot` TINYINT(1) NOT NULL DEFAULT 1,
  `enabled` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uid` VARCHAR(32) NOT NULL,
  `mobile` VARCHAR(32) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `admin_reply` TEXT DEFAULT NULL,
  `status` ENUM('Open','Answered','Closed') NOT NULL DEFAULT 'Open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. SITE SETTINGS (A-TO-Z MASTER CONFIG)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS `admin_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(150) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `admin_ip` VARCHAR(64) DEFAULT '127.0.0.1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED INITIAL SITE SETTINGS
INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('app_name', 'MONEYX'),
('app_icon_url', '/icon.svg'),
('apk_version', 'v2.5.0-PRO'),
('bkash_number', '+959686685260'),
('nagad_number', '+959686685260'),
('rocket_number', '+959686685260'),
('upay_number', '01700000000'),
('usdt_trc20_address', 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb'),
('deposit_bonus_pct', '10'),
('min_deposit', '100'),
('max_deposit', '25000'),
('min_withdraw', '200'),
('max_withdraw', '25000'),
('refer_fixed_bonus', '500'),
('refer_commission_pct', '2.5'),
('slot_rtp_pct', '96.5'),
('crash_rtp_pct', '95.0'),
('maintenance_mode', '0'),
('whatsapp_link', 'https://wa.me/8801700000000'),
('telegram_link', 'https://t.me/moneyx_official'),
('admin_pin', '2026');

-- SEED PROMO CODES
INSERT IGNORE INTO `promo_codes` (`code`, `title`, `amount`, `max_claims`, `min_deposit_required`, `turnover_multiplier`, `status`) VALUES
('MONEYX500', 'VIP Royal Deposit Code', 500.00, 200, 1000.00, 3, 'Active'),
('KAMRANVIP', 'Owner Kamran Special Gift', 888.00, 50, 2000.00, 5, 'Active'),
('SUPERACE100', 'JILI Super Ace Free Spins Vault', 100.00, 500, 500.00, 3, 'Active');

COMMIT;
