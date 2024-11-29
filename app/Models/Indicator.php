<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Indicator extends Model
{
    protected $fillable = [
        'name',
        'binding',
        'self_evaluation_question',
        'value_id',
        'subcategory_id',
        'evaluation_questions',
        'guide',
        'is_active'
    ];

    protected $guarded = ['homologation_id'];

    protected $casts = [
        'binding' => 'boolean',
        'is_active' => 'boolean',
        'evaluation_questions' => 'array'
    ];

    public function homologation(): BelongsTo
    {
        return $this->belongsTo(AvailableCertification::class, 'homologation_id');
    }

    public function value(): BelongsTo
    {
        return $this->belongsTo(Value::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function getFormattedQuestionsAttribute(): array
    {
        return is_array($this->evaluation_questions) 
            ? $this->evaluation_questions 
            : json_decode($this->evaluation_questions, true) ?? [];
    }

    public function homologations(): BelongsToMany
    {
        return $this->belongsToMany(AvailableCertification::class, 'indicator_homologation', 'indicator_id', 'homologation_id');
    }
} 