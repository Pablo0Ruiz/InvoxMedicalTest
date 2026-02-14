
export const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';


export const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500 shadow-lg hover:shadow-blue-500/25',
  secondary: 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500 border border-gray-600',
} as const;

export const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;
