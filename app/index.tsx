import { View } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import Slider from '@react-native-community/slider';
import { useGolfTempo } from '../hooks/useGolfTempo';
import { useState, useEffect, Fragment } from 'react';
import { Stack } from 'expo-router';
import { SelectTempo } from '@/components/select-tempo';
import { SelectInterval } from '@/components/select-interval';
import { Text } from '@/components/reusables/text';
import { Button } from '@/components/reusables/button';
import { cn } from '@/lib/utils';

export default function Page() {

	const [ratio, changeRatio] = useState<string>('3:1');
	const [duration, setDuration] = useState<number>(1.2); // in seconds
	const [interval, setInterval] = useState<number>(3000) // Default 1000ms

	const {
		start,
		stop,
		isPlaying,
		backswingDuration,
		downswingDuration
	} = useGolfTempo({
		ratio,
		totalDuration: duration * 1000, // convert to ms,
		interval
	});

	// Wrap start/stop to also control keep-awake behavior
	const handleStart = (): void => {
		activateKeepAwakeAsync();
		start();
	};

	const handleStop = (): void => {
		stop();
		deactivateKeepAwake();
	};

	// Ensure keep-awake is disabled if this component unmounts
	useEffect(() => {
		return () => { deactivateKeepAwake(); }
	}, []);

	const handleDurationChange = (value: number) => {
		setDuration(parseFloat(value.toFixed(1)));
	}

	return (
		<Fragment>
			<Stack.Screen options={{ headerShown: false }} />
			<View className='flex-1 justify-center px-8' style={{ backgroundImage: '@/assets/images/background.jpg', backgroundSize: 'cover' }}>
				<View
					className='flex flex-row justify-between'
					style={{
						marginBottom: 40,
						backgroundColor: 'rgba(0, 0, 0, 0.05)',
						borderRadius: 16,
						paddingVertical: 16
					}}>
					<View className='flex flex-col gap-2 w-[47.5%] items-center'>
						<Text className='text-muted-foreground'>Backswing</Text>
						<Text variant='h2' className=''>{backswingDuration / 1000}s</Text>
					</View>
					<View className='flex flex-col gap-2 w-[47.5%] items-center '>
						<Text className='text-muted-foreground'>Downswing</Text>
						<Text variant='h2' className=''>{downswingDuration / 1000}s</Text>
					</View>
				</View>
				<View className='flex flex-row justify-between'>
					<SelectTempo onSelect={changeRatio} value={ratio} disabled={isPlaying} />
					<SelectInterval onSelect={setInterval} value={interval} disabled={isPlaying} />
				</View>
				<View style={{ marginVertical: 40 }}>
					<Text variant='h2' className='text-center pb-2'>Duration: {duration}s</Text>
					<Slider
						disabled={isPlaying}
						style={{
							width: '100%',
							height: 40,
						}}
						minimumValue={0}
						maximumValue={5}
						value={duration}
						onValueChange={handleDurationChange}
						step={0.1}
						minimumTrackTintColor="#007AFF"
						maximumTrackTintColor="#E0E0E0"
					/>
					<View className='flex flex-row justify-between'>
						<Text className='text-foreground/50'>0</Text>
						<Text className='text-foreground/50'>5 seconds</Text>
					</View>
				</View>
				<Button
					variant={!isPlaying ? 'outline' : 'destructive'}
					className={cn("rounded-full", !isPlaying && "bg-green-500")}
					onPress={!isPlaying ? handleStart : handleStop}
				>
					<Text className='text-white'>
						{isPlaying ? 'STOP' : 'START'}
					</Text>
				</Button>
			</View>
		</Fragment>
	);
}