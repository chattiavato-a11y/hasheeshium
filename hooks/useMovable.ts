import { useRef, useEffect, useCallback } from 'react';
import type React from 'react';

/**
 * A custom hook to make a modal component both draggable and resizable.
 * @param modalRef A ref to the modal's main container element.
 * @param dragHandleRef A ref to the element that will act as the drag handle (e.g., the header).
 * @param resizeHandleRef A ref to the element that will act as the resize handle (e.g., a corner grip).
 */
export const useMovable = (
  modalRef: React.RefObject<HTMLDivElement>,
  dragHandleRef: React.RefObject<HTMLElement>,
  resizeHandleRef: React.RefObject<HTMLElement>
) => {
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialModalRect = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const onMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as Node;
    const modal = modalRef.current;
    if (!modal) return;

    // Check if the resize handle was clicked
    if (resizeHandleRef.current && resizeHandleRef.current.contains(target)) {
      isResizing.current = true;
      const rect = modal.getBoundingClientRect();
      initialModalRect.current = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
      startPos.current = { x: e.clientX, y: e.clientY };
      document.body.style.cursor = 'se-resize';
      e.preventDefault();
      
    // Check if the drag handle was clicked
    } else if (dragHandleRef.current && dragHandleRef.current.contains(target)) {
      isDragging.current = true;
      const rect = modal.getBoundingClientRect();
      initialModalRect.current = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
      startPos.current = { x: e.clientX, y: e.clientY };
      
      // Explicitly set position, dimensions, and cursor to prevent glitches
      modal.style.position = 'fixed';
      modal.style.left = `${rect.left}px`;
      modal.style.top = `${rect.top}px`;
      modal.style.width = `${rect.width}px`;
      modal.style.height = `${rect.height}px`;
      modal.style.right = 'auto';
      modal.style.bottom = 'auto';
      modal.style.transform = 'none';
      
      document.body.style.cursor = 'grabbing';
      e.preventDefault();
    }
  }, [modalRef, dragHandleRef, resizeHandleRef]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isResizing.current) {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const newWidth = initialModalRect.current.width + dx;
      const newHeight = initialModalRect.current.height + dy;
      
      // Enforce minimum dimensions
      modal.style.width = `${Math.max(320, newWidth)}px`;
      modal.style.height = `${Math.max(300, newHeight)}px`;

    } else if (isDragging.current) {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      modal.style.left = `${initialModalRect.current.x + dx}px`;
      modal.style.top = `${initialModalRect.current.y + dy}px`;
    }
  }, []);

  const onMouseUp = useCallback(() => {
    // Reset state and cursor on mouse up
    isDragging.current = false;
    isResizing.current = false;
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    // We listen on the document to capture mouse events anywhere on the page
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseDown, onMouseMove, onMouseUp]);
};
