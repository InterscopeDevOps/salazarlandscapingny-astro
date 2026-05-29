/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary)',
				secondary: 'var(--secondary)',
				tertiary: 'var(--tertiary)',
				fourth: 'var(--fourth)',
				title: 'var(--title)',
				text: 'var(--text)',
				btnColor: 'var(--btn-color)',
				btnHover: 'var(--btn-hover-color)',
				btnBorder: 'var(--btn-border-color)',
			},
			keyframes: {
				'slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-100%)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)',
					},
				},
				'slide-out-right': {
					'0%': {
						opacity: '1',
						transform: 'translateX(0)',
					},
					'100%': {
						opacity: '0',
						transform: 'translateX(100%)',
					},
				},
				'slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(100%)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)',
					},
				},
				'fade-in-out': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9999)',
					},
					'5%': {
						opacity: '1',
					},
					'95%': {
						opacity: '1',
					},
					'100%': {
						opacity: '0',
						transform: 'scale(1.05)',
					},
				},
				'moveWaveLeftRight': {
					'0%': {
						transform: 'translateX(0)',
					},
					'100%': {
						transform: 'translateX(100px)',
					},
				},
				'moveWaveRightLeft': {
					'0%': {
						transform: 'translateX(100px)',
					},
					'100%': {
						transform: 'translateX(0)',
					},
				},
				'fadeSlideUp': {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					},
				},
				fadeSlideDown: {
					'0%': {
						transform: 'translateY(-100%)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					},
				},
			},
			animation: {
				'slide-in-left': 'slide-in-left 1s ease',
				'slide-in-right': 'slide-in-right 1s ease',
				'slide-out-right': 'slide-out-right 1s ease',
				'fade-slide-up': 'fadeSlideUp 1s ease',
				'fade-slide-down': 'fadeSlideDown 1s ease-out',
				'fade-in-out': 'fade-in-out 15s infinite alternate ease-in-out',
				'moveWaveLeftRight': 'moveWaveLeftRight 6s ease-in-out alternate infinite',
				'moveWaveRightLeft': 'moveWaveRightLeft 6s ease-in-out alternate infinite',
				'fade-slide-up-delay-1': 'fadeSlideUp 0.8s ease-out 0.2s backwards',
				'fade-slide-up-delay-2': 'fadeSlideUp 0.8s ease-out 0.4s backwards',
				'fade-slide-up-delay-3': 'fadeSlideUp 0.8s ease-out 0.6s backwards',
				'slide-in-left-delay-1': 'slide-in-left 0.8s ease 0.3s backwards',
				'slide-in-left-delay-2': 'slide-in-left 0.8s ease 0.5s backwards',
				'slide-in-right-delay': 'slide-in-right 0.8s ease 0.4s backwards',
			},
			backgroundImage: {
				homeGrant: 'linear-gradient(270deg, var(--primary) 18%, rgba(26, 31, 68, 0) 18%)'
			},
		},
	},

	plugins: [],
}
