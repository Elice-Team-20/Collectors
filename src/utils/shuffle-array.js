function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export { shuffle };
