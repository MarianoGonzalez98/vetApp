/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			backgroundImage: {
				'dog-pattern': "url('/dog-1895260_1920.png')",
			}
		},
	},
	plugins: [require('@tailwindcss/forms'),...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()],
}


//dog-1895260_1920.png