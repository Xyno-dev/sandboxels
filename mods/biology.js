viewInfo[4] = { // Nutrition View
    name: "nutr",
    pixel: function(pixel,ctx) {
        if (elements[pixel.element].isBio === true) {
        var nutrition = pixel.nutrition;
        if (nutrition < 0) {nutrition = 0}
        if (nutrition > 6000) {nutrition = 6000}
        // logarithmic scale, with coldest being 225 (-50 degrees) and hottest being 0 (6000 degrees)
        var hue = Math.round(225 - (Math.log(nutrition)/Math.log(6000))*225);
        if (hue < 0) {hue = 0}
        if (hue > 225) {hue = 225}
        drawSquare(ctx,"hsl("+hue+",100%,50%)",pixel.x,pixel.y)
        }
    }
}

viewInfo[5] = { // Oxy View
    name: "oxy",
    pixel: function(pixel,ctx) {
        if (elements[pixel.element].isBio === true) {
        var oxygen = pixel.oxygen;
        if (oxygen < 0) {oxygen = 0}
        if (oxygen > 6000) {oxygen = 6000}
        var hue = Math.round(225 - (Math.log(oxygen)/Math.log(6000))*225);
        if (hue < 0) {hue = 0}
        if (hue > 225) {hue = 225}
        drawSquare(ctx,"hsl("+hue+",100%,50%)",pixel.x,pixel.y)
        }
    }
}

