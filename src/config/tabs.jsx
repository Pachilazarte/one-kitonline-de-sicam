import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

import Dashboard from '../components/modules/Dashboard'
import ManualUso from '../components/modules/ManualUso'
import ModDerechoAportes from '../components/modules/ModDerechoAportes'
import ModTareasCuidado from '../components/modules/ModTareasCuidado'
import ModSocioeconomico from '../components/modules/ModSocioeconomico'
import ModLiquidacion from '../components/modules/ModLiquidacion'
import Checklist from '../components/modules/Checklist'
import Parametros from '../components/modules/Parametros'
import ImportExport from '../components/modules/ImportExport'

/**
 * Fuente única de verdad de la navegación One-Kit.
 * `mobile: true` → aparece también en la barra inferior móvil.
 * `core: true`   → bloque fijo del molde (no temático).
 */
export const TABS = [
  { id: 'inicio', label: 'Inicio', short: 'Inicio', icon: HomeIcon, Component: Dashboard, mobile: true },
  { id: 'manual', label: 'Cómo usar', short: 'Ayuda', icon: BookOpenIcon, Component: ManualUso },
  { id: 'derecho', label: 'Derecho y Aportes', short: 'Derecho', icon: UserGroupIcon, Component: ModDerechoAportes, mobile: true },
  { id: 'cuidado', label: 'Tareas de Cuidado', short: 'Cuidado', icon: HeartIcon, Component: ModTareasCuidado, mobile: true },
  { id: 'socioeco', label: 'Socioeconómico', short: 'Socioec.', icon: CurrencyDollarIcon, Component: ModSocioeconomico, mobile: true },
  { id: 'liquidacion', label: 'Liq. y Bagatela', short: 'Liquid.', icon: ScaleIcon, Component: ModLiquidacion },
  { id: 'checklist', label: 'Checklist', short: 'Check', icon: ClipboardDocumentCheckIcon, Component: Checklist, core: true },
  { id: 'parametros', label: 'Parámetros', short: 'Param.', icon: Cog6ToothIcon, Component: Parametros, core: true, mobile: true },
  { id: 'datos', label: 'Importar / Exportar', short: 'Datos', icon: ArrowDownTrayIcon, Component: ImportExport, core: true },
]

export const SEPARATORS_AFTER = new Set(['liquidacion', 'parametros'])
