<?php

namespace OCA\OrgNotes\AppInfo;

use OCA\OrgNotes\Controller\OrgController;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

class Application extends App implements IBootstrap {
    public const APP_ID = 'orgnotes';

    public function __construct() {
        parent::__construct(self::APP_ID);
    }

    public function register(IRegistrationContext $context): void {
        $context->registerService(OrgController::class, function ($c) {
            return new OrgController(
                self::APP_ID,
                $c->get(\OCP\IRequest::class),
                $c->get(\OCP\Files\IRootFolder::class),
                $c->get(\OCP\IUserSession::class)->getUser()->getUID(),
            );
        });
    }

    public function boot(IBootContext $context): void {
    }
}
