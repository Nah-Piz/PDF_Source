import {
  BookOpen,
  User,
  Download,
  TrendingUp,
} from "lucide-react";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      icon: BookOpen,
      label: "Total Books",
      value: stats.total,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: User,
      label: "Authors",
      value: stats.authors,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Total Views",
      value: stats.views,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Download,
      label: "Downloads",
      value: stats.downloads,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
