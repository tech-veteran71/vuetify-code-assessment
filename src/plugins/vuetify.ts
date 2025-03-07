/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { md3 } from 'vuetify/blueprints';

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
   blueprint: md3, // Use Material Design 3 for a modern look
  theme: {
    defaultTheme: 'luxuryTheme',
    themes: {
      luxuryTheme: {
        dark: true, // Enable dark mode for a premium feel
        colors: {
          primary: '#FFD700', // Gold
          secondary: '#B8860B', // Dark goldenrod
          background: '#121212', // Rich dark background
          surface: '#1E1E1E', // Sleek surface color
          error: '#FF6F61',
          success: '#4CAF50',
          info: '#2196F3',
          warning: '#FB8C00',
        },
      },
    },
  },
})
