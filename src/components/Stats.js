import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, Sparkles } from 'lucide-react';
import { useContractRead } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';

const Stats = () => {
  // These would be real contract reads in production
  const stats = [
    {
      icon: Package,
      label: 'Total Cards',
      value: '10,000',
      change: '+12%',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Users,
      label: 'Active Collectors',
      value: '2,847',
      change: '+8%',
      color: 'from-blue-400 to-indigo-400'
    },
    {
      icon: Sparkles,
      label: 'Legendary Cards',
      value: '142',
      change: '+23%',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: TrendingUp,
      label: 'Trading Volume',
      value: '847 ETH',
      change: '+15%',
      color: 'from-green-400 to-emerald-400'
    }
  ];

  return (
    <section className="py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Stats;