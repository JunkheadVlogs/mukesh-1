import { useEffect, useState } from 'react';

export function LiveTimestamp() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      
      const indianTime = new Intl.DateTimeFormat('en-IN', options).format(new Date());
      setTimeStr(`${indianTime} IST`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!timeStr) return null;

  return <span suppressHydrationWarning>Live Time: {timeStr}</span>;
}
