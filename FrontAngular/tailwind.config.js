module.exports = {
  content: ["./src/**/*.{html,js,ts}"], // Ensure .ts is included
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A0A0A', // Premium Black
          light: '#1A1A1A',
          hover: '#262626',
        },
        accent: {
          DEFAULT: '#D4AF37', // Gold
          light: '#E8C978',
          hover: '#B5952F',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        'display': ['"Montserrat"', 'sans-serif'],
        'sans': ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

