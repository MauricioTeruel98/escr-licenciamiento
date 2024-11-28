<?php

namespace App\Filament\EscrAdmin\Resources;

use App\Filament\EscrAdmin\Resources\AvailableCertificationResource\Pages;
use App\Models\AvailableCertification;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AvailableCertificationResource extends Resource
{
    protected static ?string $model = AvailableCertification::class;
    protected static ?string $navigationIcon = 'heroicon-o-document-check';
    protected static ?string $navigationLabel = 'Certificaciones Disponibles';
    protected static ?string $modelLabel = 'Certificación Disponible';
    protected static ?string $pluralModelLabel = 'Certificaciones Disponibles';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('tipo')
                    ->options(AvailableCertification::TIPOS)
                    ->required()
                    ->label('Tipo de Certificación'),
                Forms\Components\Select::make('categoria')
                    ->options(AvailableCertification::CATEGORIAS)
                    ->required()
                    ->label('Categoría'),
                Forms\Components\TextInput::make('nombre')
                    ->required()
                    ->maxLength(255)
                    ->label('Nombre de la certificación'),
                Forms\Components\TextInput::make('descripcion')
                    ->maxLength(255)
                    ->label('Descripción'),
                Forms\Components\Toggle::make('activo')
                    ->default(true)
                    ->label('¿Está activa?'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tipo')
                    ->searchable()
                    ->sortable()
                    ->label('Tipo'),
                Tables\Columns\TextColumn::make('categoria')
                    ->searchable()
                    ->sortable()
                    ->label('Categoría'),
                Tables\Columns\TextColumn::make('nombre')
                    ->searchable()
                    ->sortable()
                    ->label('Nombre'),
                Tables\Columns\TextColumn::make('descripcion')
                    ->searchable()
                    ->label('Descripción'),
                Tables\Columns\ToggleColumn::make('activo')
                    ->label('Activa'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->label('Fecha de creación'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('tipo')
                    ->options(AvailableCertification::TIPOS)
                    ->label('Tipo'),
                Tables\Filters\SelectFilter::make('categoria')
                    ->options(AvailableCertification::CATEGORIAS)
                    ->label('Categoría'),
                Tables\Filters\TernaryFilter::make('activo')
                    ->label('Estado')
                    ->placeholder('Todas')
                    ->trueLabel('Activas')
                    ->falseLabel('Inactivas'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAvailableCertifications::route('/'),
            'create' => Pages\CreateAvailableCertification::route('/create'),
            'edit' => Pages\EditAvailableCertification::route('/{record}/edit'),
        ];
    }
}