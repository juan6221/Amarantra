import { useState } from 'react'
import Modal from '../../../components/Modal'

export default function ProductDetailModal({ producto, categorias = [], isOpen, onClose }) {
  const [activeImg, setActiveImg] = useState(0)
  if (!producto) return null

  const categoria = categorias.find(c => c.id === producto.categoriaId)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={producto.nombre} size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Galería */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-dark-800 mb-3">
            <img
              src={producto.imagenes?.[activeImg]}
              alt={producto.nombre}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = '' }}
            />
          </div>
          {producto.imagenes?.length > 1 && (
            <div className="flex gap-2">
              {producto.imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeImg ? 'border-gold-400' : 'border-dark-600 hover:border-dark-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          {categoria && (
            <span className="badge-admin">{categoria.nombre}</span>
          )}
          <h3 className="font-serif text-2xl font-bold text-white">{producto.nombre}</h3>
          <p className="text-3xl font-bold text-gold-400">
            ${producto.precio.toLocaleString('es-CO')}
          </p>
          <p className="text-dark-200 leading-relaxed">{producto.descripcion}</p>
          <div className="flex items-center gap-2">
            <span className={producto.stock > 0 ? 'badge-active' : 'badge-inactive'}>
              {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
            </span>
          </div>
          <div className="pt-4 border-t border-dark-600">
            <p className="text-dark-400 text-xs">
              Para adquirir este producto, visítanos en tienda o contáctanos.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}


