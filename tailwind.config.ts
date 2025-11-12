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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
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
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Educational Game Colors
				'even-number': 'hsl(var(--even-number))',
				'odd-number': 'hsl(var(--odd-number))',
				'math-symbol': 'hsl(var(--math-symbol))',
				// Rigleta Colors
				'rigleta-1': 'hsl(var(--rigleta-1))',
				'rigleta-2': 'hsl(var(--rigleta-2))',
				'rigleta-3': 'hsl(var(--rigleta-3))',
				'rigleta-4': 'hsl(var(--rigleta-4))',
				'rigleta-5': 'hsl(var(--rigleta-5))',
				'rigleta-6': 'hsl(var(--rigleta-6))',
				'rigleta-7': 'hsl(var(--rigleta-7))',
				'rigleta-8': 'hsl(var(--rigleta-8))',
				'rigleta-9': 'hsl(var(--rigleta-9))',
				'rigleta-10': 'hsl(var(--rigleta-10))',
				// Letter Colors
				'vowel': 'hsl(var(--vowel-color))',
				'consonant': 'hsl(var(--consonant-color))',
				// Life System
				'life-full': 'hsl(var(--life-full))',
				'life-empty': 'hsl(var(--life-empty))',
				// Success and Error
				success: 'hsl(var(--success))',
				'success-light': 'hsl(var(--success-light))',
				error: 'hsl(var(--error))',
				'error-light': 'hsl(var(--error-light))',
				// Progress
				'progress-fill': 'hsl(var(--progress-fill))',
				'progress-bg': 'hsl(var(--progress-bg))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
			},
			scale: {
				'120': '1.2'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
