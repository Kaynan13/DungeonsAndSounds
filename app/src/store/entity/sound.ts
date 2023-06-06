class Sound {
    [index: string]: any;
    
    public id: number | null;
    public name: string;
    public soundUrl: string;
    public imageUrl: string;
    public group: string;    
    public _videoId?: string;


    constructor(_id = null, _name = '', _soundUrl = '', _imageUrl = '', _group = '', _groupColor = ''){
        this.id = _id;
        this.name = _name;
        this.soundUrl = _soundUrl;
        this.imageUrl = _imageUrl;
        this.group = _group;
        this.groupColor = _groupColor;
    }
}

export default Sound