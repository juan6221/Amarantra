import Modal from './Modal'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-dark-200 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-outline-gold px-4 py-2 text-sm">
          Cancelar
        </button>
        <button
          onClick={() => { onConfirm(); onClose() }}
          className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all ${
            danger
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'btn-gold'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}


