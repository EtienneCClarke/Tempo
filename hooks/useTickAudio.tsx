import { AudioPlayer, useAudioPlayer } from "expo-audio";

interface TickAudio {
    takeoffSound: AudioPlayer;
    topSound: AudioPlayer;
    impactSound: AudioPlayer;
    playTakeoffSoundAsync: Function;
    playTopSoundAsync: Function;
    playImpactSoundAsync: Function;
    stopAllSounds: Function;
}

const useTickAudio = (): TickAudio => {

    const takeoffSound = useAudioPlayer(require('../assets/audio/ding_low.m4a'));
    const topSound = useAudioPlayer(require('../assets/audio/ding_medium.m4a'));
    const impactSound = useAudioPlayer(require('../assets/audio/ding_high.m4a'));

    const playTakeoffSoundAsync = async () => {
        takeoffSound.seekTo(0);
        takeoffSound.play();
    };

    const playTopSoundAsync = async () => {
        topSound.seekTo(0);
        topSound.play();
    };

    const playImpactSoundAsync = async () => {
        impactSound.seekTo(0);
        impactSound.play();
    };

    const stopAllSounds = () => {
        try {
            // stop() or pause() depending on player implementation
            (takeoffSound as any)?.stop?.();
            takeoffSound.seekTo(0);
        } catch (e) {
            // ignore
        }
        try {
            (topSound as any)?.stop?.();
            topSound.seekTo(0);
        } catch (e) {
            // ignore
        }
        try {
            (impactSound as any)?.stop?.();
            impactSound.seekTo(0);
        } catch (e) {
            // ignore
        }
    };

    return {
        takeoffSound,
        topSound,
        impactSound,
        playTakeoffSoundAsync,
        playTopSoundAsync,
        playImpactSoundAsync,
        stopAllSounds
    };

};

export { useTickAudio };