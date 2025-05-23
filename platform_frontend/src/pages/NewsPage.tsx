import React, { useState } from 'react';
import { Search, Filter, Calendar, ChevronDown, Bookmark, MessageSquare, Eye } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import FeaturedNewsCard from '../components/FeaturedNewsCard';
import { News as NewsType } from '../types/news';

const newsData: NewsType[] = [
  {
    id: 1,
    title: 'Обновление политики удаленной работы',
    content: 'С 1 июня вступают в силу изменения в политике удаленной работы компании. Теперь сотрудники могут работать удаленно до 3 дней в неделю при согласовании с руководителем.',
    date: '25.05.2025',
    author: 'Ольга Иванова',
    category: 'Политики компании',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    views: 128,
    comments: 14,
    featured: true
  },
  {
    id: 2,
    title: 'Запуск новой программы обучения',
    content: 'Департамент обучения и развития анонсирует запуск новой программы профессионального развития для всех сотрудников. Регистрация открыта до 15 июня.',
    date: '20.05.2025',
    author: 'Сергей Новиков',
    category: 'Обучение',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    views: 96,
    comments: 8,
    featured: true
  },
  {
    id: 3,
    title: 'Результаты ежегодного опроса сотрудников',
    content: 'Подведены итоги ежегодного опроса удовлетворенности сотрудников. Уровень вовлеченности вырос на 7% по сравнению с прошлым годом.',
    date: '15.05.2025',
    author: 'Анна Семенова',
    category: 'Исследования',
    image: 'https://images.pexels.com/photos/7654586/pexels-photo-7654586.jpeg?auto=compress&cs=tinysrgb&w=800',
    views: 145,
    comments: 12,
    featured: false
  },
  {
    id: 4,
    title: 'Обновление системы оценки эффективности',
    content: 'HR-департамент представляет обновленную систему оценки эффективности, которая будет внедрена со следующего квартала.',
    date: '10.05.2025',
    author: 'Дмитрий Козлов',
    category: 'HR-процессы',
    image: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=800',
    views: 87,
    comments: 6,
    featured: false
  },
  {
    id: 5,
    title: 'Новые возможности корпоративного портала',
    content: 'На корпоративном портале появились новые функции для упрощения коммуникаций и совместной работы команд.',
    date: '05.05.2025',
    author: 'Игорь Соколов',
    category: 'IT-инфраструктура',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800',
    views: 112,
    comments: 9,
    featured: false
  },
  {
    id: 6,
    title: 'Запуск программы ментoрства',
    content: 'Стартует новая программа внутреннего менторства для развития карьеры и передачи опыта между сотрудниками.',
    date: '01.05.2025',
    author: 'Елена Морозова',
    category: 'Развитие персонала',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    views: 76,
    comments: 5,
    featured: false
  },
];

const categories = [
  'Все новости',
  'Политики компании',
  'Обучение',
  'Исследования',
  'HR-процессы',
  'IT-инфраструктура',
  'Развитие персонала',
  'Мероприятия'
];

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('Все новости');
  const [searchTerm, setSearchTerm] = useState('');

  const featuredNews = newsData.filter(news => news.featured);

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Все новости' || news.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Новости</h1>
      </div>

      <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск новостей"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-sm text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </button>

          <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-sm text-gray-700 hover:bg-gray-50">
            <Calendar className="h-4 w-4 mr-2" />
            Дата
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 whitespace-nowrap rounded-md text-sm font-medium ${
              activeCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
            {featuredNews.map((news) => (
              <FeaturedNewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      )}

      {/* Latest News */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Последние новости</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.filter(news => !news.featured).map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;