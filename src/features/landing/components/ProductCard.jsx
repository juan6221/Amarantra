import { useState } from 'react'

export default function ProductCard({ producto, categorias = [], onClick }) {
  const [imgError, setImgError] = useState(false)
  const categoria = categorias.find(c => c.id === producto.categoriaId)

  return (
    <div
      className="group bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden cursor-pointer
                 transition-all duration-300 hover:border-gold-400/50 hover:shadow-gold hover:-translate-y-1"
      onClick={() => onClick?.(producto)}
    >
      <div className="relative overflow-hidden aspect-square bg-dark-700">
        {!imgError ? (
          <img
            src={producto.imagenes?.[0]}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-dark-500">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Badge stock */}
        {producto.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
            Agotado
          </div>
        )}
        {categoria && (
          <div className="absolute top-3 right-3 bg-dark-900/80 text-gold-400 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {categoria.nombre}
          </div>
        )}
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-gold-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <h3 className="font-serif font-semibold text-white text-base mb-1 line-clamp-1">{producto.nombre}</h3>
        <p className="text-dark-300 text-xs mb-3 line-clamp-2">{producto.descripcion}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gold-400 text-lg">
            ${producto.precio.toLocaleString('es-CO')}
          </span>
          <span className="text-dark-400 text-xs">
            {producto.stock > 0 ? `${producto.stock} disponibles` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
