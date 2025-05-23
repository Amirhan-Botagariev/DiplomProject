// NewsCard.tsx
import React from 'react';
import { Calendar, MessageSquare, Eye, Bookmark } from 'lucide-react';

// Интерфейс News
export interface News {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  views: number;
  comments: number;
  featured?: boolean;
}

// Компонент карточки новости
interface NewsCardProps {
  news: News;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-48 overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600">{news.category}</span>
          <button className="text-gray-400 hover:text-blue-500">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{news.title}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{news.content}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{news.date}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{news.views}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{news.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент для вывода списка новостей
interface NewsListProps {
  newsList: News[];
}

export const NewsList: React.FC<NewsListProps> = ({ newsList }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {newsList.map((newsItem) => (
        <NewsCard key={newsItem.id} news={newsItem} />
      ))}
    </div>
  );
};

export default NewsCard;
