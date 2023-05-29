enum tableActions {
    GET_TABLES = "GetTables",
    CREATE_TABLE = "CreateTable",
    DELETE_TABLE = "DeleteTable",
    GET_SOUNDS = "GetSounds",
    POST_SOUND = "PostSound",
    PUT_SOUND = "PutSound",
    DELETE_SOUND = "DeleteSound",
    SET_TABLE_GETTER_ACTION = "SetTableGetterAction",
}

enum tableMutations{
    SET_TABLE_GETTER = "SetTableGetter"
}

export {
    tableActions,
    tableMutations
}