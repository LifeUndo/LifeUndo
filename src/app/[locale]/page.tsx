// src/app/[locale]/page.tsx
import {redirect} from 'next/navigation';

export default function LocaleIndex() {
  redirect('./downloads');
}