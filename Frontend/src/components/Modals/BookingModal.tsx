

interface ModalProps {
  id: string;
  children?: React.ReactNode;
}
export function BookingModal({ id,children }: ModalProps) {
  return (
    <dialog id={`${id}`} className="modal">
      <div className="modal-box max-w-2xl w-full overflow-y-visible">
      {children}
      </div>
      <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>

    </dialog>
  );
}
