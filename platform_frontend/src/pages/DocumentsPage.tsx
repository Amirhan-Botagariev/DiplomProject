import React, { useState } from 'react';
import { Search, Filter, FileText, Download, Calendar, ChevronDown, Plus, MoreHorizontal } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import { Document } from '../types/document';

const documentsData: Document[] = [
  {
    id: 1,
    title: 'Политика удаленной работы',
    category: 'Политики',
    date: '10.05.2025',
    size: '256 КБ',
    type: 'PDF',
    author: 'Анна Смирнова'
  },
  {
    id: 2,
    title: 'Правила внутреннего трудового распорядка',
    category: 'Нормативные документы',
    date: '03.04.2025',
    size: '428 КБ',
    type: 'DOCX',
    author: 'Иван Петров'
  },
  {
    id: 3,
    title: 'Коллективный договор',
    category: 'Договоры',
    date: '15.03.2025',
    size: '1.2 МБ',
    type: 'PDF',
    author: 'Юридический отдел'
  },
  {
    id: 4,
    title: 'Положение об оплате труда',
    category: 'Положения',
    date: '28.02.2025',
    size: '384 КБ',
    type: 'PDF',
    author: 'Отдел компенсаций и льгот'
  },
  {
    id: 5,
    title: 'Шаблон трудового договора',
    category: 'Шаблоны',
    date: '12.01.2025',
    size: '156 КБ',
    type: 'DOCX',
    author: 'Юридический отдел'
  },
  {
    id: 6,
    title: 'Положение о премировании',
    category: 'Положения',
    date: '05.01.2025',
    size: '298 КБ',
    type: 'PDF',
    author: 'Отдел компенсаций и льгот'
  },
];

const categories = [
  'Все документы',
  'Политики',
  'Нормативные документы',
  'Договоры',
  'Положения',
  'Шаблоны',
  'Инструкции',
  'Приказы'
];

const Documents = () => {
  const [activeCategory, setActiveCategory] = useState('Все документы');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documentsData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Все документы' || doc.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Документы</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Добавить документ
        </button>
      </div>

      <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск документов"
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

      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Недавние документы</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.slice(0, 3).map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Все документы</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Размер
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Автор
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{document.title}</div>
                        <div className="text-sm text-gray-500">{document.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {document.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-900">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;