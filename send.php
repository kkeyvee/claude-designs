<?php
/**
 * Обработчик формы заявки на стажировку.
 * Отправляет данные формы на указанную почту.
 *
 * НАСТРОЙКА: измените $to на вашу почту.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ─── НАСТРОЙКИ ───
$to      = 'vladdian@mail.ru';  // ← ЗАМЕНИТЕ НА ВАШУ ПОЧТУ
$subject = 'Новая заявка на стажировку — КАЧ';

// ─── Получаем и очищаем данные ───
$name    = htmlspecialchars(trim($_POST['name'] ?? ''));
$link    = htmlspecialchars(trim($_POST['link'] ?? ''));
$contact = htmlspecialchars(trim($_POST['contact'] ?? ''));

// ─── Валидация ───
if (empty($name) || empty($contact)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Заполните обязательные поля']);
    exit;
}

// ─── Антиспам: проверка honeypot ───
if (!empty($_POST['website'])) {
    // Бот заполнил скрытое поле
    echo json_encode(['success' => true]);
    exit;
}

// ─── Формируем письмо ───
$message  = "Новая заявка на стажировку\n";
$message .= "──────────────────────────\n\n";
$message .= "Имя: {$name}\n";
$message .= "Портфолио: {$link}\n";
$message .= "Контакт: {$contact}\n\n";
$message .= "──────────────────────────\n";
$message .= "Отправлено с лендинга: " . ($_SERVER['HTTP_REFERER'] ?? 'неизвестно');

$headers  = "From: noreply@" . ($_SERVER['SERVER_NAME'] ?? 'localhost') . "\r\n";
$headers .= "Reply-To: noreply@" . ($_SERVER['SERVER_NAME'] ?? 'localhost') . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ─── Отправляем ───
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Ошибка отправки письма']);
}
