// Dinos to be displayed based on diet selected
const dinosaurs = [
    { name: "Tyrannosaurus", diet: "carnivore" },
    { name: "Velociraptor", diet: "carnivore" },
    { name: "Spinosaurus", diet: "carnivore" },
    { name: "Allosaurus", diet: "carnivore" },
    { name: "Brachiosaurus", diet: "herbivore" },
    { name: "Triceratops", diet: "herbivore" },
    { name: "Stegosaurus", diet: "herbivore" },
    { name: "Parasaurolophus", diet: "herbivore" },
    { name: "Oviraptor", diet: "omnivore" },
    { name: "Deinonychus", diet: "omnivore" },
    { name: "Gallimimus", diet: "omnivore" },
    { name: "Therizinosaurus", diet: "omnivore" },
];

function filterDinos(diet) {
    const filteredDinos = dinosaurs.filter(dino => dino.diet === diet);

    // Clear the current list
    let dinoList = document.getElementById('dino-list');
    if (dinoList) {
        dinoList.innerHTML = "";
    } else {
        dinoList = document.createElement('div');
        dinoList.id = 'dino-list';
        document.body.appendChild(dinoList);
    }

    // Display the filtered dinosaurs
    filteredDinos.forEach(dino => {
        const dinoItem = document.createElement('button');
        dinoItem.className = 'dino-item';
        dinoItem.textContent = dino.name;

        // Add click event to each dino item to trigger searchDino
        dinoItem.addEventListener('click', () => {
            searchDino(dino.name);
        });

        dinoList.appendChild(dinoItem);
    });
}

async function searchDino(dinoName = null) {
    // If no dinoName is provided, fetch from the input
    let dinoList = document.getElementById('dino-list');

    if (dinoList) {
        dinoList.innerHTML = "";
    }
    
    if (!dinoName) {
        dinoName = document.getElementById('dino-input').value;
    }

    // Send the dinosaur name to the server to write to dinoInfo.txt
    const response = await fetch('/writeToFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: dinoName }),
    });

    const data = await response.json();

    if (data.success) {
        // Waiting for the microservice to serve data back
        setTimeout(async () => {
            const stats = await fetch('/getDinoStats').then(res => res.json());
            // Display stats on the page
            displayStats(stats);
        }, 4000); // waits for 4 seconds
    }
}

function displayStats(stats) {
    // Check if a stats div already exists and remove it
    const existingStatsDiv = document.getElementById('dino-stats');
    if (existingStatsDiv) {
        existingStatsDiv.remove();
    }

    // Create a new stats div and add the stats to it
    const statsDiv = document.createElement('div');
    statsDiv.id = "dino-stats";
    statsDiv.innerHTML = `
        <h3>${stats.name}</h3>
        <p>Health: ${stats.health}</p>
        <p>Stamina: ${stats.stamina}</p>
        <p>Damage: ${stats.damage}</p>
        <p>Diet: ${stats.diet}
    `;

    // Append the stats div to the body
    document.body.appendChild(statsDiv);
}
