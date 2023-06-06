import Scene from "../entity/scene";
import Sound from "../entity/sound";
import Table from "../entity/table";

export interface createTable{
    fileName: string | null;
    data: string | null;
}

export interface postSound{
    table: string;
    sound: Sound
}

export interface putSound{
    table: string;
    sound: Sound
}

export interface deleteSound{
    table: string;
    soundId: number
}

export interface postScene{
    table: string;
    sound: Scene
}

export interface putScene{
    table: string;
    sound: Scene;
}

export interface deleteScene{
    table: string;
    soundId: number;
}

export interface postGroup{
    table: string;
    group: any;
}

export interface putGroup{
    table: string;
    group: any;
}

export interface postGroupRange{
    table: string;
    groups: Array<any>;
}