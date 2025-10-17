import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions, View } from "react-native";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "./reusables/dropdown-menu";
import { Text } from "./reusables/text";
import { LucideCheck } from "lucide-react-native";
import { IconGolfer } from "./icons/golfer";
import { Button } from "./reusables/button";

const TEMPOS = [
    { label: 'Long - 3:1', value: '3:1' },
    { label: 'Short - 2:1', value: '2:1' },
    { label: 'Custom - 4:1', value: '4:1' },
    { label: 'Custom - 5:2', value: '5:2' }
]

interface SelectTempoProps {
    onSelect: (value: string) => void;
    value: string;
    disabled?: boolean;
}

const SelectTempo = ({ onSelect, value, disabled = false }: SelectTempoProps) => {

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
                        <IconGolfer width={40} height={40} color={'white'} />
                    </View>
                    <View className="flex flex-col flex-1">
                        <Text className="text-xs text-muted-foreground">Game</Text>
                        <Text>{TEMPOS.find(t => t.value === value)?.label}</Text>
                    </View>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                insets={contentInsets}
                side='top'
                sideOffset={4}
                className="rounded-md"
                style={{
                    width: ((Dimensions.get('window').width - 64) / 2) - 8
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

export { SelectTempo };