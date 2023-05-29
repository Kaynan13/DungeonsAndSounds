import Sound from "./sound";
import status from "../enums/statusEnum"

class AudioType {
    public id: string;
    public audio: HTMLAudioElement | null;
    public volume: number;
    public rawContent: Sound;
    public status: number;
    public progress: number;
    public interval?: any;
    public fromScene: boolean;
    public _sceneName?: string;
    public loaded: boolean;


    constructor(_id: string = '', _audio: HTMLAudioElement | null = null, _volume: number = 50, _rawContent: Sound = new Sound(), _status: number = status.notStarted) {
        this.id = _id;
        this.audio = _audio;
        this.volume = _volume;
        this.rawContent = _rawContent;
        this.status = _status;
        this.progress = 0;
        this.fromScene = false;
        this.loaded = false;
    }
    
}

export default AudioType