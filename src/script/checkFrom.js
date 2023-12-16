export const checkNumber = (rule, value, callback) => {
    if (!value) { return callback(new Error('该选项禁止为空')); }
    if (typeof value !== 'number') { return callback(new Error('该选项必须为数字')); }
    else { return callback() }
}

export const checkString = (rule, value, callback) => {
    if (value == '') { return callback(new Error('该选项禁止为空')); }
    else { return callback() }
}