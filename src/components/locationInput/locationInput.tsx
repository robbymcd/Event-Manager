'use client';
import { useRef, useEffect } from 'react';
import { Input } from '../ui/input';

type Props = {
  className?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function LocationInput({ className, value, onChange, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
    });

    const darkModeStyle = document.createElement('style');
    darkModeStyle.textContent = `
      .pac-container {
        background-color: #1a1a1a;
        border: 1px solid #383838;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        margin-top: 10px;
        border-radius: 6px;
      }
      .pac-item {
        border-top: 1px solid #374151;
        color: #e5e7eb;
        padding: 8px;
      }
      .pac-item:hover, .pac-item-selected {
        background-color: #374151;
      }
      .pac-item-query {
        color: #e5e7eb;
      }
      .pac-matched {
        color: #93c5fd;
      }
      .pac-icon {
        filter: invert(0.8);
      }
    `;
    document.head.appendChild(darkModeStyle);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, [onChange]);

  return <Input type="text" value={value} placeholder={placeholder} ref={inputRef} className={className} onChange={(e) => onChange(e.target.value)}/>;
}