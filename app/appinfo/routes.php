<?php

return [
    'routes' => [
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
    ],
    'ocs' => [
        ['name' => 'org#get_file', 'url' => '/api/v1/file', 'verb' => 'GET'],
        ['name' => 'org#list_files', 'url' => '/api/v1/files', 'verb' => 'GET'],
    ],
];
