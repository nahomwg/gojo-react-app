import React from 'react';
import { Home, Eye, TrendingUp, DollarSign } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { Property } from '../../types';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
  properties: Property[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ properties }) => {
  const totalProperties = properties.length;
  const activeProperties = properties.filter(p => p.is_active).length;
  const averagePrice = properties.length > 0 
    ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length)
    : 0;

  // Mock data for views - in a real app, this would come from analytics
  const totalViews = properties.reduce((sum, p) => sum + Math.floor(Math.random() * 100), 0);

  const stats = [
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: Home,
      color: 'blue' as const,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Active Listings',
      value: activeProperties,
      icon: TrendingUp,
      color: 'emerald' as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'purple' as const,
      trend: { value: 23, isPositive: true }
    },
    {
      title: 'Average Price',
      value: `ETB ${averagePrice.toLocaleString()}`,
      icon: DollarSign,
      color: 'orange' as const,
      trend: { value: 5, isPositive: false }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};