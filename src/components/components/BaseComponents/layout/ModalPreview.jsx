// components/ModalPreview.jsx
export default function ModalPreview({ image, onClose }) {
  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image}
          alt="Preview"
          className="w-full h-auto rounded-lg object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
