<?php

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class ReportConflictException extends ConflictHttpException
{
    public function __construct(string $message = 'Laporan sedang diproses atau telah diverifikasi sehingga tidak dapat diubah.', ?\Throwable $previous = null, int $code = 0, array $headers = [])
    {
        parent::__construct($message, $previous, $code, $headers);
    }
}
