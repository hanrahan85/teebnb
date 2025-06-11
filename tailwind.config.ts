
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
				luxury: {
					cream: {
						50: '#fefdfb',
						100: '#fdf9f0',
						200: '#fbf1e1',
						300: '#f7e6c8',
						400: '#f1d5a7',
						500: '#e9c085',
						600: '#daa963',
						700: '#c19348',
						800: '#9e7c3c',
						900: '#816633',
					},
					brown: {
						50: '#faf7f5',
						100: '#f3ede8',
						200: '#e6d7cd',
						300: '#d4baaa',
						400: '#bf9783',
						500: '#a67c5a',
						600: '#8e4531',
						700: '#7a3a29',
						800: '#663125',
						900: '#542a22',
					},
					gold: {
						50: '#fffbeb',
						100: '#fef3c7',
						200: '#fde68a',
						300: '#fcd34d',
						400: '#fbbf24',
						500: '#f59e0b',
						600: '#d97706',
						700: '#b45309',
						800: '#92400e',
						900: '#78350f',
					},
					forest: {
						50: '#f0f9f0',
						100: '#dcf2dc',
						200: '#bce5bc',
						300: '#8fd28f',
						400: '#5cb85c',
						500: '#3a9a3a',
						600: '#2d7d2d',
						700: '#266326',
						800: '#225022',
						900: '#1e421e',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'display': ['Playfair Display', 'Georgia', 'serif'],
				'body': ['Crimson Text', 'Georgia', 'serif'],
				'sans': ['Inter', 'system-ui', 'sans-serif'],
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
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				'luxury-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(184, 134, 11, 0.3)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px rgba(184, 134, 11, 0.5)',
						transform: 'scale(1.02)'
					},
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'slide-in': 'slide-in 0.5s ease-out',
				'luxury-glow': 'luxury-glow 4s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
			},
			backgroundImage: {
				'luxury-gradient': 'linear-gradient(135deg, #8e4531 0%, #a0522d 25%, #b8860b 50%, #daa520 75%, #ffd700 100%)',
				'hero-luxury': 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
				'golf-green': 'linear-gradient(135deg, #166534 0%, #22c55e 50%, #86efac 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
