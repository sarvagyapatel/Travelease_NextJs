import React, { forwardRef } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { Button } from '@/components/ui/button';

interface CategoryButtonGroupProps extends UseControllerProps {
  options: [string, string][];
}

const CategoryButtonGroup = forwardRef<HTMLDivElement, CategoryButtonGroupProps>(
  ({ options, ...props }, ref) => {
    const { field } = useController(props);

    const handleCategoryChange = (category: string) => {
      if (field.value.includes(category)) {
        field.onChange(field.value.filter((item: string) => item !== category));
      } else {
        field.onChange([...field.value, category]);
      }
    };

    return (
      <div ref={ref} className='flex flex-wrap gap-2 max-w-96 items-center justify-center'>
        {options.map((category) => (
          <Button
            key={category[0]}
            type="button"  // Ensure the button does not submit the form
            onClick={() => handleCategoryChange(category[1])}
            className={`bg-indigo-800 font-bold rounded-2xl ${field.value.includes(category[1]) ? 'selected bg-blue-950' : '' }`}
          >
            {category[0]}
          </Button>
        ))}
      </div>
    );
  }
);

CategoryButtonGroup.displayName = 'CategoryButtonGroup';

export default CategoryButtonGroup;
