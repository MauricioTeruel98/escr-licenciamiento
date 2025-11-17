<?php

namespace App\Traits;

use App\Models\ActionLog;
use Illuminate\Support\Facades\Auth;

trait ControllerLogsActions
{
    protected function logAction($action, $model, $oldData = null, $newData = null)
    {
        $user = Auth::user();
        
        ActionLog::create([
            'user_id' => $user ? $user->id : null,
            'action' => $action,
            'model_type' => is_object($model) ? get_class($model) : $model,
            'model_id' => is_object($model) ? $model->id : $model,
            'old_data' => $oldData,
            'new_data' => $newData,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);
    }
}