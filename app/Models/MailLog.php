<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailLog extends Model
{
    protected $fillable = [
        'to_email',
        'subject',
        'mailable_class',
        'mailable_data',
        'status',
        'error_message',
        'attempts',
        'last_attempt'
    ];

    protected $casts = [
        'mailable_data' => 'array',
        'last_attempt' => 'datetime'
    ];
} 