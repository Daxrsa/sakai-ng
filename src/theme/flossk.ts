import { definePreset } from "@primeuix/themes";
import Aura from '@primeuix/themes/aura';

export const Flossk = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fef9e7',
            100: '#fdf3cf',
            200: '#fbe79f',
            300: '#f9db6f',
            400: '#e7ce3f',
            500: '#dacc05', // Main color
            600: '#aea300',
            700: '#827a00',
            800: '#565200',
            900: '#2a2900',
            950: '#151400'
        },
    },
});