class AntikytherAstrolabe {
    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = null;
        this.camera = null;
        this.planets = {};
        this.zodiacWheel = null;
        this.houses = [];
        this.aspectLines = [];
        this.isAnimating = false;
        this.animationSpeed = 1;
        this.currentDate = new Date();
        this.birthDate = new Date('1972-01-25T07:32:00');
        this.birthCoords = { lat: 53.5461, lon: -113.4938 };
        this.showLabels = false;
        this.planetLabels = [];
        this.zodiacLabels = [];

        this.planetColors = {
            Sun: new BABYLON.Color3(1, 0.8, 0.2),
            Moon: new BABYLON.Color3(0.9, 0.9, 1),
            Mercury: new BABYLON.Color3(0.8, 0.8, 0.8),
            Venus: new BABYLON.Color3(1, 0.7, 0.9),
            Mars: new BABYLON.Color3(1, 0.3, 0.2),
            Jupiter: new BABYLON.Color3(1, 0.6, 0.2),
            Saturn: new BABYLON.Color3(0.8, 0.7, 0.4),
            Uranus: new BABYLON.Color3(0.4, 0.8, 1),
            Neptune: new BABYLON.Color3(0.2, 0.4, 1),
            Pluto: new BABYLON.Color3(0.6, 0.4, 0.6)
        };

        this.zodiacSigns = [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];

        // Constellation star patterns (simplified, relative positions)
        this.constellationPatterns = {
            'Aries': [
                {x: 0, y: 0}, {x: 0.8, y: 0.3}, {x: 1.2, y: -0.2}
            ],
            'Taurus': [
                {x: -0.5, y: 0.8}, {x: 0, y: 0}, {x: 0.7, y: -0.3}, {x: 1.0, y: 0.5}, {x: -0.8, y: -0.2}
            ],
            'Gemini': [
                {x: -0.6, y: 0.8}, {x: -0.3, y: 0.3}, {x: 0, y: 0}, {x: 0.3, y: 0.3}, {x: 0.6, y: 0.8},
                {x: -0.6, y: -0.8}, {x: -0.3, y: -0.3}, {x: 0.3, y: -0.3}, {x: 0.6, y: -0.8}
            ],
            'Cancer': [
                {x: -0.4, y: 0.6}, {x: 0, y: 0}, {x: 0.4, y: 0.6}, {x: -0.7, y: -0.4}, {x: 0.7, y: -0.4}
            ],
            'Leo': [
                {x: -1.0, y: 0.5}, {x: -0.3, y: 0.8}, {x: 0, y: 0}, {x: 0.5, y: -0.3}, {x: 0.8, y: -0.8}, {x: 0.2, y: -0.6}
            ],
            'Virgo': [
                {x: -0.8, y: 0.6}, {x: -0.4, y: 0.8}, {x: 0, y: 0}, {x: 0.3, y: -0.4}, {x: 0.8, y: -0.2}, {x: 0.6, y: -0.8}
            ],
            'Libra': [
                {x: -0.8, y: 0.4}, {x: -0.3, y: 0.6}, {x: 0, y: 0}, {x: 0.3, y: 0.6}, {x: 0.8, y: 0.4}, {x: 0, y: -0.8}
            ],
            'Scorpio': [
                {x: -0.9, y: 0.3}, {x: -0.6, y: 0.6}, {x: -0.3, y: 0.2}, {x: 0, y: 0}, {x: 0.4, y: -0.3}, {x: 0.7, y: -0.7}, {x: 1.0, y: -0.9}
            ],
            'Sagittarius': [
                {x: -0.8, y: -0.5}, {x: -0.3, y: 0}, {x: 0, y: 0.6}, {x: 0.4, y: 0.3}, {x: 0.8, y: -0.2}, {x: 0.5, y: -0.8}
            ],
            'Capricorn': [
                {x: -0.8, y: 0.3}, {x: -0.4, y: 0.7}, {x: 0, y: 0}, {x: 0.4, y: -0.5}, {x: 0.8, y: -0.8}, {x: 0.6, y: 0.2}
            ],
            'Aquarius': [
                {x: -0.9, y: 0.2}, {x: -0.4, y: 0.8}, {x: 0, y: 0}, {x: 0.4, y: 0.8}, {x: 0.9, y: 0.2}, {x: 0.2, y: -0.6}, {x: -0.2, y: -0.8}
            ],
            'Pisces': [
                {x: -1.0, y: 0.5}, {x: -0.6, y: 0.8}, {x: -0.2, y: 0.3}, {x: 0, y: 0}, {x: 0.2, y: 0.3}, {x: 0.6, y: 0.8}, {x: 1.0, y: 0.5},
                {x: -0.8, y: -0.6}, {x: 0.8, y: -0.6}
            ]
        };

