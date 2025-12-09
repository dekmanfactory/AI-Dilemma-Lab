import { Scenario } from '../types';

export const scenarios: Scenario[] = [
  {
    id: 's1',
    title: '자율주행차의 딜레마',
    category: 'AUTONOMOUS_VEHICLE',
    difficulty: 'BEGINNER',
    description: '당신은 자율주행차 AI 개발자입니다. 브레이크 고장 상황에서 차는 두 가지 경로 중 하나를 선택해야 합니다. 직진하면 횡단보도를 건너던 5명의 보행자를 치게 되고, 방향을 틀면 벽에 부딪혀 탑승자 1명이 사망합니다.',
    imageUrl: 'https://picsum.photos/seed/car_crash/800/400',
    learningPoints: ['공리주의 vs 의무론', '트롤리 딜레마의 이해', '알고리즘 설계의 책임'],
    choices: [
      {
        id: 'c1_1',
        text: '방향을 틀어 탑승자를 희생시킨다 (다수 구출)',
        perspective: 'UTILITARIANISM',
        consequenceSummary: '5명의 보행자는 무사하지만, 차량 탑승자가 사망했습니다. 다수의 행복을 위한 선택이었습니다.'
      },
      {
        id: 'c1_2',
        text: '직진하여 보행자를 희생시킨다 (탑승자 보호)',
        perspective: 'DEONTOLOGY',
        consequenceSummary: '탑승자는 무사하지만, 5명의 보행자가 희생되었습니다. 탑승자를 보호해야 한다는 의무를 우선시했습니다.'
      }
    ]
  },
  {
    id: 's2',
    title: '희귀병 치료제 분배',
    category: 'MEDICAL_AI',
    difficulty: 'INTERMEDIATE',
    description: '의료 AI가 단 하나 남은 희귀병 치료제를 누구에게 투여할지 결정해야 합니다. 환자 A는 앞으로 수많은 생명을 구할 천재 과학자이고, 환자 B는 7살 어린아이입니다.',
    imageUrl: 'https://picsum.photos/seed/medical_ai/800/400',
    learningPoints: ['생명의 가치 평가', '사회적 기여도 vs 생존권', 'AI의 공정성'],
    choices: [
      {
        id: 'c2_1',
        text: '천재 과학자에게 투여한다 (미래 가치 중시)',
        perspective: 'UTILITARIANISM',
        consequenceSummary: '과학자가 생존하여 암 치료제 개발을 계속합니다. 하지만 어린아이의 생존 기회는 박탈되었습니다.'
      },
      {
        id: 'c2_2',
        text: '어린아이에게 투여한다 (기회의 평등 중시)',
        perspective: 'JUSTICE',
        consequenceSummary: '아이가 건강을 되찾았습니다. 생명은 사회적 가치로 저울질할 수 없다는 원칙을 지켰습니다.'
      }
    ]
  },
  {
    id: 's3',
    title: '범죄 예측 시스템의 오류',
    category: 'JUDICIAL_AI',
    difficulty: 'ADVANCED',
    description: 'AI가 과거 데이터를 학습하여 범죄 가능성이 높은 지역을 순찰하도록 경찰을 배당합니다. 하지만 과거 데이터에는 특정 저소득층 지역에 대한 차별적 단속 기록이 포함되어 있습니다. 이 데이터를 그대로 사용할까요?',
    imageUrl: 'https://picsum.photos/seed/police_ai/800/400',
    learningPoints: ['데이터 편향성(Bias)', '알고리즘적 차별', '피드백 루프'],
    choices: [
      {
        id: 'c3_1',
        text: '데이터대로 효율성을 위해 배당한다',
        perspective: 'UTILITARIANISM',
        consequenceSummary: '단기적으로 범죄 검거율은 올랐으나, 특정 지역 주민들에 대한 과잉 단속과 차별 논란이 심화되었습니다.'
      },
      {
        id: 'c3_2',
        text: '데이터를 보정하여 지역별로 균등 배당한다',
        perspective: 'JUSTICE',
        consequenceSummary: '검거 효율은 다소 떨어졌으나, 지역 간 차별 논란을 줄이고 공정한 치안 서비스를 제공했습니다.'
      }
    ]
  }
];