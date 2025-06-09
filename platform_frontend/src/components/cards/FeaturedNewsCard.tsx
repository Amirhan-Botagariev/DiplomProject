// FeaturedNewsCard.tsx
import React from 'react';
import { Calendar, MessageSquare, Eye, Bookmark, ArrowRight } from 'lucide-react';

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

// Карточка избранной новости
interface FeaturedNewsCardProps {
  news: News;
}

const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({ news }) => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
      <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-5 md:w-3/5 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600">{news.category}</span>
          <button className="text-gray-400 hover:text-blue-500">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{news.title}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{news.content}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{news.date}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-xs text-gray-500">
              <Eye className="h-3 w-3 mr-1" />
              <span>{news.views}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{news.comments}</span>
            </div>
          </div>
        </div>
        
        <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
          Читать полностью
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

// Компонент списка избранных новостей
interface FeaturedNewsListProps {
  newsList: News[];
}

export const FeaturedNewsList: React.FC<FeaturedNewsListProps> = ({ newsList }) => {
  const featuredNews = newsList.filter((n) => n.featured);

  return (
    <div className="space-y-6">
      {featuredNews.map((news) => (
        <FeaturedNewsCard key={news.id} news={news} />
      ))}
    </div>
  );
};

export default FeaturedNewsCard;
