import { useContext } from 'react'
import { ParametrosContext } from '../context/ParametrosContext'

/** Hook para consumir los parámetros del One-Kit desde cualquier módulo. */
export function useParametros() {
  const ctx = useContext(ParametrosContext)
  if (!ctx) {
    throw new Error('useParametros debe usarse dentro de <ParametrosProvider>')
  }
  return ctx
}
