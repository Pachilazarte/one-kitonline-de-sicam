import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { Card, SectionTitle } from '../shared/Card'

const PASOS = [
  [
    'Configurá los Parámetros',
    'Antes de cargar el caso, entrá a Parámetros y verificá que los umbrales (edad jubilatoria, topes socioeconómicos, MOPRE, costo de moratoria) estén actualizados a la normativa vigente. Si tocás un valor, queda guardado y todos los cálculos se ajustan solos.',
  ],
  [
    'Cargá la historia laboral',
    'En Derecho y Aportes ingresá sexo, fecha de nacimiento y fecha de turno. Después sumá cada actividad con sus fechas Desde/Hasta. El sistema netea la simultaneidad automáticamente: los meses superpuestos se cuentan una sola vez.',
  ],
  [
    'Revisá el derecho y el exceso de edad',
    'Mirá los servicios netos y la bonificación por exceso de edad. Recordá que el exceso sirve solo para llegar a los 30 años, no aumenta el haber, y no se carga en la web del SICAM (lo computa ANSES desde el formulario físico).',
  ],
  [
    'Computá las Tareas de Cuidado',
    'Si el caso es de una mujer, cargá los hijos y marcá las condiciones (adopción, discapacidad, AUH). El cómputo es acumulativo por hijo y el sistema aplica el neteo de días contra el exceso de edad, tal como lo hace ANSES.',
  ],
  [
    'Pasá el filtro socioeconómico',
    'En Socioeconómico cargá ingresos, consumos de tarjeta, bienes personales y automotor. Los tres apartados son excluyentes: si falla uno, el caso queda No Apto. Tené presente que el mismo filtro rige para la PUAM.',
  ],
  [
    'Liquidá la deuda y evaluá Bagatela',
    'En Liquidación y Bagatela cargá los períodos adeudados. El sistema clasifica por el corte de sept/1993 y te avisa si hay deuda bloqueante por no renunciar (Art. 1). Después revisá el Cómputo Ilustrativo en Importar/Exportar y descargá el PDF.',
  ],
]

const CODIGOS = [
  ['001', 'Exceso de edad (Art. 19)'],
  ['040', 'Tareas de cuidado (hijos)'],
  ['102', 'Relación de dependencia'],
  ['103', 'Autónomo'],
  ['105', 'Monotributo'],
  ['089', 'Servicio doméstico'],
  ['007', 'Renuncia Art. 1 (Ley 25.321)'],
  ['192', 'UPDP (moratoria 24.476)'],
]

export default function ManualUso() {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <SectionTitle sub="Referencia rápida del flujo, conceptos e interpretación de cada módulo.">
            Cómo usar SICAM
          </SectionTitle>
          <a
            href="/pdf/manual_kit_one_sicam.pdf"
            download="Manual_SICAM_One-Kit.pdf"
            className="shrink-0 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-ocean/15 text-ocean border border-ocean/40 hover:bg-ocean/25 no-underline"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Descargar manual completo
          </a>
        </div>
      </Card>

      <Card>
        <h3 className="font-exo font-600 text-ocean text-sm mb-4">Flujo paso a paso</h3>
        <ol className="space-y-4">
          {PASOS.map(([titulo, texto], i) => (
            <li key={titulo} className="flex gap-4">
              <span className="shrink-0 h-7 w-7 rounded-full bg-ocean/15 text-ocean font-exo font-700 text-sm flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-exo font-600 text-ink text-sm">{titulo}</p>
                <p className="text-sm text-mute mt-0.5 leading-relaxed">{texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <h3 className="font-exo font-600 text-cyan text-sm mb-3">Códigos de cómputo (referencia)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {CODIGOS.map(([cod, desc]) => (
            <div key={cod} className="flex items-center gap-3 text-sm">
              <span className="font-mono text-ocean w-10 shrink-0">{cod}</span>
              <span className="text-ink-soft">{desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
