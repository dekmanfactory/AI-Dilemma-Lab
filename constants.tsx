import React from 'react';
import { 
  BrainCircuit, 
  Scale, 
  Users, 
  ShieldAlert, 
  Gavel, 
  Stethoscope,
  Car,
  Trophy,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const ICONS = {
  Brain: <BrainCircuit size={24} />,
  Scale: <Scale size={24} />,
  Users: <Users size={24} />,
  Alert: <ShieldAlert size={24} />,
  Gavel: <Gavel size={24} />,
  Medical: <Stethoscope size={24} />,
  Car: <Car size={24} />,
  Trophy: <Trophy size={24} />,
  Book: <BookOpen size={24} />,
  ArrowRight: <ArrowRight size={24} />
};

export const PERSPECTIVE_LABELS: Record<string, string> = {
  'UTILITARIANISM': '공리주의',
  'DEONTOLOGY': '의무론',
  'VIRTUE_ETHICS': '덕 윤리',
  'JUSTICE': '정의론',
  'CARE_ETHICS': '배려 윤리'
};

export const LEVEL_TITLES = [
  'AI 윤리 입문자',
  '딜레마 탐험가',
  '공정성 수호자',
  '윤리 마스터'
];