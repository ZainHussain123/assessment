export const getRandomColor = () => {
    const colors = [
      'bg-red-100',
      'bg-green-100',
      'bg-blue-100',
      'bg-yellow-100',
      'bg-purple-100',
      'bg-pink-100',
      'bg-indigo-100',
      'bg-teal-100',
      'bg-orange-100',
      'bg-cyan-100',
    ];
  
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };