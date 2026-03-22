<?php

namespace OCA\OrgNotes\AppInfo;

use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCA\OrgNotes\Controller\OrgController;
use OCA\OrgNotes\Settings\PersonalSection;
use OCA\OrgNotes\Settings\PersonalSettings;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\EventDispatcher\IEventDispatcher;

class Application extends App implements IBootstrap {
    public const APP_ID = 'orgnotes';

    public function __construct() {
        parent::__construct(self::APP_ID);
    }

    public function register(IRegistrationContext $context): void {
        $context->registerService(OrgController::class, function ($c) {
            $user = $c->get(\OCP\IUserSession::class)->getUser();
            if ($user === null) {
                throw new \RuntimeException('OrgController requires an authenticated user');
            }
            return new OrgController(
                self::APP_ID,
                $c->get(\OCP\IRequest::class),
                $c->get(\OCP\Files\IRootFolder::class),
                $c->get(\OCP\IConfig::class),
                $user->getUID(),
            );
        });
        $context->registerPersonalSettings(PersonalSettings::class);
        $context->registerPersonalSection(PersonalSection::class);
    }

    public function boot(IBootContext $context): void {
        \OCP\Util::addStyle(self::APP_ID, 'orgnotes');

        $dispatcher = $context->getServerContainer()->get(IEventDispatcher::class);
        $dispatcher->addListener(LoadAdditionalScriptsEvent::class, function () {
            \OCP\Util::addInitScript(self::APP_ID, 'main');
        });
    }
}