        // Additional non-zodiac constellations for the right side
        this.extraConstellations = {
            'Orion': {
                angle: 90, // Right side
                pattern: [
                    {x: -0.3, y: 1.2}, {x: 0.3, y: 1.2}, {x: 0.8, y: 0.8}, // Belt area
                    {x: -0.2, y: 0.6}, {x: 0, y: 0}, {x: 0.2, y: 0.6}, // Belt stars
                    {x: -0.8, y: -0.4}, {x: 0.8, y: -0.4}, {x: -0.5, y: -1.0}, {x: 0.5, y: -1.0} // Lower stars
                ]
            },
            'Cassiopeia': {
                angle: 45, // Upper right
                pattern: [
                    {x: -1.0, y: 0.8}, {x: -0.3, y: 1.2}, {x: 0, y: 0.6}, {x: 0.3, y: 1.2}, {x: 1.0, y: 0.8}
                ]
            },
            'Ursa Major': {
                angle: 70, // Right side upper
                pattern: [
                    {x: -1.2, y: 0.4}, {x: -0.8, y: 0.6}, {x: -0.4, y: 0.8}, {x: 0, y: 0.6}, // Big dipper bowl
                    {x: 0.4, y: 0.2}, {x: 0.8, y: -0.2}, {x: 1.2, y: -0.6} // Handle
                ]
            },
            'Andromeda': {
                angle: 110, // Lower right
                pattern: [
                    {x: -0.8, y: 0.6}, {x: -0.3, y: 0.8}, {x: 0, y: 0}, {x: 0.4, y: -0.4}, {x: 0.8, y: -0.8}
                ]
            },
            'Perseus': {
                angle: 130, // Lower right
                pattern: [
                    {x: -0.6, y: 1.0}, {x: -0.2, y: 0.6}, {x: 0, y: 0}, {x: 0.3, y: -0.5},
                    {x: 0.6, y: -0.8}, {x: -0.4, y: -0.3}
                ]
            }
        };

        this.showConstellations = true;
        this.constellationMeshes = [];

