import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
			},
			screens: {
				xs: '480px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
			},
		},
		extend: {
			// Mobile-first breakpoints
			screens: {
				xs: '480px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
			},
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				roboto: ['Roboto', 'sans-serif'],
			},
			// Mobile-first spacing using CSS variables
			spacing: {
				xs: 'var(--spacing-xs)',
				sm: 'var(--spacing-sm)',
				md: 'var(--spacing-md)',
				lg: 'var(--spacing-lg)',
				xl: 'var(--spacing-xl)',
				'2xl': 'var(--spacing-2xl)',
				'3xl': 'var(--spacing-3xl)',
			},
			// Mobile-first font sizes
			fontSize: {
				xs: ['var(--text-xs)', { lineHeight: '1.4' }],
				sm: ['var(--text-sm)', { lineHeight: '1.5' }],
				base: ['var(--text-base)', { lineHeight: '1.5' }],
				lg: ['var(--text-lg)', { lineHeight: '1.5' }],
				xl: ['var(--text-xl)', { lineHeight: '1.4' }],
				'2xl': ['var(--text-2xl)', { lineHeight: '1.3' }],
				'3xl': ['var(--text-3xl)', { lineHeight: '1.2' }],
				'4xl': ['var(--text-4xl)', { lineHeight: '1.1' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				info: 'hsl(var(--info))',
				// 5-Color Palette
				'coton-black': 'hsl(var(--coton-black))',
				'coton-white': 'hsl(var(--coton-white))',
				'coton-terracotta': 'hsl(var(--coton-terracotta))',
				'coton-cream': 'hsl(var(--coton-cream))',
				'coton-gray': 'hsl(var(--coton-gray))',
				'cta-primary': 'hsl(var(--cta-primary))',
				'cta-primary-foreground': 'hsl(var(--cta-primary-foreground))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				pill: 'var(--radius-pill)'
			},
			boxShadow: {
				soft: 'var(--shadow-soft)',
				card: 'var(--shadow-card)',
				elegant: 'var(--shadow-elegant)',
				glow: 'var(--shadow-glow)',
				premium: 'var(--shadow-premium)',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-soft': 'var(--gradient-soft)',
				'gradient-premium': 'var(--gradient-premium)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-hero-enhanced': 'var(--gradient-hero-enhanced)',
			},
			keyframes: {
				'scale-in': {
					from: {
						opacity: '0',
						transform: 'scale(0.8)'
					},
					to: {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'fade-in': {
					from: {
						opacity: '0'
					},
					to: {
						opacity: '1'
					}
				},
				'slide-up': {
					from: {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 10px hsl(var(--coton-terracotta) / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 20px hsl(var(--coton-terracotta) / 0.6)'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'scale-in': 'scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in': 'fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-up': 'slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
