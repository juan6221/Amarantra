import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generarFacturaPDF(venta, productos, usuario, cliente) {
  const doc = new jsPDF()
  const gold  = [212, 175, 55]
  const dark  = [20, 20, 20]
  const gray  = [100, 100, 100]
  const light = [245, 245, 245]

  // Fondo encabezado
  doc.setFillColor(...dark)
  doc.rect(0, 0, 210, 45, 'F')

  // Nombre empresa
  doc.setTextColor(...gold)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('AMARANTA', 14, 20)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 200, 200)
  doc.text('Lujo · Exclusividad · Distinción', 14, 28)
  doc.text('contacto@amaranta.com  |  +57 300 123 4567', 14, 35)

  // Número de factura
  doc.setTextColor(...gold)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`FACTURA #${String(venta.id).padStart(5, '0')}`, 196, 18, { align: 'right' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 200, 200)
  doc.text(`Fecha: ${venta.fecha}`, 196, 26, { align: 'right' })
  doc.text(`Estado: ${venta.estado?.toUpperCase() || 'COMPLETADA'}`, 196, 34, { align: 'right' })

  // Línea dorada
  doc.setDrawColor(...gold)
  doc.setLineWidth(0.8)
  doc.line(14, 48, 196, 48)

  // Info vendedor y cliente
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...dark)
  doc.text('ATENDIDO POR', 14, 58)
  doc.text('CLIENTE', 110, 58)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...gray)
  doc.text(usuario?.nombre || '—', 14, 65)
  doc.text(usuario?.rol ? `Rol: ${usuario.rol}` : '', 14, 71)

  doc.setTextColor(...gray)
  doc.text(cliente?.nombre || 'Cliente general', 110, 65)
  if (cliente?.email)    doc.text(cliente.email,    110, 71)
  if (cliente?.telefono) doc.text(cliente.telefono, 110, 77)

  // Tabla de productos
  const rows = venta.productos.map(item => {
    const prod   = productos.find(p => p.id === item.productoId)
    const nombre = prod?.nombre || `Producto #${item.productoId}`
    const precio = item.precio
    const subtotal = precio * item.cantidad
    return [
      nombre,
      item.cantidad,
      `$${precio.toLocaleString('es-CO')}`,
      `$${subtotal.toLocaleString('es-CO')}`,
    ]
  })

  autoTable(doc, {
    startY: 88,
    head: [['Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: dark, textColor: gold, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { textColor: [40, 40, 40], fontSize: 9 },
    alternateRowStyles: { fillColor: light },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'right',  cellWidth: 40 },
      3: { halign: 'right',  cellWidth: 40 },
    },
    margin: { left: 14, right: 14 },
  })

  const finalY = doc.lastAutoTable.finalY + 8

  // Total
  doc.setFillColor(...dark)
  doc.roundedRect(130, finalY, 66, 18, 2, 2, 'F')
  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('TOTAL:', 136, finalY + 11)
  doc.setFontSize(12)
  doc.text(`$${venta.total.toLocaleString('es-CO')}`, 194, finalY + 11, { align: 'right' })

  // Pie
  const pageH = doc.internal.pageSize.height
  doc.setDrawColor(...gold)
  doc.setLineWidth(0.4)
  doc.line(14, pageH - 20, 196, pageH - 20)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...gray)
  doc.text('Amaranta — Gracias por su compra.', 14, pageH - 13)
  doc.text(`Generado el ${new Date().toLocaleDateString('es-CO')}`, 196, pageH - 13, { align: 'right' })

  doc.save(`Factura_Amaranta_${String(venta.id).padStart(5, '0')}.pdf`)
}


