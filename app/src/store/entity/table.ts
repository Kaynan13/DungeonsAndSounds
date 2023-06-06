import Sound from "./sound";

class Table {
    public scenes: Array<any>;
    public sounds: Array<Sound>;
    public groups: Array<any>;

    constructor(_scenes = [], _sounds = [], _groups = []){
        this.scenes =_scenes;
        this.sounds = _sounds;
        this.groups = _groups;
    }
}

export default Table