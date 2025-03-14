import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                'slide-up': {
                    '0%': { transform: 'translateY(100%)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                }
            },
            animation: {
                'slide-up': 'slide-up 0.3s ease-out'
            }
        },
    },
    daisyui: {
        themes: ["light", "dark", "cupcake"],
    },

    plugins: [
        require('daisyui'),
        forms
    ],
};

/*
lo mismo al hacer el import de empresas
hacer la verificacion de from_migration para redirigir al ususairo
*/