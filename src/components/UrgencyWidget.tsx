import React, { useState, useEffect } from 'react';

interface UrgencyWidgetProps {
  productId: string;
}

export const UrgencyWidget: React.FC<UrgencyWidgetProps> = ({ productId }) => {
  const [viewerCount, setViewerCount] = useState(7);
  const [stockCount, setStockCount] = useState(4);

  useEffect(() => {
    // Randomize viewer count between 5-15 for realism
    setViewerCount(Math.floor(Math.random() * 11) + 5);
    // You could also randomize stock if you want or pass it down. 
    // The user example had static 4, but let's make it random between 2-6
    setStockCount(Math.floor(Math.random() * 5) + 2);
  }, [productId]);

  return (
    <div>
      <style>
        {`
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.3); }
          }
        `}
      </style>
      
      {/* Stock counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        background: '#FEF3E2',
        borderRadius: '6px',
        marginBottom: '12px',
        fontSize: '13.5px',
        color: '#92400E',
        border: '1px solid rgba(217,119,6,0.2)'
      }}>
        <span>⚡</span>
        <span>Only <strong>{stockCount}</strong> pieces left in stock</span>
      </div>

      {/* Viewer count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: '#6B5F4A',
        marginBottom: '16px'
      }}>
        <span style={{
          width: '8px', height: '8px',
          background: '#22C55E',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'pulse-dot 1.5s infinite'
        }}></span>
        <span><strong>{viewerCount}</strong> people are viewing this right now</span>
      </div>
    </div>
  );
};

