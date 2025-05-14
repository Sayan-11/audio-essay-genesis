
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type LengthOption = {
  value: string;
  label: string;
  minMinutes: number;
  maxMinutes: number | null;
};

const LENGTH_OPTIONS: LengthOption[] = [
  { value: "short", label: "<5 mins", minMinutes: 1, maxMinutes: 5 },
  { value: "medium", label: "5-10 mins", minMinutes: 5, maxMinutes: 10 },
  { value: "long", label: "10-20 mins", minMinutes: 10, maxMinutes: 20 },
  { value: "extra-long", label: ">20 mins", minMinutes: 20, maxMinutes: null },
];

interface LengthSelectorProps {
  value: string;
  onValueChange: (value: string, minutes: number) => void;
}

const LengthSelector = ({ value, onValueChange }: LengthSelectorProps) => {
  // Calculate minutes based on the selected option
  const handleValueChange = (newValue: string) => {
    const option = LENGTH_OPTIONS.find((opt) => opt.value === newValue);
    if (option) {
      // Use the middle value of the range for the slider
      const minutes = option.maxMinutes 
        ? Math.floor((option.minMinutes + option.maxMinutes) / 2)
        : Math.max(option.minMinutes, 25); // For >20 mins, default to 25
      
      onValueChange(newValue, minutes);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Audio Length
      </label>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={handleValueChange}
        className="flex flex-wrap justify-between gap-2"
      >
        {LENGTH_OPTIONS.map((option) => (
          <ToggleGroupItem 
            key={option.value} 
            value={option.value}
            className="length-chip flex-1 min-w-[80px]"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default LengthSelector;