elements.epidermis = {
	color: "#f7ead0",
	category: "biology",
    behavior: behaviors.WALL,
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if ((pixel.temp > 35 || pixel.temp < 10) && Math.random() < 0.005) {
            for (var i = 0; i < adjacentCoords.length; i++) {
                var coords = adjacentCoords[i];
                var x = pixel.x + coords[0];
                var y = pixel.y + coords[1];
                if (isEmpty(x,y)) {
                    if (pixel.temp > 35) {
                        pixel.temp -= 20;
                        createPixel("salt_water",x,y);
                        break;
                    }
                    pixel.temp += 20;
                    break;
                }
            }
        }
        if (pixel.temp < 15 && Math.random() < 0.1) {
            pixel.temp += 1;
        }
        doDefaults(pixel);
        if (Math.random() > 0.92 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            if (Math.random() < 0.75) {
                changePixel(pixel,"dust"); 
            }
            else {
                changePixel(pixel,"rotten_meat"); 
            }
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","meat","rotten_meat","cooked_meat","flesh"], chance:0.2 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.dermis = {
	color: "#CFA08B",
	category: "biology",
    behavior: behaviors.WALL,
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (pixel.temp !== 25 && Math.random() < 0.005) {
            for (var i = 0; i < adjacentCoords.length; i++) {
                var coords = adjacentCoords[i];
                var x = pixel.x + coords[0];
                var y = pixel.y + coords[1];
                if (isEmpty(x,y)) {
                    createPixel("epidermis",x,y);
                }
            }
        }
        doDefaults(pixel);
        if (Math.random() > 0.92 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat"); 
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","meat","rotten_meat","cooked_meat","flesh"], chance:0.2 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.scales = {
	color: "#6b839a",
	category: "biology",
    behavior: behaviors.WALL,
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (pixel.temp > 40 && Math.random() < 0.1) {
            pixel.temp -= 1;
        }
        doDefaults(pixel);
        if (Math.random() > 0.92 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            if (Math.random() < 0.1) {
                changePixel(pixel,"calcium"); 
            }
            else {
                changePixel(pixel,"dust"); 
            }
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 210,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.000075 },
        "radiation": { elem1:["calcium","calcium","ash","meat","rotten_meat","cooked_meat","skin","epidermis"], chance:0.1 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.scale_dermis = {
	color: "#CFA08B",
	category: "biology",
    behavior: behaviors.WALL,
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (pixel.temp !== 25 && Math.random() < 0.005) {
            for (var i = 0; i < adjacentCoords.length; i++) {
                var coords = adjacentCoords[i];
                var x = pixel.x + coords[0];
                var y = pixel.y + coords[1];
                if (isEmpty(x,y)) {
                    createPixel("scales",x,y);
                }
            }
        }
        doDefaults(pixel);
        if (Math.random() > 0.92 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat"); 
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","meat","rotten_meat","cooked_meat","flesh"], chance:0.2 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.flesh = {
	color: ["#9e4839","#ba6449"],
	category: "biology",
    behavior: behaviors.WALL,
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.92 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
	reactions: {
        "cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","blood","fat","meat","rotten_meat","cooked_meat"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.eye = {
	color: "#451800",
	category: "biology",
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        doHeat(pixel);
		doBurning(pixel);
		doElectricity(pixel);
        if (Math.random() > 0.895 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            doElectricity(hitPixel);
            if (elements[hitPixel.element].id === elements.light.id && Math.random() > 0.5) {
                pixel.saw = true
            }
            else if (pixel.saw === true && elements[hitPixel.element].id === elements.eye.id && Math.random() > (1 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                pixel.saw = false
                hitPixel.saw = true
            }
            else if (pixel.saw === true && elements[hitPixel.element].id === elements.eye_nerve.id && Math.random() > (1 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                if (!hitPixel.charge) {
                    hitPixel.charge = 0.1
                }
                else if (hitPixel.charge) {
                    hitPixel.charge += 0.1
                }
                pixel.saw = false
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            doElectricity(hitPixel);
            if (elements[hitPixel.element].id === elements.light.id && Math.random() > 0.5) {
                pixel.saw = true
            }
            else if (pixel.saw === true && elements[hitPixel.element].id === elements.eye.id && Math.random() > (1 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                pixel.saw = false
                hitPixel.saw = true
            }
            else if (pixel.saw === true && elements[hitPixel.element].id === elements.eye_nerve.id && Math.random() > (1 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                if (!hitPixel.charge) {
                    hitPixel.charge = 0.1
                }
                else if (hitPixel.charge) {
                    hitPixel.charge += 0.1
                }
                pixel.saw = false
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            doElectricity(hitPixel);
            if (elements[hitPixel.element].id === elements.light.id && Math.random() > 0.5) {
                pixel.saw = true
            }
            else if (pixel.saw === true && elements[hitPixel.element].id === elements.eye.id && Math.random() > (1 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                pixel.saw = false
                hitPixel.saw = true
            }
            else if (pixel.saw === true && elements[hitPixel.element].id === elements.eye_nerve.id && Math.random() > (1 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                if (!hitPixel.charge) {
                    hitPixel.charge = 0.1
                }
                else if (hitPixel.charge) {
                    hitPixel.charge += 0.1
                }
                pixel.saw = false
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            doElectricity(hitPixel);
            if (elements[hitPixel.element].id === elements.light.id && Math.random() > 0.5) {
                pixel.saw = true
            }
            else if (pixel.saw === true && elements[hitPixel.element].id === elements.eye.id && Math.random() > (1 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                pixel.saw = false
                hitPixel.saw = true
            }
            else if (pixel.saw === true && elements[hitPixel.element].id === elements.eye_nerve.id && Math.random() > (1 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                if (!hitPixel.charge) {
                    hitPixel.charge = 0.1
                }
                else if (hitPixel.charge) {
                    hitPixel.charge += 0.1
                }
                pixel.saw = false
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    tempHigh: 200,
    stateHigh: ["cooked_meat","salt_water","blood"],
    tempLow: -25,
    stateLow: "salt_water",
    burn: 10,
    burnTime: 250,
    conduct: .05,
    burnInto: ["cooked_meat","salt_water","blood"],
    breakInto: ["blood","blood","blood","blood","cerebrospinal_fluid","cerebrospinal_fluid","salt_water","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
        saw: false,
    },
    isBio: true,
    movable: false,
}

elements.brain = {
	color: ["#fce3e3","#deb6c5","#f5ced5","#e87b8f"],
	category: "biology",
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        doHeat(pixel);
		doBurning(pixel);
		doElectricity(pixel);
        if (Math.random() > 0.85 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            doElectricity(hitPixel);
            if (elements[hitPixel.element].id === elements.nerve.id && Math.random() > (1.25 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                if (!hitPixel.charge) {
                    hitPixel.charge = 0.1
                }
                else if (hitPixel.charge) {
                    hitPixel.charge += 0.1
                }
                pixel.chargeCD = 8
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            doElectricity(hitPixel);
            if (elements[hitPixel.element].id === elements.nerve.id && Math.random() > (1.25 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                if (!hitPixel.charge) {
                    hitPixel.charge = 0.1
                }
                else if (hitPixel.charge) {
                    hitPixel.charge += 0.1
                }
                pixel.chargeCD = 8
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            doElectricity(hitPixel);
            if (elements[hitPixel.element].id === elements.nerve.id && Math.random() > (1.25 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                if (!hitPixel.charge) {
                    hitPixel.charge = 0.1
                }
                else if (hitPixel.charge) {
                    hitPixel.charge += 0.1
                }
                pixel.chargeCD = 8
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            doElectricity(hitPixel);
            if (elements[hitPixel.element].id === elements.nerve.id && Math.random() > (1.25 - ((pixel.nutrition + pixel.oxygen) / 2000))) {
                if (!hitPixel.charge) {
                    hitPixel.charge = 0.1
                }
                else if (hitPixel.charge) {
                    hitPixel.charge += 0.1
                }
                pixel.chargeCD = 8
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .5,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.amygdala = {
	color: ["#B33E93","#B33E93","#f5ced5","#e87b8f"],
	category: "biology",
    behavior: behaviors.WALL,
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        doHeat(pixel);
        doBurning(pixel);
        doElectricity(pixel);
        if (Math.random() > 0.895 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (pixel.temp > 35) { pixel.temp -= 1; }
        else if (pixel.temp < 15) { pixel.temp += 1; }
    },
    density: 2710,
    state: "solid",
    conduct: .8,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.eye_nerve = {
	color: "#B33E93",
	category: "biology",
    behavior: behaviors.WALL,
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.895 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .8,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.nerve = {
	color: "#B33E93",
	category: "biology",
    behavior: behaviors.WALL,
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.895 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .8,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.throat_lining = {
	color: "#bc6157",
	category: "biology",
    behavior: [
        "XX|DL:stomach_acid%5|XX",
        "DL:stomach_acid%5|XX|DL:stomach_acid%5",
        "XX|DL:stomach_acid%5|XX",
    ],
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.9 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","slime","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    isBio: true,
    movable: false,
}

elements.intestines = {
	color: "#bc6157",
	category: "biology",
    behavior: behaviors.WALL,
	hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.9 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
		if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].id === elements.digested_material.id && Math.random() > 0.95) {
                changePixel(hitPixel,"poop");
                pixel.nutrition += (hitPixel.nutrition / 10)
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.25) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].id === elements.digested_material.id && Math.random() > 0.95) {
                changePixel(hitPixel,"poop");
                pixel.nutrition += (hitPixel.nutrition / 10)
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.25) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].id === elements.digested_material.id && Math.random() > 0.95) {
                changePixel(hitPixel,"poop");
                pixel.nutrition += (hitPixel.nutrition / 10)
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.25) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].id === elements.digested_material.id && Math.random() > 0.95) {
                changePixel(hitPixel,"poop");
                pixel.nutrition += (hitPixel.nutrition / 10)
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.25) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    movable: false,
    isBio: true
}

elements.lungs = {
	color: "#d4aaab",
	category: "biology",
    behavior: behaviors.WALL,
	hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.9 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
		if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].id === elements.oxygen.id && Math.random() > 0.95) {
                if (Math.random() > 0.75) {
                    changePixel(hitPixel,"carbon_dioxide");
                }
                pixel.oxygen += 100
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].id === elements.oxygen.id && Math.random() > 0.95) {
                if (Math.random() > 0.75) {
                    changePixel(hitPixel,"carbon_dioxide");
                }
                pixel.oxygen += 100
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].id === elements.oxygen.id && Math.random() > 0.95) {
                if (Math.random() > 0.75) {
                    changePixel(hitPixel,"carbon_dioxide");
                }
                pixel.oxygen += 100
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].id === elements.oxygen.id && Math.random() > 0.95) {
                if (Math.random() > 0.75) {
                    changePixel(hitPixel,"carbon_dioxide");
                }
                pixel.oxygen += 100
            }
            else if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","carbon_dioxide","meat","rotten_meat","cooked_meat","flesh","ash","carbon_dioxide","meat","rotten_meat","cooked_meat","flesh","ash","oxygen","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    movable: false,
    isBio: true
}

elements.gills = {
	color: "#5EBAE3",
	category: "biology",
	hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.9 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
            else if (elements[hitPixel.element].id === elements.deoxygenated_water.id && Math.random() > 0.75) {
                if (!tryMove(hitPixel,pixel.x,pixel.y+1)) {
                    if (elements[pixelMap[pixel.x][pixel.y+1].element].state === "liquid") {
                        swapPixels(hitPixel,pixelMap[pixel.x][pixel.y+1])
                    }
                }
            }
            else if (elements[hitPixel.element].id === elements.water.id && Math.random() > 0.75) {
                pixel.oxygen += 100
                if (Math.random() > 0.75) {
                    changePixel(hitPixel,"deoxygenated_water")
                }
                if (!tryMove(hitPixel,pixel.x,pixel.y+1)) {
                    if (elements[pixelMap[pixel.x][pixel.y+1].element].state === "liquid") {
                        swapPixels(hitPixel,pixelMap[pixel.x][pixel.y+1])
                    }
                }
            }
            else if (elements[hitPixel.element].id === elements.salt_water.id && Math.random() > 0.75) {
                pixel.oxygen += 90
                    if (Math.random() > 0.85) {
                    changePixel(hitPixel,"deoxygenated_water")
                }
                if (!tryMove(hitPixel,pixel.x,pixel.y+1)) {
                    if (elements[pixelMap[pixel.x][pixel.y+1].element].state === "liquid") {
                        swapPixels(hitPixel,pixelMap[pixel.x][pixel.y+1])
                    }
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
            else if (elements[hitPixel.element].id === elements.deoxygenated_water.id && Math.random() > 0.75) {
                if (isEmpty(pixel.x+1, pixel.y)) {
                    tryMove(hitPixel,pixel.x+1,pixel.y);
                }
            }
            else if (elements[hitPixel.element].id === elements.water.id && Math.random() > 0.75) {
                if (isEmpty(pixel.x+1, pixel.y)) {
                    pixel.oxygen += 100
                    if (Math.random() > 0.75) {
                        changePixel(hitPixel,"deoxygenated_water")
                    }
                    tryMove(hitPixel,pixel.x+1,pixel.y);
                }
            }
            else if (elements[hitPixel.element].id === elements.salt_water.id && Math.random() > 0.75) {
                if (isEmpty(pixel.x+1, pixel.y)) {
                    pixel.oxygen += 90
                    if (Math.random() > 0.85) {
                        changePixel(hitPixel,"deoxygenated_water")
                    }
                    tryMove(hitPixel,pixel.x+1,pixel.y);
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","oxygen","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    movable: false,
    isBio: true
}

elements.stomach_lining = {
	color: "#be5c4b",
	category: "biology",
    behavior: [
        "XX|CR:stomach_acid%5|XX",
        "CR:stomach_acid%5|XX|CR:stomach_acid%5",
        "XX|CR:stomach_acid%5|XX",
    ],
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.9 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    movable: false,
    isBio: true
}

elements.explosive_stomach = {
	color: "#AA9167",
	category: "biology",
    behavior: [
        "XX|CR:explosive_acid%5|XX",
        "CR:explosive_acid%5|XX|CR:explosive_acid%5",
        "XX|CR:explosive_acid%5|XX",
    ],
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.9 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    movable: false,
    isBio: true
}

elements.stomach_valve = {
	color: "#c8846f",
	category: "biology",
	hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.9 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
            else if (elements[hitPixel.element].id === elements.digested_material.id && Math.random() > 0.75) {
                if (isEmpty(pixel.x, pixel.y+1)) {
                    tryMove(hitPixel,pixel.x,pixel.y+1);
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    movable: false,
    isBio: true
}

elements.sphincter = {
	color: "#c8846f",
	category: "biology",
	hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.9 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"rotten_meat");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
            else if (elements[hitPixel.element].id === elements.poop.id && Math.random() > 0.75) {
                if (isEmpty(pixel.x, pixel.y+1)) {
                    tryMove(hitPixel,pixel.x,pixel.y+1);
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    density: 2710,
    state: "solid",
    conduct: .05,
    tempHigh: 200,
    stateHigh: "cooked_meat",
    tempLow: -25,
    stateLow: "frozen_meat",
    burn: 10,
    burnTime: 250,
    burnInto: "cooked_meat",
    breakInto: ["blood","meat"],
    forceSaveColor: true,
	reactions: {
		"cancer": { elem1:"cancer", chance:0.0005 },
        "radiation": { elem1:["ash","steam","poop","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 },
	},
	properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    movable: false,
    isBio: true
}

elements.digested_material = {
    color: "#B5C306",
    behavior: [
        "XX|XX|XX",
        "SW:stomach_acid,explosive_acid%3 AND M2%25|XX|SW:stomach_acid,explosive_acid%3 AND M2%25",
        "SW:stomach_acid,explosive_acid%5 AND M2%50|SW:stomach_acid,explosive_acid%10 AND M1|SW:stomach_acid,explosive_acid%5 AND M2%50",
    ],
	properties: {
        nutrition: 100,
    },
    category: "biology",
    state: "solid",
    density: 200,
    conduct: 0.25,
    stain: 0.01,
    darkText: true,
    tempHigh: 90,
    stateHigh: "dirty_water",
    tempLow: -30,
    stateLow: "dirty_ice",
}

elements.poop = {
    color: "#593001",
    behavior: behaviors.LIQUID,
    reactions: {
        "water": { elem1:null, elem2:"dirty_water", chance:0.02 },
        "salt_water": { elem1:null, elem2:"dirty_water", chance:0.02 },
        "sugar_water": { elem1:null, elem2:"dirty_water", chance:0.02 },
        "plant": { elem2:"dead_plant", chance:0.02},
    },
    category: "biology",
    state: "liquid",
    viscosity: 1000,
    density: 200,
    conduct: 0.25,
    darkText: true,
    tempHigh: 160,
    stateHigh: ["ash","ash","carbon_dioxide"],
    burn: 5,
    burnTime: 30,
    burnInto: ["ash","ash","carbon_dioxide","fire","fire"],
    tempLow: -30,
    stain: 0.03,
    stateLowName: "frozen_poop",
}

elements.stomach_acid = {
    color: ["#b5cf91","#288f2a"],
    behavior: [
        "XX|DB%1|XX",
        "DB%1 AND M2|DL%0.005|DB%1 AND M2",
        "DB%1 AND M2|DB%2 AND M1|DB%1 AND M2",
    ],
    ignore: ["throat_lining","explosive_stomach","stomach_lining","stomach_valve","slime","digested_material","glass","rad_glass","glass_shard","rad_shard","stained_glass","baked_clay","acid_gas","neutral_acid","acid_cloud","water","salt_water","sugar_water","dirty_water","copper","gold","porcelain","plastic","bead","microplastic","molten_plastic","pool_water","chlorine","hydrogen","gold_coin","silver","nickel","calcium","bone","earthquake","tornado","tsunami","liquid_light","sensor"],
    reactions: {
        "water": { elem1:null, elem2:"dirty_water", chance:0.02 },
        "salt_water": { elem1:null, elem2:"water", chance:0.02 },
        "sugar_water": { elem1:null, elem2:"water", chance:0.02 },
        "plant": { elem2:"digested_material", attr2:{"nutrition":"10"}, chance:0.02},
        "tree_branch": { elem1:null, elem2:"wood", chance:0.02 },
        "sugar": { elem2:"digested_material", attr2:{"nutrition":"30"}, chance:0.02 },
        "dead_plant": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "meat": { elem2:"digested_material", attr2:{"nutrition":"30"}, chance:0.02 },
        "cooked_meat": { elem2:"digested_material", attr2:{"nutrition":"60"}, chance:0.02 },
        "rotten_meat": { elem2:["digested_material","ammonia",null,null,null], attr2:{"nutrition":"-10"}, chance:0.02 },
        "cured_meat": { elem2:"digested_material", attr2:{"nutrition":"50"}, chance:0.02 },
        "cheese": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "lettuce": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "herb": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "toast": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "bread": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "hard_yolk": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "yolk": { elem2:"digested_material", attr2:{"nutrition":"-10"}, chance:0.02 },
        "milk": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "crumb": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "pickle": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "salt": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "ant": { elem2:"digested_material", attr2:{"nutrition":"-10"}, chance:0.02 },
        "bee": { elem2:"digested_material", attr2:{"nutrition":"-10"}, chance:0.02 },
        "spider": { elem2:"digested_material", attr2:{"nutrition":"-10"}, chance:0.02 },
        "egg": { elem2:"digested_material", attr2:{"nutrition":"-15"}, chance:0.02 },
        "soda": { elem2:"digested_material", attr2:{"nutrition":"20"}, chance:0.02 },
        "sap": { elem2:"digested_material", attr2:{"nutrition":"-5"}, chance:0.02 },
        "juice": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "mayo": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "nut_butter": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "ketchup": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "jelly": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "bleach": { elem2:"digested_material", attr2:{"nutrition":"-500"}, chance:0.02 },
        "poison": { elem2:"digested_material", attr2:{"nutrition":"-750"}, chance:0.02 },
        "soap": { elem2:"digested_material", attr2:{"nutrition":"-20"}, chance:0.02 },
        "mercury": { elem2:"digested_material", attr2:{"nutrition":"-500"}, chance:0.02 },
        "coffee": { elem2:"digested_material", attr2:{"nutrition":"20"}, chance:0.02 },
        "tomato": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "grape": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "beans": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "sauce": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "butter": { elem2:"digested_material", attr2:{"nutrition":"15"}, chance:0.02 },
        "melted_cheese": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "melted_chocolate": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "melted_butter": { elem2:"digested_material", attr2:{"nutrition":"10"}, chance:0.02 },
        "chocolate": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "rice": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "dough": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "batter": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "baked_batter": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "ice_cream": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "cream": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "caramel": { elem2:"digested_material", attr2:{"nutrition":"30"}, chance:0.02 },
        "potato": { elem2:"digested_material", attr2:{"nutrition":"15"}, chance:0.02 },
        "baked_potato": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "mashed_potato": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "yogurt": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "frozen_yogurt": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "slush": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "coffee_bean": { elem2:"digested_material", attr2:{"nutrition":"-5"}, chance:0.02 },
        "yeast": { elem2:"digested_material", attr2:{"nutrition":"-5"}, chance:0.02 },
        "alcohol": { elem2:"digested_material", attr2:{"nutrition":"-35"}, chance:0.02 },
        "honey": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "blood": { elem2:"digested_material", attr2:{"nutrition":"-5"}, chance:0.02 },
        "infection": { elem2:"digested_material", attr2:{"nutrition":"-15"}, chance:0.02 },
        "cancer": { elem2:"digested_material", attr2:{"nutrition":"-15"}, chance:0.02 },
        "plague": { elem2:"digested_material", attr2:{"nutrition":"-15"}, chance:0.02 },
        "glue": { elem2:"digested_material", attr2:{"nutrition":"-10"}, chance:0.02 },
    },
    category: "biology",
    tempHigh: 110,
    stateHigh: "acid_gas",
    tempLow: -58.88,
    burn: 30,
    burnTime: 1,
    state: "liquid",
    density: 1049,
    stain: -0.1
}

elements.explosive_acid = {
    color: ["#E9DC8C","#D0C15A"],
    behavior: [
        "XX|DB%1|XX",
        "DB%1 AND M2|DL%0.001|DB%1 AND M2",
        "DB%1 AND M2|DB%2 AND M1|DB%1 AND M2",
    ],
    ignore: ["throat_lining","explosive_stomach","stomach_valve","slime","digested_material","glass","rad_glass","glass_shard","rad_shard","stained_glass","baked_clay","acid_gas","neutral_acid","acid_cloud","water","salt_water","sugar_water","dirty_water","copper","gold","porcelain","plastic","bead","microplastic","molten_plastic","pool_water","chlorine","hydrogen","gold_coin","silver","nickel","calcium","bone","earthquake","tornado","tsunami","liquid_light","sensor"],
    reactions: {
        "water": { elem1:null, elem2:"dirty_water", chance:0.02 },
        "salt_water": { elem1:null, elem2:"water", chance:0.02 },
        "sugar_water": { elem1:null, elem2:"water", chance:0.02 },
        "plant": { elem2:"digested_material", attr2:{"nutrition":"10"}, chance:0.02},
        "tree_branch": { elem1:null, elem2:"wood", chance:0.02 },
        "sugar": { elem2:"digested_material", attr2:{"nutrition":"30"}, chance:0.02 },
        "dead_plant": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "meat": { elem2:"digested_material", attr2:{"nutrition":"30"}, chance:0.02 },
        "cooked_meat": { elem2:"digested_material", attr2:{"nutrition":"60"}, chance:0.02 },
        "rotten_meat": { elem2:["digested_material","ammonia",null,null,null], attr2:{"nutrition":"30"}, chance:0.02 },
        "cured_meat": { elem2:"digested_material", attr2:{"nutrition":"50"}, chance:0.02 },
        "cheese": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "lettuce": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "herb": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "toast": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "bread": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "hard_yolk": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "yolk": { elem2:"digested_material", attr2:{"nutrition":"10"}, chance:0.02 },
        "milk": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "crumb": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "pickle": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "salt": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "ant": { elem2:"digested_material", attr2:{"nutrition":"10"}, chance:0.02 },
        "bee": { elem2:"digested_material", attr2:{"nutrition":"10"}, chance:0.02 },
        "spider": { elem2:"digested_material", attr2:{"nutrition":"10"}, chance:0.02 },
        "egg": { elem2:"digested_material", attr2:{"nutrition":"10"}, chance:0.02 },
        "soda": { elem2:"digested_material", attr2:{"nutrition":"20"}, chance:0.02 },
        "sap": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "juice": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "mayo": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "nut_butter": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "ketchup": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "jelly": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "bleach": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "poison": { elem2:"digested_material", attr2:{"nutrition":"20"}, chance:0.02 },
        "soap": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "mercury": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "coffee": { elem2:"digested_material", attr2:{"nutrition":"20"}, chance:0.02 },
        "tomato": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "grape": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "beans": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "sauce": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "butter": { elem2:"digested_material", attr2:{"nutrition":"15"}, chance:0.02 },
        "melted_cheese": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "melted_chocolate": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "melted_butter": { elem2:"digested_material", attr2:{"nutrition":"10"}, chance:0.02 },
        "chocolate": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "rice": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "dough": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "batter": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "baked_batter": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "ice_cream": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "cream": { elem2:"digested_material", attr2:{"nutrition":"25"}, chance:0.02 },
        "caramel": { elem2:"digested_material", attr2:{"nutrition":"30"}, chance:0.02 },
        "potato": { elem2:"digested_material", attr2:{"nutrition":"15"}, chance:0.02 },
        "baked_potato": { elem2:"digested_material", attr2:{"nutrition":"45"}, chance:0.02 },
        "mashed_potato": { elem2:"digested_material", attr2:{"nutrition":"40"}, chance:0.02 },
        "yogurt": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "frozen_yogurt": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "slush": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "coffee_bean": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "yeast": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "alcohol": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "honey": { elem2:"digested_material", attr2:{"nutrition":"35"}, chance:0.02 },
        "blood": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "infection": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "cancer": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "plague": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
        "glue": { elem2:"digested_material", attr2:{"nutrition":"5"}, chance:0.02 },
    },
    category: "biology",
    tempHigh: 600,
    stateHigh: "pop",
    burn: 100,
    burnTime: 1,
    burnInto: "explosion",
    breakInto: ["explosion","pop"],
    viscosity: 36,
    tempLow: -58.88,
    burn: 30,
    burnTime: 1,
    state: "liquid",
    density: 1049,
}

elements.deoxygenated_water = {
    color: "#829BD4",
    behavior: behaviors.LIQUID,
    tempHigh: 100,
    stateHigh: "steam",
    tempLow: 0,
    stateLow: "ice",
    category: "liquids",
    heatCapacity: 4.184,
    reactions: {
        "oxygen": { elem1: "water", elem2: null },
        "dust": { elem1: "dirty_water", elem2: null },
        "ash": { elem1: "dirty_water", elem2: null },
        "cyanide": { elem1: "dirty_water", elem2: null },
        "cyanide_gas": { elem1: "dirty_water", elem2: null },
        "carbon_dioxide": { elem1: "seltzer", elem2: null, oneway:true },
        "sulfur": { elem1: "dirty_water", elem2: null },
        "rat": { elem1: "dirty_water", chance:0.005 },
        "plague": { elem1: "dirty_water", elem2: null },
        "rust": { elem1: "dirty_water", chance:0.005 },
        "lead": { elem1: "dirty_water", chance:0.005 },
        "solder": { elem1: "dirty_water", chance:0.005 },
        "fallout": { elem1: "dirty_water", chance:0.25 },
        "radiation": { elem1: "dirty_water", chance:0.25 },
        "uranium": { elem1: "dirty_water", chance:0.25 },
        "rad_steam": { elem1: "dirty_water", chance:0.02 },
        "rad_glass": { elem1: "dirty_water", chance:0.005 },
        "rad_shard": { elem1: "dirty_water", chance:0.01 },
        "rotten_meat": { elem1: "dirty_water", chance:0.25 },
        "rotten_cheese": { elem1: "dirty_water", chance:0.25 },
        "cancer": { elem1: "dirty_water", chance:0.25 },
        "oil": { elem1: "dirty_water", chance:0.005 },
        "dioxin": { elem1: "dirty_water", chance:0.1 },
        "rock": { elem2: "wet_sand", chance: 0.00035 },
        "limestone": { elem2: "wet_sand", chance: 0.00035 },
        "tuff": { elem2: "wet_sand", color2:"#7a6b5c", chance: 0.00035 },
        "ruins": { elem2: "rock", chance: 0.00035 },
        "mudstone": { elem2: "mud", chance: 0.00035 },
        "fly": { elem2:"dead_bug", chance:0.1, oneway:true },
        "firefly": { elem2:"dead_bug", chance:0.1, oneway:true },
        "bee": { elem2:"dead_bug", chance:0.05, oneway:true },
        "stink_bug": { elem2:"dead_bug", chance:0.1, oneway:true },
        "cured_meat": { elem1:"salt_water", elem2:"meat" },
        "water": { elem1:"water", chance:0.005 },
        "salt_water": { elem1:"water", chance:0.005 },
        "deoxygenated_water": { elem2:"bubble", attr2:{"clone":"water"}, chance:0.001, tempMin:85 },
    },
    state: "liquid",
    density: 1100,
    conduct: 0.02,
    stain: -0.5,
    extinguish: true
}

elements.real_bone = {
    color: "#d9d9d9",
    behavior: behaviors.WALL,
    reactions: {
        "water": { elem2:"broth", tempMin:70 },
        "salt_water": { elem2:"broth", tempMin:70 },
        "sugar_water": { elem2:"broth", tempMin:70 },
        "seltzer": { elem2:"broth", tempMin:70 },
    },
    hoverStat: function(pixel) {
        return "Nutr:"+pixel.nutrition+" O2:"+pixel.oxygen
    },
    tick: function(pixel) {
        if (Math.random() > 0.95 && pixel.nutrition > 0 && pixel.oxygen > 0) {
            pixel.nutrition--
            pixel.oxygen--
        }
        if (Math.random() > 0.5 && (pixel.nutrition < 1 || pixel.oxygen < 1)) {
            changePixel(pixel,"bone");
        }
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    category:"biology",
    tempHigh: 260,
    stateHigh: "bone",
    tempLow: -36,
    stateLow: "bone",
    state: "solid",
    density: 1900,
    hardness: 0.5,
    properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    breakInto: ["quicklime","quicklime","quicklime","blood","bone","bone","bone","bone","bone","bone"],
    movable: false,
    isBio: true
}

elements.cerebrospinal_fluid = {
    color: "#CBC3E3",
    behavior: behaviors.LIQUID,
    tick: function(pixel) {
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 10
                    pixel.oxygen -= 10
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 10
                    pixel.nutrition -= 10
                }
            }
        }
    },
    tempHigh: 102,
    stateHigh: ["steam","salt"],
    tempLow: -5,
    category: "biology",
    reactions: {
        "dust": { elem1: "dirty_water", elem2: null },
        "ash": { elem1: "dirty_water", elem2: null },
        "carbon_dioxide": { elem1: "dirty_water", elem2: null },
        "sulfur": { elem1: "dirty_water", elem2: null },
        "rat": { elem1: "dirty_water", chance:0.005 },
        "plague": { elem1: "dirty_water", elem2: null },
        "fallout": { elem1: "dirty_water", chance:0.25 },
        "radiation": { elem1: "dirty_water", chance:0.25 },
        "rust": { elem1: "dirty_water", chance:0.005 },
        "lead": { elem1: "dirty_water", chance:0.005 },
        "solder": { elem1: "dirty_water", chance:0.005 },
        "rock": { elem2: "wet_sand", chance: 0.0005 },
        "limestone": { elem2: "wet_sand", chance: 0.0005 },
        "fly": { elem2:"dead_bug", chance:0.1, oneway:true },
        "firefly": { elem2:"dead_bug", chance:0.1, oneway:true },
        "bee": { elem2:"dead_bug", chance:0.05, oneway:true },
        "stink_bug": { elem2:"dead_bug", chance:0.1, oneway:true },
        "cancer": { elem1: "dirty_water", chance:0.25 },
        "oil": { elem1: "dirty_water", chance:0.005 },
        "uranium": { elem1: "dirty_water", chance:0.25 },
        "wet_sand": { oneway:true, chance:0.007, func:function(pixel){
            if (isEmpty(pixel.x,pixel.y-1) || isEmpty(pixel.x,pixel.y-2) || isEmpty(pixel.x,pixel.y-3)) {
                changePixel(pixel,"foam");
                pixel.clone = "salt_water";
            }
        }},
        "salt_water": { elem2:"bubble", attr2:{"clone":"salt_water"}, chance:0.001, tempMin:85 },
        // electrolysis:
        "aluminum": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.0025 },
        "zinc": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.015 },
        "steel": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.0125 },
        "iron": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.0125 },
        "tin": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.01 },
        "brass": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.001 },
        "bronze": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.001 },
        "copper": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.0075 },
        "silver": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.0075 },
        "gold": { elem1:["hydrogen","hydrogen","oxygen","chlorine"], charged:true, chance:0.0075 },
    },
    state: "liquid",
    density: 1026,
    stain: -0.01,
    properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    extinguish: true,
    isBio: true
}

elements.elixir = {
    color: "#8CB6AA",
    behavior: behaviors.LIQUID,
    reactions: {
        "dirt": { elem2: "mud", elem1: null },
        "dust": { elem1: "dirty_water", elem2: null },
        "ash": { elem1: "dirty_water", elem2: null },
        "carbon_dioxide": { elem1: "dirty_water", elem2: null },
        "sulfur": { elem1: "dirty_water", elem2: null },
        "rat": { elem1: "dirty_water", chance:0.005 },
        "plague": { elem1: "dirty_water", elem2: null },
        "fallout": { elem1: "dirty_water", chance:0.25 },
        "radiation": { elem1: "dirty_water", chance:0.25 },
        "rust": { elem1: "dirty_water", chance:0.005 },
        "lead": { elem1: "dirty_water", chance:0.005 },
        "solder": { elem1: "dirty_water", chance:0.005 },
        "rock": { elem2: "wet_sand", chance: 0.0005 },
        "limestone": { elem2: "wet_sand", chance: 0.0005 },
        "fly": { elem2:"dead_bug", chance:0.1, oneway:true },
        "firefly": { elem2:"dead_bug", chance:0.1, oneway:true },
        "bee": { elem2:"dead_bug", chance:0.05, oneway:true },
        "stink_bug": { elem2:"dead_bug", chance:0.1, oneway:true },
        "cancer": { elem1: "dirty_water", chance:0.25 },
        "oil": { elem1: "dirty_water", chance:0.005 },
        "uranium": { elem1: "dirty_water", chance:0.25 },
        "cerebrospinal_fluid": { elem1:"brain_jar_juice", elem2:"brain_jar_juice", chance:0.01 },
    },
    viscosity: 4000,
    tempHigh: 120,
    stateHigh: ["steam","steam","dna","dna","sugar","salt",],
    tempLow: 0,
    category:"biology",
    state: "liquid",
    density: 1450,
    stain: 0.05,
    hidden: true,
}

elements.brain_jar_juice = {
    color: "#4F8C24",
    behavior: behaviors.LIQUID,
    hidden: true,
    tick: function(pixel) {
        if (pixel.nutrition === null || isNaN(pixel.nutrition)) {
            pixel.nutrition = 500
        }
        if (pixel.oxygen === null || isNaN(pixel.oxygen)) {
            pixel.oxygen = 500
        }
        if (!isEmpty(pixel.x, pixel.y-1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y-1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 1
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 1
                }
            }
        }
        if (!isEmpty(pixel.x, pixel.y+1, true)) {
            var hitPixel = pixelMap[pixel.x][pixel.y+1]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 1
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 1
                }
            }
        }
        if (!isEmpty(pixel.x-1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x-1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 1
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 1
                }
            }
        }
        if (!isEmpty(pixel.x+1, pixel.y, true)) {
            var hitPixel = pixelMap[pixel.x+1][pixel.y]
            if (elements[hitPixel.element].isBio === true && Math.random() > 0.5) {
                if (hitPixel.oxygen < pixel.oxygen) {
                    hitPixel.oxygen += 1
                }
                if (hitPixel.nutrition < pixel.nutrition) {
                    hitPixel.nutrition += 1
                }
            }
        }
    },
    tempHigh: 102,
    stateHigh: ["steam","salt"],
    tempLow: -5,
    category: "biology",
    reactions: {
        "dust": { elem1: "dirty_water", elem2: null },
        "ash": { elem1: "dirty_water", elem2: null },
        "carbon_dioxide": { elem1: "dirty_water", elem2: null },
        "sulfur": { elem1: "dirty_water", elem2: null },
        "rat": { elem1: "dirty_water", chance:0.005 },
        "plague": { elem1: "dirty_water", elem2: null },
        "fallout": { elem1: "dirty_water", chance:0.25 },
        "radiation": { elem1: "dirty_water", chance:0.25 },
        "rust": { elem1: "dirty_water", chance:0.005 },
        "lead": { elem1: "dirty_water", chance:0.005 },
        "solder": { elem1: "dirty_water", chance:0.005 },
        "rock": { elem2: "wet_sand", chance: 0.0005 },
        "limestone": { elem2: "wet_sand", chance: 0.0005 },
        "fly": { elem2:"dead_bug", chance:0.1, oneway:true },
        "firefly": { elem2:"dead_bug", chance:0.1, oneway:true },
        "bee": { elem2:"dead_bug", chance:0.05, oneway:true },
        "stink_bug": { elem2:"dead_bug", chance:0.1, oneway:true },
        "cancer": { elem1: "dirty_water", chance:0.25 },
        "oil": { elem1: "dirty_water", chance:0.005 },
        "uranium": { elem1: "dirty_water", chance:0.25 },
        "wet_sand": { oneway:true, chance:0.007, func:function(pixel){
            if (isEmpty(pixel.x,pixel.y-1) || isEmpty(pixel.x,pixel.y-2) || isEmpty(pixel.x,pixel.y-3)) {
                changePixel(pixel,"foam");
                pixel.clone = "salt_water";
            }
        }},
        "brain_jar_juice": { elem2:"bubble", color2:"#81cf63", attr2:{"clone":"brain_jar_juice"}, chance:0.0001 },
    },
    state: "liquid",
    density: 1026,
    stain: -0.01,
    properties: {
        oxygen: 1000,
        nutrition: 1000,
    },
    extinguish: true
}

if (!elements.cancer.reactions) { elements.cancer.reactions = {} }
elements.cancer.reactions.flesh = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.epidermis = { "elem2": "cancer", chance:0.0002 };
elements.cancer.reactions.scales = { "elem2": "cancer", chance:0.0001 };
elements.cancer.reactions.real_bone = { "elem2": ["bone","bone","cancer"], chance:0.0001 };
elements.cancer.reactions.lungs = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.gills = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.brain = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.nerve = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.eye_nerve = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.eye = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.sphincter = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.digested_material = { "elem2": "cancer", chance:0.001 };
elements.cancer.reactions.intestines = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.stomach_valve = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.stomach_lining = { "elem2": "cancer", chance:0.005 };
elements.cancer.reactions.stomach_lining = { "elem2": ["pop","cancer","cancer","cancer"], chance:0.003 };
elements.cancer.reactions.throat_lining = { "elem2": "cancer", chance:0.005 };

if (!elements.uranium.reactions) { elements.uranium.reactions = {} }
elements.uranium.reactions.flesh = { "elem2": ["ash","blood","fat","meat","rotten_meat","cooked_meat"], chance:0.5 };
elements.uranium.reactions.epidermis = { "elem2": ["cooked_meat","cancer","ash","skin","hair"], chance:0.1 };
elements.uranium.reactions.scales = { "elem2": ["cooked_meat","cancer","ash","epidermis","skin","dust","calcium"], chance:0.1 };
elements.uranium.reactions.real_bone = { "elem2": ["bone","bone","radiation"], chance:0.01 };
elements.uranium.reactions.gills = { "elem2": ["ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };
elements.uranium.reactions.lungs = { "elem2": ["ash","carbon_dioxide","meat","rotten_meat","cooked_meat","flesh","ash","carbon_dioxide","meat","rotten_meat","cooked_meat","flesh","ash","oxygen","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };
elements.uranium.reactions.brain = { "elem2": ["ash","steam","salt","meat","rotten_meat","cooked_meat","flesh","cerebrospinal_fluid"], chance:0.5 };
elements.uranium.reactions.amygdala = { "elem2": ["ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };
elements.uranium.reactions.nerve = { "elem2": ["ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };
elements.uranium.reactions.eye_nerve = { "elem2": ["ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };
elements.uranium.reactions.eye = { "elem2": ["ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };
elements.uranium.reactions.sphincter = { "elem2": ["ash","steam","poop","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };
elements.uranium.reactions.intestines = { "elem2": ["ash","steam","meat","rotten_meat","cooked_meat","flesh","ash","steam","meat","rotten_meat","cooked_meat","flesh","poop"], chance:0.5 };
elements.uranium.reactions.stomach_valve = { "elem2": ["ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };
elements.uranium.reactions.stomach_lining = { "elem2": ["ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };
elements.uranium.reactions.explosive_stomach = { "elem2": ["cancer","ash","steam","meat","rotten_meat","cooked_meat","flesh","pop"], chance:0.3 };
elements.uranium.reactions.throat_lining = { "elem2": ["ash","slime","meat","rotten_meat","cooked_meat","flesh"], chance:0.5 };

if (!elements.radiation.reactions) { elements.radiation.reactions = {} }
elements.radiation.reactions.flesh = { "elem2": ["ash","blood","fat","meat","rotten_meat","cooked_meat","cancer","cancer"], chance:0.4 };
elements.radiation.reactions.epidermis = { "elem2": ["cooked_meat","cancer","ash","skin","hair"], chance:0.1 };
elements.radiation.reactions.real_bone = { "elem2": ["bone","bone","radiation"], chance:0.01 };
elements.radiation.reactions.gills = { "elem2": ["ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };
elements.radiation.reactions.lungs = { "elem2": ["cancer","ash","carbon_dioxide","meat","rotten_meat","cooked_meat","flesh","ash","carbon_dioxide","meat","rotten_meat","cooked_meat","flesh","ash","oxygen","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };
elements.radiation.reactions.brain = { "elem2": ["cancer","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh","cerebrospinal_fluid"], chance:0.4 };
elements.radiation.reactions.amygdala = { "elem2": ["cancer","ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };
elements.radiation.reactions.nerve = { "elem2": ["cancer","ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };
elements.radiation.reactions.eye_nerve = { "elem2": ["cancer","ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };
elements.radiation.reactions.eye = { "elem2": ["cancer","ash","steam","salt","ash","steam","salt","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };
elements.radiation.reactions.sphincter = { "elem2": ["cancer","ash","steam","poop","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };
elements.radiation.reactions.intestines = { "elem2": ["cancer","ash","steam","meat","rotten_meat","cooked_meat","flesh","ash","steam","meat","rotten_meat","cooked_meat","flesh","poop"], chance:0.4 };
elements.radiation.reactions.stomach_valve = { "elem2": ["cancer","ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };
elements.radiation.reactions.stomach_lining = { "elem2": ["cancer","ash","steam","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };
elements.radiation.reactions.explosive_stomach = { "elem2": ["cancer","ash","steam","meat","rotten_meat","cooked_meat","flesh","pop"], chance:0.3 };
elements.radiation.reactions.throat_lining = { "elem2": ["cancer","ash","slime","meat","rotten_meat","cooked_meat","flesh"], chance:0.4 };

if (!elements.plague.reactions) { elements.plague.reactions = {} }
elements.plague.reactions.flesh = { "elem2": ["rotten_meat","plague","fat","meat","rotten_meat","plague","infection","infection"], chance:0.04 };
elements.plague.reactions.epidermis = { "elem2": ["plague","infection","rotten_meat","skin","hair"], chance:0.1 };
elements.plague.reactions.scales = { "elem2": ["plague","infection","rotten_meat","dust","skin","calcium"], chance:0.1 };
elements.plague.reactions.real_bone = { "elem2": ["bone","bone","infection","plague"], chance:0.01 };
elements.plague.reactions.gills = { "elem2": ["infection","steam","meat","rotten_meat","plague","flesh","plague"], chance:0.04 };
elements.plague.reactions.lungs = { "elem2": ["infection","rotten_meat","carbon_dioxide","meat","rotten_meat","plague","flesh","rotten_meat","carbon_dioxide","meat","rotten_meat","plague","flesh","rotten_meat","oxygen","meat","rotten_meat","plague","flesh"], chance:0.04 };
elements.plague.reactions.brain = { "elem2": ["infection","rotten_meat","steam","salt","meat","rotten_meat","plague","flesh","cerebrospinal_fluid"], chance:0.04 };
elements.plague.reactions.amygdala = { "elem2": ["infection","rotten_meat","steam","salt","rotten_meat","steam","salt","meat","rotten_meat","plague","flesh"], chance:0.04 };
elements.plague.reactions.nerve = { "elem2": ["infection","rotten_meat","steam","salt","rotten_meat","steam","salt","meat","rotten_meat","plague","flesh"], chance:0.04 };
elements.plague.reactions.eye_nerve = { "elem2": ["infection","rotten_meat","steam","salt","rotten_meat","steam","salt","meat","rotten_meat","plague","flesh"], chance:0.04 };
elements.plague.reactions.eye = { "elem2": ["infection","rotten_meat","steam","salt","rotten_meat","steam","salt","meat","rotten_meat","plague","flesh"], chance:0.04 };
elements.plague.reactions.sphincter = { "elem2": ["infection","rotten_meat","steam","poop","meat","rotten_meat","plague","flesh"], chance:0.04 };
elements.plague.reactions.intestines = { "elem2": ["infection","rotten_meat","steam","meat","rotten_meat","plague","flesh","rotten_meat","steam","meat","rotten_meat","plague","flesh","poop"], chance:0.04 };
elements.plague.reactions.stomach_valve = { "elem2": ["infection","rotten_meat","steam","meat","rotten_meat","plague","flesh"], chance:0.04 };
elements.plague.reactions.stomach_lining = { "elem2": ["infection","rotten_meat","steam","meat","rotten_meat","plague","flesh"], chance:0.04 };
elements.plague.reactions.explosive_stomach = { "elem2": ["infection","plague","steam","meat","rotten_meat","plague","flesh","pop"], chance:0.03 };
elements.plague.reactions.throat_lining = { "elem2": ["infection","rotten_meat","slime","meat","rotten_meat","plague","flesh"], chance:0.04 };

if (!elements.infection.reactions) { elements.infection.reactions = {} }
elements.infection.reactions.flesh = { "elem2": ["rotten_meat","infection","fat","meat","rotten_meat","infection","infection","infection"], chance:0.04 };
elements.infection.reactions.epidermis = { "elem2": ["infection","infection","rotten_meat","skin","hair"], chance:0.1 };
elements.infection.reactions.scales = { "elem2": ["infection","infection","rotten_meat","dust","skin","calcium"], chance:0.1 };
elements.infection.reactions.real_bone = { "elem2": ["bone","bone","infection","infection"], chance:0.01 };
elements.infection.reactions.gills = { "elem2": ["infection","steam","meat","rotten_meat","infection","flesh","infection"], chance:0.04 };
elements.infection.reactions.lungs = { "elem2": ["infection","rotten_meat","carbon_dioxide","meat","rotten_meat","infection","flesh","rotten_meat","carbon_dioxide","meat","rotten_meat","infection","flesh","rotten_meat","oxygen","meat","rotten_meat","infection","flesh"], chance:0.04 };
elements.infection.reactions.brain = { "elem2": ["infection","rotten_meat","steam","salt","meat","rotten_meat","infection","flesh","cerebrospinal_fluid"], chance:0.04 };
elements.infection.reactions.amygdala = { "elem2": ["infection","rotten_meat","steam","salt","rotten_meat","steam","salt","meat","rotten_meat","infection","flesh"], chance:0.04 };
elements.infection.reactions.nerve = { "elem2": ["infection","rotten_meat","steam","salt","rotten_meat","steam","salt","meat","rotten_meat","infection","flesh"], chance:0.04 };
elements.infection.reactions.eye_nerve = { "elem2": ["infection","rotten_meat","steam","salt","rotten_meat","steam","salt","meat","rotten_meat","infection","flesh"], chance:0.04 };
elements.infection.reactions.eye = { "elem2": ["infection","rotten_meat","steam","salt","rotten_meat","steam","salt","meat","rotten_meat","infection","flesh"], chance:0.04 };
elements.infection.reactions.sphincter = { "elem2": ["infection","rotten_meat","steam","poop","meat","rotten_meat","infection","flesh"], chance:0.04 };
elements.infection.reactions.intestines = { "elem2": ["infection","rotten_meat","steam","meat","rotten_meat","infection","flesh","rotten_meat","steam","meat","rotten_meat","infection","flesh","poop"], chance:0.04 };
elements.infection.reactions.stomach_valve = { "elem2": ["infection","rotten_meat","steam","meat","rotten_meat","infection","flesh"], chance:0.04 };
elements.infection.reactions.stomach_lining = { "elem2": ["infection","rotten_meat","steam","meat","rotten_meat","infection","flesh"], chance:0.04 };
elements.infection.reactions.explosive_stomach = { "elem2": ["infection","infection","steam","meat","rotten_meat","cooked_meat","flesh","pop"], chance:0.03 };
elements.infection.reactions.throat_lining = { "elem2": ["infection","rotten_meat","slime","meat","rotten_meat","infection","flesh"], chance:0.04 };

elements.dna.reactions.juice = { "elem1": null, "elem2": "elixir", chance:0.01 };