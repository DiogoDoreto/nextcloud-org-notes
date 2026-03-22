<?php

namespace OCA\OrgNotes\Settings;

use OCA\OrgNotes\AppInfo\Application;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\Settings\ISettings;

class PersonalSettings implements ISettings {
    public function getForm(): TemplateResponse {
        return new TemplateResponse(Application::APP_ID, 'personal-settings');
    }

    public function getSection(): string {
        return 'orgnotes';
    }

    public function getPriority(): int {
        return 50;
    }
}
