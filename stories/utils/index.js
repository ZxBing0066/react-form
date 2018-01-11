export const getStoryFilename = path => {
    const r = /^(?:.*\/)?(.*)\/(.*)\.story\.jsx$/.exec(path);
    return r === null ? null : [r[1], r[2]];
};
