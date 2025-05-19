// Все переводы и мапы для отображения значений на русском

export const genderMap: Record<string, string> = {
  Male: 'Мужской',
  Female: 'Женский',
};

export const maritalStatusMap: Record<string, string> = {
  Single: 'Не женат/Не замужем',
  Married: 'Женат/Замужем',
  Divorced: 'Разведён',
};

export const educationLevelMap: Record<number, string> = {
  1: 'Ниже колледжа',
  2: 'Колледж',
  3: 'Бакалавр',
  4: 'Магистр',
  5: 'Доктор',
};

export const educationFieldMap: Record<string, string> = {
  'Life Sciences': 'Естественные науки',
  'Medical': 'Медицина',
  'Marketing': 'Маркетинг',
  'Technical Degree': 'Техническая специальность',
  'Human Resources': 'Кадры',
  'Other': 'Другое',
};

export const departmentMap: Record<string, string> = {
  'Research & Development': 'Исследования и разработки',
  'Sales': 'Продажи',
  'Human Resources': 'Кадры',
};

export const performanceRatingMap: Record<number, string> = {
  1: 'Низкая',
  2: 'Хорошо',
  3: 'Отлично',
  4: 'Выдающаяся',
};

export const jobRoleMap: Record<string, string> = {
  'Sales Executive': 'Менеджер по продажам',
  'Research Scientist': 'Научный сотрудник',
  'Laboratory Technician': 'Лаборант',
  'Manufacturing Director': 'Директор по производству',
  'Healthcare Representative': 'Медицинский представитель',
  'Manager': 'Менеджер',
  'Sales Representative': 'Торговый представитель',
  'Research Director': 'Директор по исследованиям',
  'Human Resources': 'Кадры',
  // Добавьте другие должности по мере необходимости
};

export function getMaritalStatusRu(status: string, gender: string): string {
  // gender: 'Male', 'Female', либо undefined
  if (status === 'Single') {
    if (gender === 'Female') return 'Не замужем';
    if (gender === 'Male') return 'Не женат';
    return 'Не женат/Не замужем';
  }
  if (status === 'Married') {
    if (gender === 'Female') return 'Замужем';
    if (gender === 'Male') return 'Женат';
    return 'Женат/Замужем';
  }
  if (status === 'Divorced') {
    if (gender === 'Female') return 'Разведена';
    if (gender === 'Male') return 'Разведён';
    return 'Разведён/Разведена';
  }
  return status;
}
