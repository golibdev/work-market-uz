exports.generateRandomNumber = (count = 5) => {
    return Math.floor(Math.random() * Math.pow(10, count));
}