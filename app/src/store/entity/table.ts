import Sound from "./sound";

class Table {
    public scenes: Array<any>;
    public sounds: Array<Sound>;

    constructor(_scenes = [], _sounds = []){
        this.scenes =_scenes;
        this.sounds = _sounds;
    }
}

export default Table