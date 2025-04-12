import { Button } from "@/components/ui/button";
import { FC, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

type Props = {
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  dates: string[];
};

const ProgramDateNavigator: FC<Props> = ({
  dates,
  selectedDate,
  setSelectedDate,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll to selected date when it changes
  useEffect(() => {
    if (selectedButtonRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = selectedButtonRef.current;

      // Calculate position to center the button
      const buttonCenter = button.offsetLeft + button.offsetWidth / 2;
      const containerCenter = container.clientWidth / 2;
      const scrollLeft = buttonCenter - containerCenter;

      // Smooth scroll to the position
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth"
      });
    }
  }, [selectedDate]);

  // Navigate to previous date
  const goToPrevious = () => {
    if (!selectedDate || dates.length === 0) return;
    const currentIndex = dates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(dates[currentIndex - 1]);
    }
  };

  // Navigate to next date
  const goToNext = () => {
    if (!selectedDate || dates.length === 0) return;
    const currentIndex = dates.indexOf(selectedDate);
    if (currentIndex < dates.length - 1) {
      setSelectedDate(dates[currentIndex + 1]);
    }
  };

  // Function to extract day, month, and weekday from date string
  const extractDateParts = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`);
    const day = date.getDate();
    const month = date.toLocaleString('es', { month: 'short' });
    const weekday = date.toLocaleString('es', { weekday: 'short' });
    return { day, month, weekday };
  };

  // Calculate if prev/next buttons should be disabled
  const isPrevDisabled = !selectedDate || dates.indexOf(selectedDate) === 0;
  const isNextDisabled = !selectedDate || dates.indexOf(selectedDate) === dates.length - 1;

  return (
    <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-gray-700">
          <Calendar size={16} className="mr-1.5 text-primary" />
          <h3 className="font-medium text-sm">Seleccione una fecha</h3>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            disabled={isPrevDisabled}
            className="h-7 w-7 text-gray-700 p-0"
          >
            <ChevronLeft size={16} className={isPrevDisabled ? "text-gray-300" : ""} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={isNextDisabled}
            className="h-7 w-7 text-gray-700 p-0"
          >
            <ChevronRight size={16} className={isNextDisabled ? "text-gray-300" : ""} />
          </Button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="relative"
      >
        {/* Gradient overlay for scrollable indication */}
        <div
          className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"
          style={{ display: dates.length > 5 ? 'block' : 'none' }}
        />
        <div
          className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"
          style={{ display: dates.length > 5 ? 'block' : 'none' }}
        />

        {/* Scrollable container with improved scrolling */}
        <div
          className="flex gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2 px-1"
          style={{
            scrollbarWidth: 'thin',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
            scrollSnapType: 'x mandatory', // Snap scrolling
          }}
        >
          {dates.map((date) => {
            const { day, month, weekday } = extractDateParts(date);
            const isSelected = selectedDate === date;
            return (
              <div
                key={date}
                className="scroll-snap-align-center flex-shrink-0"
              >
                <Button
                  ref={isSelected ? selectedButtonRef : null}
                  onClick={() => setSelectedDate(date)}
                  variant={isSelected ? "default" : "outline"}
                  className={`
                    min-w-[80px] max-w-[100px] gap-1 h-auto py-1.5 px-1 flex flex-col items-center transition-all duration-200
                    ${isSelected
                      ? "bg-primary text-white shadow-sm border-primary"
                      : "hover:bg-gray-50 border-gray-200 text-gray-700"
                    }
                  `}
                >
                  <span className="text-xs font-medium capitalize">{weekday}</span>
                  <span className="text-lg font-bold leading-tight">{day}</span>
                  <span className="text-xs font-medium capitalize">{month}</span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgramDateNavigator;