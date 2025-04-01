import antfu from '@antfu/eslint-config'
// import tailwind from 'eslint-plugin-tailwindcss'

export default antfu({
  react: true,
  ignores: ['**/**.gen.*'],
},
  // ...tailwind.configs['flat/recommended'], // Not compatible with Tailwind v4
)
