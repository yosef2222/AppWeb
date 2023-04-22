var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var context = canvas.getContext('2d');
canvas.addEventListener('mousedown', handleMouseDown);

var points = [];
function handleMouseDown(event) {
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
    context.fill();
    points.push({ x, y });
}


// Run k-means clustering

function kMeans(data, k) {
    // Initialize centroids randomly
    let centroids = [];
    for (let i = 0; i < k; i++) {
        centroids.push(data[Math.floor(Math.random() * data.length)]);

    }
    let clusters = [];
    for (let i = 0; i < k; i++) {
        clusters.push([]);
    }
    // Repeat until convergence
    let converged = false;
    while (!converged) {
        // Assign each data point to the closest centroid
        for (let i = 0; i < data.length; i++) {
            let distances = centroids.map(c => distance(data[i], c));
            let closestCentroid = distances.indexOf(Math.min(...distances));
            clusters[closestCentroid].push(data[i]);
        }

        // Update centroids
        let newCentroids = [];
        for (let i = 0; i < k; i++) {
            let cluster = clusters[i];
            let centroid = cluster.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });
            centroid.x /= cluster.length;
            centroid.y /= cluster.length;
            newCentroids.push(centroid);
        }

        // Check for convergence
        converged = true;
        for (let i = 0; i < k; i++) {
            if (distance(centroids[i], newCentroids[i]) > 0.0001) {
                converged = false;
                break;
            }
        }

        centroids = newCentroids;
    }

    return clusters;
}

function distance(a, b) {
    // Euclidean distance between two points
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getRandomColor() {
    // Generate a random RGB color string
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function startButton() {
    // Run k-means clustering
    var numClusters = document.getElementById("clusterNum").value;
    const clusters = kMeans(points, numClusters);
    // Draw clusters in different colors
    for (let i = 0; i < clusters.length; i++) {
        const color = getRandomColor();
        for (let j = 0; j < clusters[i].length; j++) {
            const { x, y } = clusters[i][j];
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function clearButton() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}