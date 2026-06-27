import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { fmtTiempo } from './tiempo'
import { fmtMoney } from './formato'

/** Genera y descarga el PDF del Cómputo Ilustrativo (espejo del de ANSES). */
export function exportarComputoPDF(computo) {
  const doc = new jsPDF()
  const M = 14

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('Cómputo Ilustrativo de Servicios', M, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(90)
  doc.text(`Fecha de solicitud (turno): ${computo.fechaSolicitud || '—'}`, M, 27)
  doc.text(`Fecha de cese (último aporte): ${computo.fechaCese || '—'}`, M, 32)
  doc.text(`Sexo: ${computo.sexo === 'F' ? 'Mujer' : 'Hombre'}`, M, 37)
  doc.setTextColor(0)

  autoTable(doc, {
    startY: 43,
    head: [['Código', 'Concepto', 'Desde', 'Hasta', 'Meses']],
    body: computo.filas.length
      ? computo.filas.map((f) => [f.codigo, f.concepto, f.desde || '—', f.hasta || '—', f.meses])
      : [['—', 'Sin datos cargados', '—', '—', '—']],
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [225, 123, 215], textColor: 255 }, // rosa One
    columnStyles: { 0: { cellWidth: 20 }, 4: { halign: 'right', cellWidth: 18 } },
    theme: 'striped',
  })

  const t = computo.total
  let y = doc.lastAutoTable.finalY + 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Resumen', M, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  y += 6
  doc.text(`Servicios computables totales: ${fmtTiempo(t.serviciosFinal)} (requerido: 30 años)`, M, y)
  y += 5
  doc.text(`Estado del derecho: ${t.tieneDerecho ? 'CON DERECHO' : `SIN DERECHO — faltan ${fmtTiempo(t.faltan)}`}`, M, y)
  y += 5
  doc.text(`Costo moratoria 24.476: ${fmtMoney(computo.liq.costoMoratoria)} · Períodos renunciados (007): ${computo.liq.renunciados}`, M, y)

  if (computo.liq.hayBloqueante) {
    y += 6
    doc.setTextColor(200, 40, 40)
    doc.text(`⚠ ${computo.liq.bloqueantes.length} período(s) impago(s) post-09/1993 SIN renunciar (deuda bloqueante).`, M, y)
    doc.setTextColor(0)
  }

  doc.setFontSize(7)
  doc.setTextColor(130)
  doc.text(
    'Documento educativo y orientativo — SICAM · Escencial. Sujeto a revisión profesional. No reemplaza el cómputo oficial de ANSES.',
    M,
    287,
  )

  doc.save('computo-ilustrativo-sicam.pdf')
}
