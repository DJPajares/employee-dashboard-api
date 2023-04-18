import { z } from 'zod';

export const queryParamsSchema = z.object({
  minSalary: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: 'minSalary is required and must be a positive number'
    }),
  maxSalary: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: 'maxSalary is required and must be a positive number'
    }),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val >= 0, {
      message: 'maxSalary is required and must be a positive number'
    }),
  offset: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val >= 0, {
      message: 'maxSalary is required and must be a positive number'
    }),
  sort: z
    .string()
    .refine(
      (val) => {
        const firstChar = val.charAt(0);
        const sortField = val.replace(/^[+\-\s]*/g, '');

        return (
          (firstChar === ' ' || firstChar === '-') && // '+' sign in the query string is URL-decoded to a space
          ['id', 'name', 'login', 'salary'].includes(sortField)
        );
      },
      {
        message: 'Invalid sort field'
      }
    )
    .transform((val) => {
      const sortOrder = val.startsWith('-') ? 'desc' : 'asc';
      const sortField = val.replace(/^[+\-\s]*/g, '');

      return {
        [sortField]: sortOrder
      };
    })
});
