<?php
/**
 * MONEYX Official Platform — PHP Backend Configuration
 * Compatible with GitHub, cPanel, Apache, Nginx & PHP 8.x+
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('MONEYX_APP_NAME', 'MONEYX');
define('MONEYX_VERSION', '2.5.0-PRO');
define('MONEYX_ADMIN_PATH', '/owner_kamran-admin-panel');
define('MONEYX_ADMIN_PIN', '2026');

// Merchant Numbers
define('BKASH_MERCHANT_NUMBER', '+959686685260');
define('NAGAD_MERCHANT_NUMBER', '+959686685260');
define('ROCKET_MERCHANT_NUMBER', '+959686685260');

// Strict Anti-Fraud Bonus & Wagering Rules
define('MIN_DEPOSIT_BDT', 100);
define('MIN_WITHDRAW_BDT', 200);
define('WELCOME_LOCKED_BONUS_BDT', 200);
define('WELCOME_UNLOCK_TURNOVER_MULTIPLIER', 5); // 5x wagering required before bonus unlock
define('REFERRAL_REWARD_BDT', 500);
define('REFERRAL_MIN_FRIEND_DEPOSIT_BDT', 1000); // Referred friend must deposit >= 1000 BDT

// Local JSON Database file path (Zero-config fallback if MySQL is not configured)
define('MONEYX_DATA_FILE', __DIR__ . '/moneyx_db.json');

function getMoneyxDatabase(): array {
    if (!file_exists(MONEYX_DATA_FILE)) {
        $initial = [
            'users' => [],
            'transactions' => [],
            'referrals' => [],
            'settings' => [
                'bkashNumber' => BKASH_MERCHANT_NUMBER,
                'nagadNumber' => NAGAD_MERCHANT_NUMBER,
                'rocketNumber' => ROCKET_MERCHANT_NUMBER,
                'depositBonusPct' => 10,
                'minDeposit' => MIN_DEPOSIT_BDT,
                'maxDeposit' => 25000,
                'minWithdraw' => MIN_WITHDRAW_BDT,
                'maxWithdraw' => 25000,
                'adminPin' => MONEYX_ADMIN_PIN,
            ]
        ];
        @file_put_contents(MONEYX_DATA_FILE, json_encode($initial, JSON_PRETTY_PRINT));
        return $initial;
    }
    $raw = @file_get_contents(MONEYX_DATA_FILE);
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : ['users' => [], 'transactions' => [], 'referrals' => []];
}

function saveMoneyxDatabase(array $db): bool {
    return (bool) @file_put_contents(MONEYX_DATA_FILE, json_encode($db, JSON_PRETTY_PRINT));
}