        this.init();
    }

    async init() {
        await this.createScene();
        this.setupControls();
        this.calculateNatalChart();
        this.startRenderLoop();
    }

    async createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.08);

        // Create camera
        this.camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 3, 15, BABYLON.Vector3.Zero(), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());

        // Set as active camera - controls are automatic in modern Babylon.js
        this.scene.activeCamera = this.camera;
        this.camera.wheelDeltaPercentage = 0.01;

        // Create ancient-style lighting
        this.createAncientLighting();

        // Create materials
        this.createAncientMaterials();

        // Create zodiac wheel
        await this.createZodiacWheel();

        // Create planet markers
        this.createPlanetMarkers();

        // Create houses
        this.createHouses();

        // Add particle system for mystical effect
        this.createMysticalParticles();

        // Create constellations by default
        this.createConstellations();
    }

    createAncientLighting() {
        // Main directional light (like sunlight through ancient temple)
        const mainLight = new BABYLON.DirectionalLight('mainLight', new BABYLON.Vector3(-1, -1, -0.5), this.scene);
        mainLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7);
        mainLight.intensity = 0.8;

        // Ambient golden glow
        const ambientLight = new BABYLON.HemisphericLight('ambientLight', new BABYLON.Vector3(0, 1, 0), this.scene);
        ambientLight.diffuse = new BABYLON.Color3(0.3, 0.25, 0.15);
        ambientLight.intensity = 0.4;

        // Point light for bronze reflection
        const pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 5, 5), this.scene);
        pointLight.diffuse = new BABYLON.Color3(1, 0.8, 0.4);
        pointLight.intensity = 0.6;
    }

    createAncientMaterials() {
        // Bronze material for main structure
        this.bronzeMaterial = new BABYLON.PBRMaterial('bronze', this.scene);
        this.bronzeMaterial.baseColor = new BABYLON.Color3(0.8, 0.5, 0.2);
        this.bronzeMaterial.metallicFactor = 0.8;
        this.bronzeMaterial.roughnessFactor = 0.3;
        this.bronzeMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.05, 0.02);

        // Gold material for highlights
        this.goldMaterial = new BABYLON.PBRMaterial('gold', this.scene);
        this.goldMaterial.baseColor = new BABYLON.Color3(1, 0.8, 0.2);
        this.goldMaterial.metallicFactor = 0.9;
        this.goldMaterial.roughnessFactor = 0.2;
        this.goldMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.08, 0.02);

        // Aged bronze for background elements
        this.agedBronzeMaterial = new BABYLON.PBRMaterial('agedBronze', this.scene);
        this.agedBronzeMaterial.baseColor = new BABYLON.Color3(0.4, 0.3, 0.15);
        this.agedBronzeMaterial.metallicFactor = 0.6;
        this.agedBronzeMaterial.roughnessFactor = 0.7;

        // Glowing material for planets
        this.glowMaterial = new BABYLON.StandardMaterial('glow', this.scene);
        this.glowMaterial.emissiveColor = new BABYLON.Color3(1, 0.8, 0.2);
        this.glowMaterial.disableLighting = true;
    }

    async createZodiacWheel() {
        // Create main zodiac ring
        const outerRing = BABYLON.MeshBuilder.CreateTorus('outerRing', {
            diameter: 10,
            thickness: 0.2,
            tessellation: 48
        }, this.scene);
        outerRing.material = this.bronzeMaterial;

        const innerRing = BABYLON.MeshBuilder.CreateTorus('innerRing', {
            diameter: 8,
            thickness: 0.15,
            tessellation: 48
        }, this.scene);
        innerRing.material = this.goldMaterial;

        // Create zodiac divisions
        this.createZodiacDivisions();

        // Create degree markings
        this.createDegreeMarkings();

        this.zodiacWheel = outerRing;
    }

    createZodiacDivisions() {
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;

            // Create division line
            const line = BABYLON.MeshBuilder.CreateBox(`division${i}`, {
                width: 0.05,
                height: 1,
                depth: 0.05
            }, this.scene);

            line.position.x = Math.cos(angle) * 4.5;
            line.position.z = Math.sin(angle) * 4.5;
            line.rotation.y = angle;
            line.material = this.goldMaterial;

            // Create zodiac sign symbol (simplified geometric representation)
            this.createZodiacSymbol(i, angle);
        }
    }

    createZodiacSymbol(signIndex, angle) {
        const symbol = BABYLON.MeshBuilder.CreateSphere(`zodiac${signIndex}`, {
            diameter: 0.3
        }, this.scene);

        symbol.position.x = Math.cos(angle) * 5.2;
        symbol.position.z = Math.sin(angle) * 5.2;
        symbol.position.y = 0.1;

        // Create different colored materials for each sign
        const symbolMaterial = new BABYLON.StandardMaterial(`zodiacMat${signIndex}`, this.scene);
        const hue = signIndex / 12;
        symbolMaterial.emissiveColor = BABYLON.Color3.FromHSV(hue * 360, 0.8, 0.9);
        symbolMaterial.diffuseColor = BABYLON.Color3.FromHSV(hue * 360, 0.6, 0.7);
        symbol.material = symbolMaterial;

        // Add glow effect
        const glowLayer = new BABYLON.GlowLayer('glow', this.scene);
        glowLayer.addIncludedOnlyMesh(symbol);
        glowLayer.intensity = 0.5;
    }

    createDegreeMarkings() {
        // Create markings every 5 degrees
        for (let deg = 0; deg < 360; deg += 5) {
            const angle = deg * Math.PI / 180;
            const isMainDegree = deg % 30 === 0;

            const marking = BABYLON.MeshBuilder.CreateBox(`degree${deg}`, {
                width: 0.02,
                height: isMainDegree ? 0.4 : 0.2,
                depth: 0.02
            }, this.scene);

            const radius = isMainDegree ? 4.8 : 4.6;
            marking.position.x = Math.cos(angle) * radius;
            marking.position.z = Math.sin(angle) * radius;
            marking.rotation.y = angle;
            marking.material = isMainDegree ? this.goldMaterial : this.agedBronzeMaterial;
        }
    }

    createPlanetMarkers() {
        const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

        planetNames.forEach(planet => {
            const sphere = BABYLON.MeshBuilder.CreateSphere(planet, {
                diameter: planet === 'Sun' ? 0.3 : planet === 'Moon' ? 0.25 : 0.2
            }, this.scene);

            // Create planet material
            const planetMat = new BABYLON.StandardMaterial(`${planet}Mat`, this.scene);
            planetMat.diffuseColor = this.planetColors[planet];
            planetMat.emissiveColor = this.planetColors[planet].scale(0.3);
            sphere.material = planetMat;

            // Add glow
            const glowLayer = new BABYLON.GlowLayer(`${planet}Glow`, this.scene);
            glowLayer.addIncludedOnlyMesh(sphere);
            glowLayer.intensity = 0.8;

            this.planets[planet] = {
                mesh: sphere,
                angle: 0,
                material: planetMat
            };
        });
    }

    createHouses() {
        // Create 12 house divisions
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;

            const houseLine = BABYLON.MeshBuilder.CreateBox(`house${i}`, {
                width: 0.03,
                height: 2,
                depth: 0.03
            }, this.scene);

            houseLine.position.x = Math.cos(angle) * 3;
            houseLine.position.z = Math.sin(angle) * 3;
            houseLine.rotation.y = angle;
            houseLine.material = this.agedBronzeMaterial;

            this.houses.push(houseLine);
        }
    }

    createMysticalParticles() {
        const particleSystem = new BABYLON.ParticleSystem('particles', 100, this.scene);

        // Create a simple texture for particles
        const particleTexture = new BABYLON.DynamicTexture('particleTexture', {width: 32, height: 32}, this.scene);
        const context = particleTexture.getContext();
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(212,175,55,0.8)');
        gradient.addColorStop(1, 'rgba(212,175,55,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
        particleTexture.update();

        particleSystem.particleTexture = particleTexture;

        particleSystem.emitter = BABYLON.Vector3.Zero();
        particleSystem.minEmitBox = new BABYLON.Vector3(-6, 0, -6);
        particleSystem.maxEmitBox = new BABYLON.Vector3(6, 2, 6);

        particleSystem.color1 = new BABYLON.Color4(1, 0.8, 0.2, 0.3);
        particleSystem.color2 = new BABYLON.Color4(0.8, 0.6, 0.1, 0.1);

        particleSystem.minSize = 0.02;
        particleSystem.maxSize = 0.08;
        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 8;
        particleSystem.emitRate = 10;

        particleSystem.direction1 = new BABYLON.Vector3(0, 0.5, 0);
        particleSystem.direction2 = new BABYLON.Vector3(0, 1, 0);

        particleSystem.minAngularSpeed = -Math.PI;
        particleSystem.maxAngularSpeed = Math.PI;

        particleSystem.start();
    }

    calculatePlanetaryPositions(date) {
        const positions = {};
        const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

        // Check if Astronomy library is available
        if (typeof Astronomy !== 'undefined') {
            try {
                const observer = new Astronomy.Observer(this.birthCoords.lat, this.birthCoords.lon, 0);
                const bodies = [
                    Astronomy.Body.Sun, Astronomy.Body.Moon, Astronomy.Body.Mercury,
                    Astronomy.Body.Venus, Astronomy.Body.Mars, Astronomy.Body.Jupiter,
                    Astronomy.Body.Saturn, Astronomy.Body.Uranus, Astronomy.Body.Neptune,
                    Astronomy.Body.Pluto
                ];

                bodies.forEach((body, index) => {
                    const bodyName = planetNames[index];
                    try {
                        const equatorial = Astronomy.Equator(body, date, observer, false, true);
                        let longitude = (equatorial.ra * 15) % 360;
                        if (longitude < 0) longitude += 360;

                        positions[bodyName] = {
                            longitude: longitude,
                            latitude: equatorial.dec,
                            distance: equatorial.dist
                        };
                    } catch (e) {
                        console.warn(`Could not calculate position for ${bodyName}:`, e);
                        positions[bodyName] = this.getFallbackPosition(bodyName, date);
                    }
                });
            } catch (e) {
                console.error('Error with Astronomy library:', e);
                return this.getFallbackPositions(date);
            }
        } else {
            console.warn('Astronomy library not loaded, using fallback positions');
            return this.getFallbackPositions(date);
        }

        return positions;
    }

    getFallbackPositions(date) {
        const positions = {};
        const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

        // Calculate days since birth for simple animation
        const daysSinceBirth = (date.getTime() - this.birthDate.getTime()) / (1000 * 60 * 60 * 24);

        planetNames.forEach((planet, index) => {
            positions[planet] = this.getFallbackPosition(planet, date, daysSinceBirth);
        });

        return positions;
    }

    getFallbackPosition(planet, date, daysSinceBirth = null) {
        if (daysSinceBirth === null) {
            daysSinceBirth = (date.getTime() - this.birthDate.getTime()) / (1000 * 60 * 60 * 24);
        }

        // Simplified orbital periods (approximate days for one orbit)
        const orbitalPeriods = {
            Sun: 365.25,
            Moon: 27.3,
            Mercury: 88,
            Venus: 225,
            Mars: 687,
            Jupiter: 4333,
            Saturn: 10759,
            Uranus: 30687,
            Neptune: 60190,
            Pluto: 90560
        };

        // Base positions at birth (your actual birth chart would need real ephemeris)
        const basePositions = {
            Sun: 305,  // Approximately Aquarius for Jan 25
            Moon: 180, // Example position
            Mercury: 290,
            Venus: 320,
            Mars: 45,
            Jupiter: 240,
            Saturn: 120,
            Uranus: 210,
            Neptune: 270,
            Pluto: 200
        };

        const period = orbitalPeriods[planet];
        const basePos = basePositions[planet];
        const movement = (daysSinceBirth / period) * 360;
        let longitude = (basePos + movement) % 360;
        if (longitude < 0) longitude += 360;

        return {
            longitude: longitude,
            latitude: 0,
            distance: 1
        };
    }

    updatePlanetPositions(date) {
        const positions = this.calculatePlanetaryPositions(date);

        Object.keys(this.planets).forEach(planetName => {
            if (positions[planetName]) {
                const pos = positions[planetName];
                const angle = pos.longitude * Math.PI / 180;
                const radius = 4 + (pos.distance * 0.1);

                this.planets[planetName].mesh.position.x = Math.cos(angle) * radius;
                this.planets[planetName].mesh.position.z = Math.sin(angle) * radius;
                this.planets[planetName].mesh.position.y = Math.sin(pos.latitude * Math.PI / 180) * 0.5;
                this.planets[planetName].angle = pos.longitude;
            }
        });

        this.updateAspectLines();
        this.updateLabels();
        this.updateInfoPanel(date, positions);
    }

    updateAspectLines() {
        // Clear existing aspect lines
        this.aspectLines.forEach(line => line.dispose());
        this.aspectLines = [];

        const planetNames = Object.keys(this.planets);
        const aspectAngles = [0, 60, 90, 120, 180]; // Conjunction, Sextile, Square, Trine, Opposition

        for (let i = 0; i < planetNames.length; i++) {
            for (let j = i + 1; j < planetNames.length; j++) {
                const planet1 = planetNames[i];
                const planet2 = planetNames[j];
                const angle1 = this.planets[planet1].angle;
                const angle2 = this.planets[planet2].angle;

                let angleDiff = Math.abs(angle1 - angle2);
                if (angleDiff > 180) angleDiff = 360 - angleDiff;

                // Check for aspects (within 5 degrees orb)
                for (let aspectAngle of aspectAngles) {
                    if (Math.abs(angleDiff - aspectAngle) < 5) {
                        this.createAspectLine(planet1, planet2, aspectAngle);
                        break;
                    }
                }
            }
        }
    }

    createAspectLine(planet1, planet2, aspectAngle) {
        const pos1 = this.planets[planet1].mesh.position;
        const pos2 = this.planets[planet2].mesh.position;

        const points = [pos1, pos2];
        const line = BABYLON.MeshBuilder.CreateLines(`aspect_${planet1}_${planet2}`, {points: points}, this.scene);

        // Color based on aspect type
        let color;
        switch(aspectAngle) {
            case 0: color = new BABYLON.Color3(1, 1, 0); break; // Conjunction - Yellow
            case 60: color = new BABYLON.Color3(0, 1, 0); break; // Sextile - Green
            case 90: color = new BABYLON.Color3(1, 0, 0); break; // Square - Red
            case 120: color = new BABYLON.Color3(0, 0, 1); break; // Trine - Blue
            case 180: color = new BABYLON.Color3(1, 0, 1); break; // Opposition - Magenta
            default: color = new BABYLON.Color3(1, 1, 1);
        }

        line.color = color;
        line.alpha = 0.6;

        this.aspectLines.push(line);
    }

    createPlanetLabels() {
        if (!this.showLabels) return;

        // Clear existing labels
        this.planetLabels.forEach(label => label.dispose());
        this.planetLabels = [];

        const planetNames = Object.keys(this.planets);

        planetNames.forEach(planetName => {
            const planet = this.planets[planetName];
            const position = planet.mesh.position;

            // Create a plane for the text - much larger
            const plane = BABYLON.MeshBuilder.CreatePlane(`${planetName}Label`, {size: 2.5}, this.scene);

            // Position the label slightly offset from the planet
            plane.position = position.clone();
            plane.position.y += 0.8;
            plane.position.x += 0.6;

            // Make it face the camera properly with manual rotation
            plane.billboardMode = BABYLON.Mesh.BILLBOARD_MODE_ALL;
            plane.rotation.x = Math.PI / 2;
            plane.rotation.y = Math.PI / 2;
            plane.rotation.z = Math.PI;

            // Create dynamic texture for text - larger resolution and text
            const texture = new BABYLON.DynamicTexture(`${planetName}LabelTexture`, {width: 512, height: 128}, this.scene);
            texture.hasAlpha = true;

            const context = texture.getContext();
            context.clearRect(0, 0, 512, 128);
            context.fillStyle = this.planetColors[planetName].toHexString();
            context.font = 'bold 48px Arial';
            context.textAlign = 'center';
            context.strokeStyle = '#000000';
            context.lineWidth = 4;
            context.strokeText(planetName, 256, 80);
            context.fillText(planetName, 256, 80);
            texture.update();

            // Create material
            const material = new BABYLON.StandardMaterial(`${planetName}LabelMat`, this.scene);
            material.diffuseTexture = texture;
            material.emissiveTexture = texture;
            material.opacityTexture = texture;
            material.disableLighting = true;

            plane.material = material;
            this.planetLabels.push(plane);
        });
    }

    createZodiacLabels() {
        if (!this.showLabels) return;

        // Clear existing zodiac labels
        this.zodiacLabels.forEach(label => label.dispose());
        this.zodiacLabels = [];

        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const signName = this.zodiacSigns[i];

            // Create a plane for the text - double the size
            const plane = BABYLON.MeshBuilder.CreatePlane(`${signName}Label`, {size: 4}, this.scene);

            // Position the label closer to center
            plane.position.x = Math.cos(angle) * 6;
            plane.position.z = Math.sin(angle) * 6;
            plane.position.y = 0.4;

            // Make it face the camera properly with manual rotation
            plane.billboardMode = BABYLON.Mesh.BILLBOARD_MODE_ALL;
            plane.rotation.x = Math.PI / 2;
            plane.rotation.y = Math.PI / 2;
            plane.rotation.z = Math.PI;

            // Create dynamic texture for text - larger resolution and text
            const texture = new BABYLON.DynamicTexture(`${signName}LabelTexture`, {width: 512, height: 128}, this.scene);
            texture.hasAlpha = true;

            const context = texture.getContext();
            context.clearRect(0, 0, 512, 128);
            context.fillStyle = '#d4af37';
            context.font = 'bold 40px Times New Roman';
            context.textAlign = 'center';
            context.strokeStyle = '#000000';
            context.lineWidth = 3;
            context.strokeText(signName, 256, 80);
            context.fillText(signName, 256, 80);
            texture.update();

            // Create material
            const material = new BABYLON.StandardMaterial(`${signName}LabelMat`, this.scene);
            material.diffuseTexture = texture;
            material.emissiveTexture = texture;
            material.opacityTexture = texture;
            material.disableLighting = true;

            plane.material = material;
            this.zodiacLabels.push(plane);
        }
    }

    toggleLabels() {
        this.showLabels = !this.showLabels;

        if (this.showLabels) {
            this.createPlanetLabels();
            this.createZodiacLabels();
        } else {
            // Hide labels
            this.planetLabels.forEach(label => label.dispose());
            this.planetLabels = [];
            this.zodiacLabels.forEach(label => label.dispose());
            this.zodiacLabels = [];
        }

        // Update button text with consistent length
        const labelsButton = document.getElementById('labelsToggle');
        labelsButton.textContent = this.showLabels ? '🏷️ Hide' : '🏷️ Show';
    }

    updateLabels() {
        if (!this.showLabels) return;

        // Update planet label positions
        const planetNames = Object.keys(this.planets);
        planetNames.forEach((planetName, index) => {
            if (index < this.planetLabels.length) {
                const planet = this.planets[planetName];
                const label = this.planetLabels[index];
                label.position = planet.mesh.position.clone();
                label.position.y += 0.8;
                label.position.x += 0.6;
            }
        });
    }

    createConstellations() {
        if (!this.showConstellations) return;

        // Clear existing constellations
        this.constellationMeshes.forEach(mesh => mesh.dispose());
        this.constellationMeshes = [];

        // Only show constellations that are "behind" the display (150-360 degrees)
        for (let i = 5; i < 12; i++) { // Back half of zodiac including Virgo
            const angle = (i * 30) * Math.PI / 180;
            const signName = this.zodiacSigns[i];
            const pattern = this.constellationPatterns[signName];

            if (!pattern) continue;

            // Create stars for this constellation
            pattern.forEach((star, starIndex) => {
                // Create star
                const starMesh = BABYLON.MeshBuilder.CreateSphere(`${signName}_star_${starIndex}`, {
                    diameter: 0.15
                }, this.scene);

                // Position star behind the astrolabe
                const baseRadius = 12; // Much further back
                const starRadius = baseRadius + (star.x * 2); // Vary depth
                const starAngle = angle + (star.x * 0.3); // Spread around base angle

                starMesh.position.x = Math.cos(starAngle) * starRadius;
                starMesh.position.z = Math.sin(starAngle) * starRadius;
                starMesh.position.y = star.y * 3; // Height variation

                // Create star material
                const starMaterial = new BABYLON.StandardMaterial(`${signName}_star_mat_${starIndex}`, this.scene);
                starMaterial.emissiveColor = new BABYLON.Color3(0.9, 0.9, 1);
                starMaterial.disableLighting = true;
                starMesh.material = starMaterial;

                // Add glow
                const glowLayer = new BABYLON.GlowLayer(`${signName}_star_glow_${starIndex}`, this.scene);
                glowLayer.addIncludedOnlyMesh(starMesh);
                glowLayer.intensity = 0.3;

                this.constellationMeshes.push(starMesh);
            });

            // Create constellation lines connecting stars
            if (pattern.length > 1) {
                this.createConstellationLines(signName, pattern, angle);
            }
        }

        // Add extra constellations to fill empty areas
        Object.keys(this.extraConstellations).forEach(constellationName => {
            const constellation = this.extraConstellations[constellationName];
            const angle = constellation.angle * Math.PI / 180;
            const pattern = constellation.pattern;

            // Create stars for this constellation
            pattern.forEach((star, starIndex) => {
                // Create star
                const starMesh = BABYLON.MeshBuilder.CreateSphere(`${constellationName}_star_${starIndex}`, {
                    diameter: 0.12 // Slightly smaller for non-zodiac
                }, this.scene);

                // Position star behind the astrolabe
                const baseRadius = 14; // Even further back for variety
                const starRadius = baseRadius + (star.x * 1.5); // Less depth variation
                const starAngle = angle + (star.x * 0.2); // Less spreading

                starMesh.position.x = Math.cos(starAngle) * starRadius;
                starMesh.position.z = Math.sin(starAngle) * starRadius;
                starMesh.position.y = star.y * 2.5; // Slightly less height variation

                // Create star material with slight color variation
                const starMaterial = new BABYLON.StandardMaterial(`${constellationName}_star_mat_${starIndex}`, this.scene);
                starMaterial.emissiveColor = new BABYLON.Color3(0.8, 0.9, 1); // Slightly more blue
                starMaterial.disableLighting = true;
                starMesh.material = starMaterial;

                // Add glow
                const glowLayer = new BABYLON.GlowLayer(`${constellationName}_star_glow_${starIndex}`, this.scene);
                glowLayer.addIncludedOnlyMesh(starMesh);
                glowLayer.intensity = 0.25;

                this.constellationMeshes.push(starMesh);
            });

            // Create constellation lines
            if (pattern.length > 1) {
                this.createExtraConstellationLines(constellationName, pattern, angle);
            }
        });
    }

    createConstellationLines(signName, pattern, baseAngle) {
        const baseRadius = 12;
        const points = [];

        // Create points for the constellation lines
        pattern.forEach(star => {
            const starRadius = baseRadius + (star.x * 2);
            const starAngle = baseAngle + (star.x * 0.3);

            points.push(new BABYLON.Vector3(
                Math.cos(starAngle) * starRadius,
                star.y * 3,
                Math.sin(starAngle) * starRadius
            ));
        });

        // Create lines connecting the stars in sequence
        for (let i = 0; i < points.length - 1; i++) {
            const linePoints = [points[i], points[i + 1]];
            const line = BABYLON.MeshBuilder.CreateLines(`${signName}_line_${i}`, {
                points: linePoints
            }, this.scene);

            line.color = new BABYLON.Color3(0.6, 0.6, 0.8);
            line.alpha = 0.4;

            this.constellationMeshes.push(line);
        }

        // For some constellations, add additional connecting lines
        if (signName === 'Gemini' && points.length >= 9) {
            // Connect the twin figures
            const twinLine = BABYLON.MeshBuilder.CreateLines(`${signName}_twin_line`, {
                points: [points[0], points[5]] // Connect top stars of each twin
            }, this.scene);
            twinLine.color = new BABYLON.Color3(0.6, 0.6, 0.8);
            twinLine.alpha = 0.4;
            this.constellationMeshes.push(twinLine);
        }
    }

    createExtraConstellationLines(constellationName, pattern, baseAngle) {
        const baseRadius = 14;
        const points = [];

        // Create points for the constellation lines
        pattern.forEach(star => {
            const starRadius = baseRadius + (star.x * 1.5);
            const starAngle = baseAngle + (star.x * 0.2);

            points.push(new BABYLON.Vector3(
                Math.cos(starAngle) * starRadius,
                star.y * 2.5,
                Math.sin(starAngle) * starRadius
            ));
        });

        // Create lines connecting the stars in sequence
        for (let i = 0; i < points.length - 1; i++) {
            const linePoints = [points[i], points[i + 1]];
            const line = BABYLON.MeshBuilder.CreateLines(`${constellationName}_line_${i}`, {
                points: linePoints
            }, this.scene);

            line.color = new BABYLON.Color3(0.5, 0.6, 0.9); // Slightly more blue
            line.alpha = 0.3;

            this.constellationMeshes.push(line);
        }

        // Special constellation-specific connections
        if (constellationName === 'Orion' && points.length >= 6) {
            // Connect belt stars (indices 3, 4, 5)
            for (let i = 3; i < 5; i++) {
                const beltLine = BABYLON.MeshBuilder.CreateLines(`${constellationName}_belt_${i}`, {
                    points: [points[i], points[i + 1]]
                }, this.scene);
                beltLine.color = new BABYLON.Color3(0.7, 0.7, 1);
                beltLine.alpha = 0.5;
                this.constellationMeshes.push(beltLine);
            }
        }

        if (constellationName === 'Ursa Major' && points.length >= 7) {
            // Connect the Big Dipper properly
            const dipperConnections = [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]];
            dipperConnections.forEach((connection, idx) => {
                const dipperLine = BABYLON.MeshBuilder.CreateLines(`${constellationName}_dipper_${idx}`, {
                    points: [points[connection[0]], points[connection[1]]]
                }, this.scene);
                dipperLine.color = new BABYLON.Color3(0.8, 0.8, 1);
                dipperLine.alpha = 0.4;
                this.constellationMeshes.push(dipperLine);
            });
        }
    }

    toggleConstellations() {
        this.showConstellations = !this.showConstellations;

        if (this.showConstellations) {
            this.createConstellations();
        } else {
            this.constellationMeshes.forEach(mesh => mesh.dispose());
            this.constellationMeshes = [];
        }

        // Update button text
        const constellationsButton = document.getElementById('constellationsToggle');
        if (constellationsButton) {
            constellationsButton.textContent = this.showConstellations ? '⭐ Hide' : '⭐ Show';
        }
    }

    updateInfoPanel(date, positions) {
        const infoDiv = document.getElementById('planetaryInfo');
        const dateDiv = document.getElementById('currentDate');

        dateDiv.textContent = date.toLocaleString();

        let html = '';
        Object.keys(positions).forEach(planet => {
            const pos = positions[planet];
            const signIndex = Math.floor(pos.longitude / 30);
            const degrees = Math.floor(pos.longitude % 30);
            const minutes = Math.floor(((pos.longitude % 30) - degrees) * 60);

            html += `<div class="planet-info">
                <strong>${planet}:</strong> ${this.zodiacSigns[signIndex]} ${degrees}°${minutes}'
            </div>`;
        });

        infoDiv.innerHTML = html;
    }

    calculateNatalChart() {
        this.currentDate = new Date(this.birthDate);
        this.updatePlanetPositions(this.currentDate);
    }

    setupControls() {
        // Modal elements
        const modal = document.getElementById('birthDataModal');
        const birthDateInput = document.getElementById('birthDate');
        const birthTimeInput = document.getElementById('birthTime');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');
        const calculateButton = document.getElementById('calculateChart');
        const useDefaultsButton = document.getElementById('useDefaults');
        const reopenModalButton = document.getElementById('reopenModal');

        // Help modal elements
        const helpModal = document.getElementById('helpModal');
        const helpButton = document.getElementById('helpButton');
        const closeHelpButton = document.getElementById('closeHelp');

        // Labels toggle
        const labelsToggle = document.getElementById('labelsToggle');

        // Constellations toggle
        const constellationsToggle = document.getElementById('constellationsToggle');

        // Control elements
        const resetButton = document.getElementById('resetToNow');
        const playPauseButton = document.getElementById('playPause');
        const speedSlider = document.getElementById('speedSlider');
        const speedDisplay = document.getElementById('speedDisplay');

        // Show modal on startup
        this.showModal();

        // Modal controls
        calculateButton.addEventListener('click', () => {
            const dateStr = birthDateInput.value;
            const timeStr = birthTimeInput.value;
            this.birthDate = new Date(`${dateStr}T${timeStr}:00`);
            this.birthCoords.lat = parseFloat(latitudeInput.value);
            this.birthCoords.lon = parseFloat(longitudeInput.value);
            this.calculateNatalChart();
            this.hideModal();
        });

        useDefaultsButton.addEventListener('click', () => {
            // Use your demo data
            this.calculateNatalChart();
            this.hideModal();
        });

        reopenModalButton.addEventListener('click', () => {
            this.showModal();
        });

        // Help modal controls
        helpButton.addEventListener('click', () => {
            this.showHelpModal();
        });

        closeHelpButton.addEventListener('click', () => {
            this.hideHelpModal();
        });

        // Close help modal when clicking outside
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                this.hideHelpModal();
            }
        });

        // Labels toggle
        labelsToggle.addEventListener('click', () => {
            this.toggleLabels();
        });

        // Constellations toggle
        constellationsToggle.addEventListener('click', () => {
            this.toggleConstellations();
        });

        // Time controls
        resetButton.addEventListener('click', () => {
            this.currentDate = new Date();
            this.updatePlanetPositions(this.currentDate);
        });

        playPauseButton.addEventListener('click', () => {
            this.isAnimating = !this.isAnimating;
            playPauseButton.textContent = this.isAnimating ? '⏸ Pause' : '▶ Play';
        });

        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            speedDisplay.textContent = `${this.animationSpeed}x`;
        });

        // Start animation
        this.startAnimation();
    }

    showModal() {
        const modal = document.getElementById('birthDataModal');
        modal.classList.remove('hidden');
    }

    hideModal() {
        const modal = document.getElementById('birthDataModal');
        modal.classList.add('hidden');
    }

    showHelpModal() {
        const helpModal = document.getElementById('helpModal');
        helpModal.classList.remove('hidden');
    }

    hideHelpModal() {
        const helpModal = document.getElementById('helpModal');
        helpModal.classList.add('hidden');
    }

    startAnimation() {
        const animate = () => {
            if (this.isAnimating) {
                // Advance time by speed factor (1 hour per frame at 1x speed)
                this.currentDate.setHours(this.currentDate.getHours() + this.animationSpeed);
                this.updatePlanetPositions(this.currentDate);

                // Add subtle rotation to the zodiac wheel
                if (this.zodiacWheel) {
                    this.zodiacWheel.rotation.y += 0.001 * this.animationSpeed;
                }
            }

            requestAnimationFrame(animate);
        };
        animate();
    }

    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new AntikytherAstrolabe();
});