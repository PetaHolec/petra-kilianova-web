<?php
// Místní náhled: chová se jako .htaccess, /slovnicek ukáže slovnicek.html.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . '/..' . $path . '.html';
if ($path !== '/' && is_file($file)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($file);
    return true;
}
return false;
