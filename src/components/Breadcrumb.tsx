import React from 'react';
import { Link } from 'react-router';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="bg-white px-4 sm:px-6 lg:px-8 pt-6 pb-4 border-b border-[#FAF8F5] relative z-20 w-full"
      style={{ 
        overflow: 'visible',
        display: 'block'
      }}
    >
      <ol 
        className="max-w-4xl mx-auto flex flex-wrap items-center text-[11px] sm:text-xs font-sans tracking-widest uppercase text-[#000000] w-full"
        style={{ 
          lineHeight: '1.6',
          overflow: 'visible',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <li 
                  className="flex items-center justify-center text-[#AFA08A] mx-3 select-none font-light" 
                  aria-hidden="true"
                  style={{ 
                    fontSize: '14px', 
                    lineHeight: '1',
                    alignSelf: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ›
                </li>
              )}
              <li 
                className="flex items-center min-w-0" 
                style={{ 
                  overflow: 'visible',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {isLast || !item.path ? (
                  <span 
                    className="text-[#000000] font-bold tracking-[0.03em] break-words" 
                    style={{ 
                      lineHeight: '1.6',
                      display: 'inline-block'
                    }}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    to={item.path} 
                    className="text-[#000000] hover:text-[#B08A45] font-medium transition-colors duration-300 break-words"
                    style={{ 
                      lineHeight: '1.6',
                      display: 'inline-block'
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

