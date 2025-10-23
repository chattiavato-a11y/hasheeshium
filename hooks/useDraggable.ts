import { RefObject, useEffect } from 'react';

const useDraggable = (targetRef: RefObject<HTMLElement>, handleRef?: RefObject<HTMLElement>) => {
  useEffect(() => {
    const node = targetRef.current;
    const handle = handleRef?.current ?? node;

    if (!node || !handle) {
      return;
    }

    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const ensurePositioning = () => {
      if (!node.style.left) {
        const rect = node.getBoundingClientRect();
        node.style.left = `${rect.left}px`;
        node.style.top = `${rect.top}px`;
        node.style.transform = 'none';
      }
      node.style.position = 'fixed';
      node.style.margin = '0';
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId === null || event.pointerId !== pointerId) {
        return;
      }

      const nextLeft = initialLeft + (event.clientX - startX);
      const nextTop = initialTop + (event.clientY - startY);

      node.style.left = `${nextLeft}px`;
      node.style.top = `${nextTop}px`;
    };

    const endDrag = (event: PointerEvent) => {
      if (pointerId === null || event.pointerId !== pointerId) {
        return;
      }

      pointerId = null;
      node.classList.remove('dragging');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };

    const onPointerDown = (event: PointerEvent) => {
      pointerId = event.pointerId;
      const rect = node.getBoundingClientRect();
      startX = event.clientX;
      startY = event.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      ensurePositioning();
      node.classList.add('dragging');

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', endDrag);
      window.addEventListener('pointercancel', endDrag);
    };

    handle.addEventListener('pointerdown', onPointerDown);

    return () => {
      handle.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, [handleRef, targetRef]);
};

export default useDraggable;
