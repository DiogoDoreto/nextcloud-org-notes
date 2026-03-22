<?php

return [
    'routes' => [
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
    ],
    'ocs' => [
        ['name' => 'org#get_file', 'url' => '/api/v1/file', 'verb' => 'GET'],
        ['name' => 'org#put_file', 'url' => '/api/v1/file', 'verb' => 'PUT'],
        ['name' => 'org#list_files', 'url' => '/api/v1/files', 'verb' => 'GET'],
        ['name' => 'org#get_settings', 'url' => '/api/v1/settings', 'verb' => 'GET'],
        ['name' => 'org#put_settings', 'url' => '/api/v1/settings', 'verb' => 'PUT'],
    ],
];
