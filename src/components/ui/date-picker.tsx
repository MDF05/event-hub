import React from 'react';

interface DatePickerProps {
  date?: Date;
  onSelect: (date?: Date) => void;
  placeholder?: string;
}

export function DatePicker({ date, onSelect, placeholder }: DatePickerProps) {
  return (
    <input
      type="date"
      value={date ? date.toISOString().substring(0, 10) : ''}
      onChange={e => {
        if (e.target.value) {
          onSelect(new Date(e.target.value));
        } else {
          onSelect(undefined);
        }
      }}
      className="border rounded px-2 py-1 w-full"
      placeholder={placeholder}
    />
  );
} 