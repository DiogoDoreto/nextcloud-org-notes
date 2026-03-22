<?php

namespace OCA\OrgNotes\Settings;

use OCP\IURLGenerator;
use OCP\Settings\IIconSection;

class PersonalSection implements IIconSection {
    public function __construct(
        private IURLGenerator $urlGenerator,
    ) {
    }

    public function getID(): string {
        return 'orgnotes';
    }

    public function getName(): string {
        return 'Org Notes';
    }

    public function getPriority(): int {
        return 75;
    }

    public function getIcon(): string {
        return $this->urlGenerator->imagePath('orgnotes', 'app-dark.svg');
    }
}
