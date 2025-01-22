const mainPath = "/assets/";
let map = ["game_1.png", "game_2.png", "game_3.png"];

export const getRandomGamePhoto = () => {
    if (map.length === 0) {
        // Reset tablicy, jeśli wszystkie obrazki zostały użyte
        map = ["game_1.png", "game_2.png", "game_3.png"];
    }
    const randomIndex = Math.floor(Math.random() * map.length);
    const selectedImage = map.splice(randomIndex, 1)[0]; // Usuwamy wylosowany obrazek z tablicy
    return `${mainPath}${selectedImage}`;
};