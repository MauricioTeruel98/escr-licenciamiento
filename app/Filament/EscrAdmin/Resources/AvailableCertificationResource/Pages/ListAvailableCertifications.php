<?php

namespace App\Filament\EscrAdmin\Resources\AvailableCertificationResource\Pages;

use App\Filament\EscrAdmin\Resources\AvailableCertificationResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAvailableCertifications extends ListRecords
{
    protected static string $resource = AvailableCertificationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
