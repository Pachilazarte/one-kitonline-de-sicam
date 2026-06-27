import { ParametrosProvider } from './context/ParametrosContext'
import { CasoProvider } from './context/CasoContext'
import AppLayout from './components/layout/AppLayout'

export default function App() {
  return (
    <ParametrosProvider>
      <CasoProvider>
        <AppLayout />
      </CasoProvider>
    </ParametrosProvider>
  )
}
