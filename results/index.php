<?php

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$choices = [
    "Bill Nye",
    "Bob Ross",
    "Fred Rogers",
    "Julia Child",
    "LeVar Burton"
];

$results = [
    'total' => 0,
    'table' => [],
    'bar' => [],
    'pie' => [],
    'line_cats' => [],
    'line_data' => []
];

foreach ($choices as $choice) {
    $results['table'][$choice] = [
        'personality' => $choice,
        'votes' => 0
    ];
    $results['bar'][$choice] = ['name' => $choice, 'data' => [0,]];
    $results['pie'][$choice] = ['name' => $choice, 'y' => 0];
}

// Get response data from SQLite.
try {
    $db = new SQLite3('../submit/results.sqlite3');
    $rows = $db->query('SELECT response, COUNT(id) AS votes FROM responses 
                              GROUP BY response ORDER BY response ASC;');

    while ($row = $rows->fetchArray()) {
        if (in_array($row['response'], $choices)) {
            $results['table'][$row['response']]['votes'] = $row['votes'];
            $results['bar'][$row['response']]['data'][0] = $row['votes'];
            $results['pie'][$row['response']]['y'] = $row['votes'];
            $results['line_cats'][] = $row['response'];
            $results['line_data'][] = $row['votes'];
            $results['total'] += $row['votes'];
        }
    }

    // Remove keys for easier highcharts processing.
    sort($results['pie']);
    sort($results['bar']);

    echo json_encode($results);
}
catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
