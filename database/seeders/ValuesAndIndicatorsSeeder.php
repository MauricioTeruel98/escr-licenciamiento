<?php

namespace Database\Seeders;

use App\Models\Value;
use App\Models\Subcategory;
use App\Models\Indicator;
use Illuminate\Database\Seeder;

class ValuesAndIndicatorsSeeder extends Seeder
{
    public function run(): void
    {
        $values = [
            'Excelencia' => [
                'slug' => 'excelencia',
                'minimum_score' => 70,
                'subcategories' => [
                    'Estrategia Empresarial' => [
                        'indicators' => [
                            [
                                'name' => 'E1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿La empresa cuenta con un plan estratégico documentado?',
                                'evaluation_questions' => [
                                    '¿El plan estratégico está alineado con la misión y visión?',
                                    '¿Se revisa periódicamente el cumplimiento del plan?',
                                    '¿Existe un proceso de seguimiento y medición de objetivos?'
                                ],
                                'guide' => 'Verificar la existencia y aplicación del plan estratégico'
                            ],
                            [
                                'name' => 'E1.2',
                                'binding' => true,
                                'self_evaluation_question' => '¿Se realiza análisis del entorno empresarial?',
                                'evaluation_questions' => [
                                    '¿Se identifican oportunidades y amenazas del mercado?',
                                    '¿Se evalúan las tendencias del sector?'
                                ],
                                'guide' => 'Revisar documentación de análisis FODA y estudios de mercado'
                            ]
                        ]
                    ],
                    'Cultura organizacional' => [
                        'indicators' => [
                            [
                                'name' => 'C1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Existe un plan de capacitación?',
                                'evaluation_questions' => [
                                    '¿Se identifican necesidades de formación?',
                                    '¿Se evalúa la efectividad de las capacitaciones?',
                                    '¿Existe un presupuesto asignado para formación?'
                                ],
                                'guide' => 'Verificar plan de capacitación y registros de formación'
                            ]
                        ]
                    ],
                    'Experiencia del cliente y calidad' => [
                        'indicators' => [
                            [
                                'name' => 'EC1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Se mide la satisfacción del cliente?',
                                'evaluation_questions' => [
                                    '¿Existen mecanismos de medición?',
                                    '¿Se analizan las quejas y reclamos?',
                                    '¿Se implementan mejoras basadas en la retroalimentación?'
                                ],
                                'guide' => 'Revisar sistema de medición de satisfacción'
                            ]
                        ]
                    ],
                    'Proceso y cadena de suministro' => [
                        'indicators' => [
                            [
                                'name' => 'P1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Se tienen procesos documentados y controlados?',
                                'evaluation_questions' => [
                                    '¿Existen indicadores de proceso?',
                                    '¿Se realiza mejora continua?',
                                    '¿Se controlan los procesos críticos?'
                                ],
                                'guide' => 'Revisar documentación y control de procesos'
                            ]
                        ]
                    ]
                ]
            ],
            'Innovación' => [
                'slug' => 'innovacion',
                'minimum_score' => 70,
                'subcategories' => [
                    'Estrategia Empresarial' => [
                        'indicators' => [
                            [
                                'name' => 'IE1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Existe una estrategia de innovación?',
                                'evaluation_questions' => [
                                    '¿Se destinan recursos para innovación?',
                                    '¿Se mide el impacto de las innovaciones?'
                                ],
                                'guide' => 'Verificar estrategia y recursos para innovación'
                            ]
                        ]
                    ],
                    'Cultura organizacional' => [
                        'indicators' => [
                            [
                                'name' => 'IC1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Se fomenta la cultura de innovación?',
                                'evaluation_questions' => [
                                    '¿Existen programas de incentivos para la innovación?',
                                    '¿Se promueve la generación de ideas?'
                                ],
                                'guide' => 'Revisar programas de fomento a la innovación'
                            ]
                        ]
                    ],
                    'Experiencia del cliente y calidad' => [
                        'indicators' => [
                            [
                                'name' => 'IEC1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Se innova en productos y servicios?',
                                'evaluation_questions' => [
                                    '¿Se desarrollan nuevos productos/servicios?',
                                    '¿Se mejoran los existentes?'
                                ],
                                'guide' => 'Verificar desarrollo de nuevos productos/servicios'
                            ]
                        ]
                    ],
                    'Proceso y cadena de suministro' => [
                        'indicators' => [
                            [
                                'name' => 'IP1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Se innova en procesos?',
                                'evaluation_questions' => [
                                    '¿Se implementan nuevas tecnologías?',
                                    '¿Se optimizan los procesos existentes?'
                                ],
                                'guide' => 'Revisar mejoras e innovaciones en procesos'
                            ]
                        ]
                    ]
                ]
            ],
            'Progreso social' => [
                'slug' => 'progreso-social',
                'minimum_score' => 70,
                'subcategories' => [
                    'Estrategia Empresarial' => [
                        'indicators' => [
                            [
                                'name' => 'PS1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Se incluye el impacto social en la estrategia?',
                                'evaluation_questions' => [
                                    '¿Existen objetivos de impacto social?',
                                    '¿Se mide el impacto en la comunidad?'
                                ],
                                'guide' => 'Verificar estrategia de impacto social'
                            ]
                        ]
                    ]
                ]
            ],
            'Sostenibilidad' => [
                'slug' => 'sostenibilidad',
                'minimum_score' => 70,
                'subcategories' => [
                    'Estrategia Empresarial' => [
                        'indicators' => [
                            [
                                'name' => 'S1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Existe una estrategia de sostenibilidad?',
                                'evaluation_questions' => [
                                    '¿Se tienen objetivos ambientales?',
                                    '¿Se mide la huella de carbono?'
                                ],
                                'guide' => 'Verificar estrategia ambiental'
                            ]
                        ]
                    ]
                ]
            ],
            'Vinculación' => [
                'slug' => 'vinculacion',
                'minimum_score' => 70,
                'subcategories' => [
                    'Estrategia Empresarial' => [
                        'indicators' => [
                            [
                                'name' => 'V1.1',
                                'binding' => true,
                                'self_evaluation_question' => '¿Existen alianzas estratégicas?',
                                'evaluation_questions' => [
                                    '¿Se tienen convenios con otras organizaciones?',
                                    '¿Se mide el impacto de las alianzas?'
                                ],
                                'guide' => 'Verificar convenios y alianzas'
                            ]
                        ]
                    ]
                ]
            ]
        ];

        foreach ($values as $valueName => $valueData) {
            $value = Value::create([
                'name' => $valueName,
                'slug' => $valueData['slug'],
                'minimum_score' => $valueData['minimum_score'],
                'is_active' => true
            ]);

            foreach ($valueData['subcategories'] as $subcategoryName => $subcategoryData) {
                $subcategory = Subcategory::create([
                    'name' => $subcategoryName,
                    'value_id' => $value->id,
                    'is_active' => true
                ]);

                foreach ($subcategoryData['indicators'] as $indicatorData) {
                    Indicator::create([
                        'name' => $indicatorData['name'],
                        'binding' => $indicatorData['binding'],
                        'self_evaluation_question' => $indicatorData['self_evaluation_question'],
                        'value_id' => $value->id,
                        'subcategory_id' => $subcategory->id,
                        'evaluation_questions' => $indicatorData['evaluation_questions'],
                        'guide' => $indicatorData['guide'],
                        'is_active' => true
                    ]);
                }
            }
        }
    }
}