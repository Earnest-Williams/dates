import { useState, useRef, useEffect, useCallback, memo } from 'react';
import './VirtualList.css';

/**
 * VirtualList - A simple virtualized list component for performance optimization
 * 
 * Only renders items that are visible in the viewport, reducing DOM nodes
 * and improving performance for long lists.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to render
 * @param {Function} props.renderItem - Function to render each item (index, item) => ReactNode
 * @param {number} props.itemHeight - Height of each item in pixels
 * @param {number} props.height - Total height of the visible container
 * @param {string} props.className - Optional CSS class name
 * @param {Object} props.style - Optional inline styles
 */
const VirtualList = ({ 
  items, 
  renderItem, 
  itemHeight = 60, 
  height = 400,
  className = '',
  style = {},
  overscan = 5 
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  
  // Calculate visible items
  const visibleCount = Math.ceil(height / itemHeight) + overscan * 2;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleCount);
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  // Handle scroll events
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  // Calculate container height for scrollbar
  const totalHeight = items.length * itemHeight;
  const containerStyle = {
    height: `${height}px`,
    overflow: 'auto',
    ...style
  };
  
  // Calculate padding for items above the visible area
  const paddingTop = startIndex * itemHeight;
  
  return (
    <div 
      ref={containerRef}
      className={`virtual-list ${className}`}
      style={containerStyle}
      onScroll={handleScroll}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0,
          paddingTop: `${paddingTop}px`
        }}>
          {visibleItems.map((item, index) => {
            const itemIndex = startIndex + index;
            return (
              <div 
                key={itemIndex}
                style={{ height: `${itemHeight}px` }}
              >
                {renderItem(itemIndex, item)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

VirtualList.displayName = 'VirtualList';

export default memo(VirtualList);
