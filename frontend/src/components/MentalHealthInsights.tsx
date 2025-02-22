import React from 'react';
import { Brain, Moon, TrendingUp, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import PostTweet from './X';

export interface MentalHealthData {
  data: any;
  DREAM_PATTERNS: string;
  EMOTIONAL_STATE: string;
  SLEEP_QUALITY: string;
  MOOD_ANALYSIS: string;
  Weekly_Summary: string;
}

export default function MentalHealthInsights({ data }: { data: MentalHealthData }) {
  console.log(data.data.DREAM_PATTERNS);
  return (
    <><motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 pt-32"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-5xl font-bold mb-16 text-white uppercase glitch-effect"
      >
        Mental Health Insights
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {[
          {
            icon: Moon,
            title: "DREAM PATTERNS",
            content: data.data.DREAM_PATTERNS === "null" ? "No Data Available" : data.data.DREAM_PATTERNS
          },
          {
            icon: Brain,
            title: "EMOTIONAL STATE",
            content: data.data.EMOTIONAL_STATE === "null" ? "No Data Available" : data.data.EMOTIONAL_STATE
          },
          {
            icon: Clock,
            title: "SLEEP QUALITY",
            content: data.data.SLEEP_QUALITY=== "null" ? "No Data Available" : data.data.SLEEP_QUALITY
          },
          {
            icon: Heart,
            title: "MOOD ANALYSIS",
            content: data.data.MOOD_ANALYSIS=== "null" ? "No Data Available" : data.data.MOOD_ANALYSIS
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02, x: index % 2 === 0 ? 10 : -10 }}
            className="bg-black border-2 border-white p-8 hover:bg-white hover:text-black transition-all group"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 border-2 border-white group-hover:border-black">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">{item.title}</h2>
            </div>
            <p className="font-mono leading-relaxed">{item.content}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 bg-black border-2 border-white p-8 hover:bg-white hover:text-black transition-all group"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 border-2 border-white group-hover:border-black">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold uppercase">Weekly Summary</h2>
        </div>
        <p className="font-mono leading-relaxed">
          {data.data.Weekly_Summary}
        </p>
      </motion.div>
    </motion.div><PostTweet /></>
  );
}