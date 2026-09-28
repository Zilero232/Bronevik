'use client';

import { createContext, use } from 'react';

import type { FormControlA11y } from '../use-form-field';

export const FormControlContext = createContext<FormControlA11y>({});

export const useFormControl = (): FormControlA11y => use(FormControlContext);
