import { useEffect, useRef } from "react";
import Image from "next/image";
import type { DetailImage } from "@/util/types/product";

interface ImageModalProps {
  image: DetailImage;
  onClose: () => void;
}

export default function ImageModal({
  image,
  onClose,
}: ImageModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    // 닫을 때 복구할 스크롤 설정과 이전 포커스를 기억한다.
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    // 모달이 제거되거나 페이지를 떠날 때 실행된다.
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;

      // 맘에안들어
      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      }
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="사진 확대"
      className="m-auto max-h-[90vh] max-w-[90vw] rounded-lg p-0 backdrop:bg-black/70"
      onCancel={(event) => {
        // Escape도 부모 상태를 변경하는 닫기 흐름으로 통일한다.
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // 사진이나 내부 요소가 아닌 바깥 배경을 클릭했을 때 닫는다.
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={900}
        height={900}
        className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
      />

      <div className="bg-white p-4">
        <div className="mb-3 flex justify-end">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded border px-3 py-1 focus-visible:outline-2"
          >
            닫기
          </button>
        </div>
      </div>
    </dialog>
  );
}
