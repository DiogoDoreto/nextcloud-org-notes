<?php

namespace OCA\OrgNotes\Controller;

use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCSController;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IRequest;
use OCP\Files\NotPermittedException;

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
                $header = substr($file->getContent(), 0, 2048);
                $title = null;
                $id = null;
                if (preg_match('/^#\+TITLE:\s*(.+)$/mi', $header, $m)) {
                    $title = trim($m[1]);
                }
                if (preg_match('/^:ID:\s*(\S+)/mi', $header, $m)) {
                    $id = trim($m[1]);
                }
                $result[] = [
                    'path' => $path,
                    'name' => $file->getName(),
                    'mtime' => $file->getMTime(),
                    'title' => $title,
                    'id' => $id,
                ];
            }
        }
        return new DataResponse($result);
    }

    /**
     * @NoAdminRequired
     */
    public function getFile(string $path): DataResponse {
        if (!str_starts_with($path, '/Notes/')) {
            return new DataResponse([], 403);
        }
        try {
            $userFolder = $this->rootFolder->getUserFolder($this->userId);
            $file = $userFolder->get($path);
            $content = $file->getContent();
            return new DataResponse(['content' => $content]);
        } catch (NotFoundException) {
            return new DataResponse([], 404);
        }
    }

    /**
     * @NoAdminRequired
     */
    public function putFile(string $path, string $content): DataResponse {
        if (!str_starts_with($path, '/Notes/')) {
            return new DataResponse([], 403);
        }
        try {
            $userFolder = $this->rootFolder->getUserFolder($this->userId);
            $file = $userFolder->get($path);
            if (!$file->isUpdateable()) {
                return new DataResponse([], 403);
            }
            $file->putContent($content);
            return new DataResponse([]);
        } catch (NotFoundException) {
            return new DataResponse([], 404);
        } catch (NotPermittedException) {
            return new DataResponse([], 403);
        }
    }
}
