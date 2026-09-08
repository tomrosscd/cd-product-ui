'use client'
import { createContext, useContext, type HTMLAttributes } from 'react'
export type ProductTheme = 'light' | 'dark'
const ThemeContext = createContext<ProductTheme>('light')
export function useProductTheme() {
  return useContext(ThemeContext)
}
/** Controlled, scoped theme. The host owns system preference and persistence. */
export function ThemeProvider({
  theme,
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { theme: ProductTheme }) {
  return (
    <ThemeContext.Provider value={theme}>
      <div {...props} data-cui-theme={theme} className={`cui-root cui-theme ${className}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
