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
				'coton-black': 'hsl(var(--coton-black))',
				'coton-beige': 'hsl(var(--coton-beige))',
				'coton-beige-light': 'hsl(var(--coton-beige-light))',
				'coton-rose': 'hsl(var(--coton-rose))',
				'coton-rose-alt': 'hsl(var(--coton-rose-alt))',
				'coton-coral': 'hsl(var(--coton-coral))',
				'coton-green': 'hsl(var(--coton-green))',
				'coton-nude': 'hsl(var(--coton-nude))',
				'coton-nude-light': 'hsl(var(--coton-nude-light))',
				'coton-nude-soft': 'hsl(var(--coton-nude-soft))',
				'coton-sand': 'hsl(var(--coton-sand))',
				'coton-gray': 'hsl(var(--coton-gray))',
				'coton-gray-light': 'hsl(var(--coton-gray-light))',
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
			},
			backgroundImage: {
				'gradient-rose': 'var(--gradient-rose)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-coral': 'var(--gradient-coral)',
				'gradient-soft': 'var(--gradient-soft)',
			},
			keyframes: {
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
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
