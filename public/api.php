<?php
/**
 * MONEYX Official Platform — Full PHP REST API Endpoint
 * Endpoints:
 *   POST /api.php?action=register
 *   POST /api.php?action=login
 *   POST /api.php?action=deposit
 *   POST /api.php?action=withdraw
 *   POST /api.php?action=claim_bonus
 *   GET  /api.php?action=refer_link&uid=883921
 *   GET  /api.php?action=status
 */

require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? 'status';
$input = json_decode(file_get_contents('php://input') ?: '{}', true) ?? [];
$db = getMoneyxDatabase();

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'moneyx.live';
$baseDomain = $protocol . $host;

switch ($action) {
    case 'status':
        echo json_encode([
            'status' => 'ok',
            'platform' => MONEYX_APP_NAME,
            'engine' => 'PHP ' . PHP_VERSION,
            'domain' => $baseDomain,
            'adminRoute' => $baseDomain . MONEYX_ADMIN_PATH,
        ]);
        break;

    case 'refer_link':
        $uid = preg_replace('/[^a-zA-Z0-9]/', '', $_GET['uid'] ?? '883921');
        $hashToken = hash('sha256', 'MONEYX_VIP_' . $uid . '_BD_AFFILIATE');
        $longReferralUrl = $baseDomain
            . '/register?ref=MX' . $uid . 'VIP'
            . '&invite_token=' . $hashToken
            . '&affiliate_id=BD_PARTNER_' . $uid
            . '&utm_source=moneyx_official_refer'
            . '&utm_medium=vip_partner_link'
            . '&utm_campaign=instant_refer_reward_500bdt'
            . '&security_sig=' . substr(md5($hashToken), 0, 16);

        echo json_encode([
            'status' => 'ok',
            'uid' => $uid,
            'refCode' => 'MX' . $uid . 'VIP',
            'referralUrl' => $longReferralUrl,
            'referPageUrl' => $baseDomain . '/refer',
        ]);
        break;

    case 'register':
        $mobile = preg_replace('/[^0-9]/', '', $input['mobile'] ?? '');
        $password = $input['password'] ?? '';
        $refCode = $input['refCode'] ?? '';

        if (!preg_match('/^01[3-9][0-9]{8}$/', $mobile)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নাম্বার দিন (01XXXXXXXXX)']);
            exit;
        }

        $uid = (string) random_int(100000, 999999);
        $hashToken = hash('sha256', 'MONEYX_VIP_' . $uid . '_' . $mobile);

        $newUser = [
            'uid' => $uid,
            'mobile' => $mobile,
            'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
            'balance' => 0.00, // New users start with 0.00 real balance until verified deposit
            'lockedBonus' => WELCOME_LOCKED_BONUS_BDT,
            'turnoverCompleted' => 0.00,
            'totalDeposited' => 0.00,
            'referredBy' => $refCode,
            'referralToken' => $hashToken,
            'createdAt' => date('c'),
        ];

        $db['users'][$mobile] = $newUser;
        saveMoneyxDatabase($db);

        echo json_encode([
            'status' => 'ok',
            'message' => 'রেজিস্ট্রেশন সফল হয়েছে! আপনার লকড স্বাগতম বোনাস ৳২০০ ভল্টে জমা হয়েছে।',
            'user' => [
                'uid' => $uid,
                'mobile' => $mobile,
                'balance' => 0.00,
                'lockedBonus' => WELCOME_LOCKED_BONUS_BDT,
                'referredBy' => $refCode,
                'referralToken' => $hashToken,
            ]
        ]);
        break;

    case 'claim_bonus':
        $mobile = $input['mobile'] ?? '';
        $bonusId = $input['bonusId'] ?? '';
        $totalDeposited = (float) ($input['totalDeposited'] ?? 0);
        $totalTurnover = (float) ($input['totalTurnover'] ?? 0);
        $requiredDeposit = (float) ($input['requiredDeposit'] ?? 500);
        $requiredTurnover = (float) ($input['requiredTurnover'] ?? 2500);

        if ($totalDeposited < $requiredDeposit || $totalTurnover < $requiredTurnover) {
            http_response_code(403);
            echo json_encode([
                'status' => 'locked',
                'message' => sprintf(
                    'শর্ত পূরণ হয়নি! এই বোনাস আনলক করতে ন্যূনতম ৳%s ডিপোজিট এবং ৳%s বেটিং টার্নওভার সম্পন্ন করতে হবে।',
                    number_format($requiredDeposit),
                    number_format($requiredTurnover)
                )
            ]);
            exit;
        }

        echo json_encode([
            'status' => 'ok',
            'message' => 'অভিনন্দন! আপনার বোনাস শর্ত যাচাই সম্পন্ন হয়েছে এবং মূল ওয়ালেটে যোগ করা হয়েছে।'
        ]);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Unknown API action']);
        break;
}
