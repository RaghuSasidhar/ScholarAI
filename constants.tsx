import React from 'react';
import { Persona, PersonaOption } from './types';
import { BrainCircuitIcon, StethoscopeIcon, CalculatorIcon, BookOpenIcon, BackpackIcon, CodeIcon, ScaleIcon, BeakerIcon } from './components/Icons';

export const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: Persona.ENGINEER,
    name: 'Engineer',
    icon: <BrainCircuitIcon className="w-6 h-6" />,
    color: 'border-cyan-500 text-cyan-400',
  },
  {
    id: Persona.PROGRAMMER,
    name: 'Programmer',
    icon: <CodeIcon className="w-6 h-6" />,
    color: 'border-purple-500 text-purple-400',
  },
  {
    id: Persona.DOCTOR,
    name: 'Doctor',
    icon: <StethoscopeIcon className="w-6 h-6" />,
    color: 'border-red-500 text-red-400',
  },
   {
    id: Persona.SCIENTIST,
    name: 'Scientist',
    icon: <BeakerIcon className="w-6 h-6" />,
    color: 'border-pink-500 text-pink-400',
  },
  {
    id: Persona.CA_ASPIRANT,
    name: 'CA Aspirant',
    icon: <CalculatorIcon className="w-6 h-6" />,
    color: 'border-amber-500 text-amber-400',
  },
  {
    id: Persona.LAWYER,
    name: 'Lawyer',
    icon: <ScaleIcon className="w-6 h-6" />,
    color: 'border-slate-500 text-slate-400',
  },
   {
    id: Persona.STUDENT,
    name: 'Student',
    icon: <BackpackIcon className="w-6 h-6" />,
    color: 'border-green-500 text-green-400',
  },
  {
    id: Persona.GENERAL,
    name: 'General',
    icon: <BookOpenIcon className="w-6 h-6" />,
    color: 'border-indigo-500 text-indigo-400',
  },
];

export const SUGGESTED_TOPICS: Record<Persona, string[]> = {
  [Persona.ENGINEER]: ['Quantum Computing', 'Neural Networks', 'Control Systems', 'Thermodynamics'],
  [Persona.PROGRAMMER]: ['Rust vs. Go', 'WebAssembly (WASM)', 'Microservices Architecture', 'GraphQL Basics'],
  [Persona.DOCTOR]: ['CRISPR Gene Editing', 'mRNA Vaccines', 'The Human Microbiome', 'Cardiovascular Diseases'],
  [Persona.SCIENTIST]: ['String Theory', 'Dark Matter', 'Photosynthesis', 'Plate Tectonics'],
  [Persona.CA_ASPIRANT]: ['International Taxation', 'Derivative Markets', 'Insolvency and Bankruptcy Code', 'Forensic Accounting'],
  [Persona.LAWYER]: ['Intellectual Property Law', 'The Doctrine of Mens Rea', 'Contract Law Fundamentals', 'Cyber Law and Ethics'],
  [Persona.STUDENT]: ['The Pythagorean Theorem', 'The Water Cycle', 'The French Revolution', 'Literary Devices'],
  [Persona.GENERAL]: ['How does the Stock Market work?', 'The Basics of Mindfulness', 'The History of the Internet', 'Introduction to Philosophy'],
};

export const SUPPORTED_LANGUAGES: string[] = [
    'English',
    'Spanish',
    'French',
    'German',
    'Mandarin Chinese',
    'Hindi',
    'Telugu',
];