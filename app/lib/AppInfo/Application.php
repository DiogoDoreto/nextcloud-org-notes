<?php

namespace OCA\OrgNotes\AppInfo;

use OCP\AppFramework\App;

class Application extends App {
    public const APP_ID = 'orgnotes';

    public function __construct() {
        parent::__construct(self::APP_ID);
    }
}
