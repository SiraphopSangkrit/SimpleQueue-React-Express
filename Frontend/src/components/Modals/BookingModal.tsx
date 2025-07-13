

interface ModalProps {
  id: string;
  children?: React.ReactNode;
}
export function BookingModal({ id,children }: ModalProps) {
  return (
    <dialog id={`${id}`} className="modal">
      <div className="modal-box max-w-2xl w-full overflow-y-visible">
        <form method="dialog">
         
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
      {children}
      </div>
    </dialog>
  );
}
