<?php

namespace App\Traits;

use App\Models\ActionLog;
use Illuminate\Support\Facades\Auth;

trait LogsActions
{
    protected static function bootLogsActions()
    {
        static::created(function ($model) {
            self::logAction('create', $model);
        });

        static::updated(function ($model) {
            self::logAction('update', $model);
        });

        static::deleted(function ($model) {
            self::logAction('delete', $model);
        });
    }

    protected static function logAction($action, $model)
    {
        $user = Auth::user();
        
        ActionLog::create([
            'user_id' => $user ? $user->id : null,
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'old_data' => $action === 'update' ? $model->getOriginal() : null,
            'new_data' => $action !== 'delete' ? $model->getAttributes() : null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);
    }
}