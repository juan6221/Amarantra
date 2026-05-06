export default function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 border-2 border-dark-600 border-t-gold-400 rounded-full animate-spin" />
      <p className="text-dark-400 text-sm">{text}</p>
    </div>
  )
}
