import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions, View } from "react-native";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "./reusables/dropdown-menu";
import { Text } from "./reusables/text";
import { LucideCheck, LucideTimer } from "lucide-react-native";
import { IconGolfer } from "./icons/golfer";
import { Button } from "./reusables/button";

const TEMPOS = [
    { label: '1s', value: 1000 },
    { label: '3s', value: 3000 },
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 }
]

interface SelectIntervalProps {
    onSelect: (value: number) => void;
    value: number;
    disabled?: boolean;
}

const SelectInterval = ({ onSelect, value, disabled = false }: SelectIntervalProps) => {

    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
    };

    return (
        <DropdownMenu style={{ width: ((Dimensions.get('window').width - 64) / 2) - 8 }}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className="flex flex-row h-fit rounded-md rounded-full px-2"
                    style={{ padding: 4 }}
                    disabled={disabled}
                >
                    <View className="bg-green-500 w-[50px] aspect-square flex items-center justify-center rounded-full">
                        <LucideTimer width={30} height={30} color={'white'} />
                    </View>
                    <View className="flex flex-col flex-1">
                        <Text className="text-xs text-muted-foreground">Interval</Text>
                        <Text>{TEMPOS.find(t => t.value === value)?.label}</Text>
                    </View>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                insets={contentInsets}
                side='top'
                sideOffset={4}
                style={{
                    width: ((Dimensions.get('window').width - 64) / 2) - 8,
                    borderRadius: 16
                }}
            >
                {TEMPOS.map((t: typeof TEMPOS[0], index: number) =>
                    <DropdownMenuItem
                        onTouchEnd={() => onSelect(t.value)}
                        key={index}
                    >
                        <Text>{t.label}</Text>
                        {value === t.value &&
                            <DropdownMenuShortcut>
                                <LucideCheck size={16} />
                            </DropdownMenuShortcut>
                        }
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { SelectInterval };