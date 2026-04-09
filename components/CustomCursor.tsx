
import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isInteractive = !!(
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive')
      );
      setIsHovering(isInteractive);
    };

    const handleMouseOut = () => setIsVisible(false);
    const handleMouseOver = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={isHovering ? 'cursor-active' : ''}>
      <div
        className="cursor-dot"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)` }}
      />
      <div
        className="cursor-ring"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          scale: isHovering ? 1.5 : 1
        }}
      />
    </div>
  );
};

export default CustomCursor;
