<?php

namespace OCA\OrgNotes\Controller;

use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCSController;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IRequest;

class OrgController extends OCSController {
    public function __construct(
        string $appName,
        IRequest $request,
        private IRootFolder $rootFolder,
        private string $userId,
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * @NoAdminRequired
     */
    public function listFiles(): DataResponse {
        $userFolder = $this->rootFolder->getUserFolder($this->userId);
        $files = $userFolder->searchByMime('text/org');
        $result = [];
        foreach ($files as $file) {
            $path = $userFolder->getRelativePath($file->getPath());
            if ($path !== null && str_starts_with($path, '/Notes/')) {
                $result[] = [
                    'path' => $path,
                    'name' => $file->getName(),
                    'mtime' => $file->getMTime(),
                ];
            }
        }
        return new DataResponse($result);
    }

    /**
     * @NoAdminRequired
     */
    public function getFile(string $path): DataResponse {
        try {
            $userFolder = $this->rootFolder->getUserFolder($this->userId);
            $file = $userFolder->get($path);
            $content = $file->getContent();
            return new DataResponse(['content' => $content]);
        } catch (NotFoundException) {
            return new DataResponse([], 404);
        }
    }
}
