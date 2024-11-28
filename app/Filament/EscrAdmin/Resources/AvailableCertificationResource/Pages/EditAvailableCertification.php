<?php

namespace App\Filament\EscrAdmin\Resources\AvailableCertificationResource\Pages;

use App\Filament\EscrAdmin\Resources\AvailableCertificationResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAvailableCertification extends EditRecord
{
    protected static string $resource = AvailableCertificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
