import { type LucideIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  label?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  className?: string;
  iconClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

const SelectFilter = ({
  value,
  onValueChange,
  placeholder,
  icon: Icon,
  label,
  options,
  className,
  triggerClassName,
  disabled,
  iconClassName,
}: SelectFilterProps) => {
  const currentLabel =
    options.find((option) => option.value === value)?.label || placeholder;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium ">{label}</label>}
      <div className="flex items-center gap-3  rounded-md">
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger className={cn("w-full border-0", triggerClassName)}>
            <SelectValue placeholder={placeholder}>
              {Icon && <Icon className={cn(iconClassName)} />}
              {currentLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.length === 0 ? (
              <SelectItem value="none">No options found</SelectItem>
            ) : (
              options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SelectFilter;
