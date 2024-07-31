import React, { forwardRef } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { DateRange } from 'react-day-picker';
import { Calendar as DayPicker  } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ControlledDatePickerProps extends UseControllerProps {
  className?: string;
}

const ControlledDatePicker = forwardRef<HTMLDivElement, ControlledDatePickerProps>(
  ({ className, ...props }, ref) => {
    const { field } = useController(props);
    const [date, setDate] = React.useState<DateRange | undefined>({
      from: field.value?.from || undefined,
      to: field.value?.to || undefined,
    });

    const handleDateChange = (dateRange: DateRange | undefined) => {
      setDate(dateRange);
      field.onChange(dateRange);
    };

    return (
      <div ref={ref} className={cn('grid gap-2', className)}>
        <Popover>
          <PopoverTrigger asChild>
          <Button className='bg-indigo-800 rounded-full shadow-2xl'>
            <CalendarIcon />
          </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 -mt-36" align="center">
            <DayPicker
              mode="range"
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

ControlledDatePicker.displayName = 'ControlledDatePicker';

export default ControlledDatePicker;
