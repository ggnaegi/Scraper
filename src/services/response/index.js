export const success = (res, status) => (entity) => {
    if (entity) {
        res.status(status || 200).json(entity);
    }
    return null;
};

export const successFullDeletion = (res) => (success) => {
    if (success) {
        res.status(200).json("Deleted Successfully");
        return null;
    }
    res.status(404).json("Not found!");
    return null;
};

export const notFound = (res) => (entity) => {
    if (entity) {
        return entity;
    }
    res.status(404).json("Not found!");
    return null;
};