import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/Pages/**/*.jsx',
        './resources/js/Components/**/*.jsx',
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#9C413D",
                "secondary": "#001F3F",
                "background-light": "#F4F1EA",
                "background-dark": "#221610",
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
    },

    plugins: [forms],
};
