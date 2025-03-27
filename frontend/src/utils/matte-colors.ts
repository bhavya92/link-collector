export const color_array = [
    "#007791", //Duck Blue
    "#09443c", //Forest Matte
    "#277e71", //Sea Green Matte
    "#9e93a7", //Grape Matte
    "#a1cfd0", //Aqua Green Matte
    "#c3e5de", //Retro Blue Matte
    "#c7b669", //Sand Matte
    "#efa514", //Sunflower Matte
    "#d8c6a8", //Almond Butter
    "#befcd4", //Mint Patina
    "#ab7e4c", //Tan Brown
    "#d5ebdd", //Duck Egg
    "#eaeed7", //Alligator Egg
    "#00A86B", //Jade
    "#808080", // Matte Gray
    "#36454F", // Matte Charcoal
    "#2C3E50", // Matte Navy Blue
    "#2E8B57", // Matte Forest Green
    "#556B2F", // Matte Olive Green
    "#800020", // Matte Burgundy
    "#5D3A3A", // Matte Maroon
    "#3D2B1F", // Matte Chocolate Brown
    "#C2B280", // Matte Sand Beige
    "#C4A000", // Matte Mustard Yellow
    "#B87333", // Matte Copper
    "#E2725B", // Matte Terracotta
    "#A52A2A", // Matte Brick Red
    "#008080", // Matte Teal
    "#4B0082", // Matte Deep Purple
    "#E6A1A1", // Matte Pastel Pink
    "#87CEEB", // Matte Sky Blue
    "#967BB6"  // Matte Lavender
]

export const getColor = () => {
    return color_array[Math.floor(Math.random() * color_array.length)];
}