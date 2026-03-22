<?php

namespace OCA\OrgNotes\Settings;

use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Settings\IIconSection;

class PersonalSection implements IIconSection {
    public function __construct(
        private IL10N $l,
        private IURLGenerator $urlGenerator,
    ) {
    }

    public function getID(): string {
        return 'orgnotes';
    }

    public function getName(): string {
        return $this->l->t('Org Notes');
    }

    public function getPriority(): int {
        return 75;
    }

    public function getIcon(): string {
        return $this->urlGenerator->imagePath('orgnotes', 'app.svg');
    }
}
