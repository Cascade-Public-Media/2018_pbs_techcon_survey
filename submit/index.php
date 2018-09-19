<?php

$choices = [
    "Bill Nye",
    "Bob Ross",
    "Fred Rogers",
    "Julia Child",
    "LeVar Burton"
];

if (isset($_POST) && isset($_POST['response'])) {
    $response = json_decode($_POST['response']);

    // Verify answer is within acceptable choices.
    if (isset($response->personality) && in_array($response->personality, $choices)) {

        // Submit to SQLite.
        $db = new SQLite3('results.sqlite3');
        $db->query("CREATE TABLE IF NOT EXISTS responses (id integer PRIMARY KEY, response text NOT NULL);");
        $stmt = $db->prepare('INSERT INTO responses (response) VALUES (:response)');
        $stmt->bindValue(':response', $response->personality, SQLITE3_TEXT);
        $stmt->execute();

        // Send success response.
        header('Access-Control-Allow-Origin: *');
        header('Content-type: application/json');
        echo json_encode($response);
    }
}
