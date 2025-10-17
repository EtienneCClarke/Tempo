import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useTickAudio } from './useTickAudio';

interface TempoConfig {
    ratio: string; // "3:1", "2:1", "4:1"
    totalDuration: number; // Total swing time in ms (default 1200ms)
    interval?: number; // Gap after impact before restarting cycle (default 1000ms)
    onRestart?: () => void; // Callback when a new cycle starts,
}

export const useGolfTempo = ({ ratio = '3:1', totalDuration = 1200, interval = 1000, onRestart }: TempoConfig) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const { playTakeoffSoundAsync, playTopSoundAsync, playImpactSoundAsync, stopAllSounds } = useTickAudio();

    // Timing refs
    const frameId = useRef<number | null>(null);
    const startTime = useRef<number>(0);

    const hasPlayedTakeoff = useRef<boolean>(false);
    const hasPlayedTop = useRef<boolean>(false);
    const hasPlayedImpact = useRef<boolean>(false);

    const schedule = useMemo(() => {
        const [r1, r2] = ratio.split(':');
        return {
            takeoff: 0,
            top: Math.floor(totalDuration * (parseFloat(r1) / (parseFloat(r1) + parseFloat(r2)))),
            impact: totalDuration
        };
    }, [ratio, totalDuration]);

    const backswingDuration = useMemo(() => {
        return schedule.top;
    }, [schedule]);

    const downswingDuration = useMemo(() => {
        return totalDuration - schedule.top;
    }, [schedule])

    const handleRestart = useCallback((timestamp: number) => {
        startTime.current = timestamp;
        hasPlayedTakeoff.current = false;
        hasPlayedTop.current = false;
        hasPlayedImpact.current = false;
        onRestart?.();
    }, [onRestart]);

    // Main loop
    const tick = async (timestamp: number) => {

        // Calculate elapsed ms since the user pressed start
        const elapsed = startTime.current ? (timestamp - startTime.current) : 0;

        // Reset after totalDuration + postImpactGap
        if (elapsed >= (totalDuration + interval)) {
            handleRestart(timestamp);
        }

        if (elapsed >= schedule.takeoff && !hasPlayedTakeoff.current) {
            hasPlayedTakeoff.current = true;
            playTakeoffSoundAsync();
        } else if (elapsed >= schedule.top && !hasPlayedTop.current) {
            hasPlayedTop.current = true;
            playTopSoundAsync();
        } else if (elapsed >= schedule.impact && !hasPlayedImpact.current) {
            hasPlayedImpact.current = true;
            playImpactSoundAsync();
        }

        // Schedule next frame only if still playing
        if (isPlaying) {
            frameId.current = requestAnimationFrame(tick);
        }
    };

    // Start/Stop controls
    const start = useCallback(() => {
        // Use high-resolution clock consistent with rAF timestamps
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            startTime.current = performance.now();
        } else {
            // fallback to Date.now() in ms
            startTime.current = Date.now();
        }
        setIsPlaying(true);
    }, [schedule]);

    const stop = useCallback(() => {
        setIsPlaying(false);
        // Reset timing so restarting starts fresh
        startTime.current = 0;
        hasPlayedTakeoff.current = false;
        hasPlayedTop.current = false;
        hasPlayedImpact.current = false;
        if (frameId.current) {
            cancelAnimationFrame(frameId.current);
            frameId.current = null;
        }
        // Ensure any playing audio is stopped
        try {
            stopAllSounds();
        } catch (e) {
            // ignore
        }
    }, [stopAllSounds]);

    // Manage animation frame lifecycle
    useEffect(() => {
        if (isPlaying) {
            frameId.current = requestAnimationFrame(tick);
        }
        return () => {
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
        };
    }, [isPlaying, tick]);

    // Pause/stop playback when app goes to background or becomes inactive
    useEffect(() => {
        const handleAppStateChange = (nextState: AppStateStatus) => {
            if (nextState.match(/inactive|background/)) {
                // stop playback to avoid audio resuming when app is foregrounded
                stop();
            }
        };

        const sub = AppState.addEventListener('change', handleAppStateChange);
        return () => sub.remove();
    }, [stop]);

    return {
        start,
        stop,
        isPlaying,
        backswingDuration,
        downswingDuration
    };
};