// Copyright 2016 Las Venturas Playground. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

const Economy = require('features/economy/economy.js');
const HouseManager = require('features/houses/house_manager.js');
const MockHouseDatabase = require('features/houses/test/mock_house_database.js');

describe('HouseManager', (it, beforeEach, afterEach) => {
    let manager = null;

    afterEach(() => manager.dispose());
    beforeEach(() => {
        const economy = new Economy();

        manager = new HouseManager(() => economy);
        manager.database_ = new MockHouseDatabase();
    });

    it('should be able to load the existing houses', async(assert) => {
        await manager.loadHousesFromDatabase();

        assert.isAbove(manager.locationCount, 0);

        let parkingLotCount = 0;

        for (const location of manager.locations)
            parkingLotCount += location.parkingLotCount;

        assert.isAbove(parkingLotCount, 0);

        let occupiedCount = 0;

        for (const location of manager.locations) {
            if (!location.isAvailable())
                occupiedCount++;
        }

        assert.isAbove(occupiedCount, 0);

        // TODO: Verify the other pieces of data that can be loaded.
    });

    it('should be able to create new house locations', async(assert) => {
        const gunther = server.playerManager.getById(0 /* Gunther */);
        const locationCount = manager.locationCount;

        gunther.identify();

        await manager.createLocation(gunther, new Vector(50, 50, 10));

        assert.equal(manager.locationCount, locationCount + 1);
    });

    it('should be able to find the closest house to a player', async(assert) => {
        const gunther = server.playerManager.getById(0 /* Gunther */);
        gunther.position = new Vector(200, 200, 300);

        await manager.loadHousesFromDatabase();

        assert.isAbove(manager.locationCount, 0);

        const closestLocation = await manager.findClosestLocation(gunther);
        assert.isNotNull(closestLocation);

        assert.equal(gunther.position.distanceTo(closestLocation.position), 50);
    });

    it('should be able to limit searches to find the closest house', async(assert) => {
        const gunther = server.playerManager.getById(0 /* Gunther */);
        gunther.position = new Vector(200, 200, 300);

        await manager.loadHousesFromDatabase();

        assert.isAbove(manager.locationCount, 0);

        const closestLocation =
            await manager.findClosestLocation(gunther, 40 /* maximumDistance */);
        assert.isNull(closestLocation);
    });

    it('should be able to remove existing house locations', async(assert) => {
        const gunther = server.playerManager.getById(0 /* Gunther */);
        gunther.identify();

        assert.equal(manager.locationCount, 0);

        await manager.createLocation(gunther, new Vector(50, 50, 10));
        assert.equal(manager.locationCount, 1);

        const locations = Array.from(manager.locations_);
        assert.equal(locations.length, manager.locationCount);

        const location = locations[0];

        await manager.removeLocation(location);

        assert.equal(manager.locationCount, 0);
    });

    it('should be able to create and remove parking lot locations', async(assert) => {
        const gunther = server.playerManager.getById(0 /* Gunther */);
        gunther.identify();

        await manager.loadHousesFromDatabase();

        const location = await manager.findClosestLocation(gunther);
        assert.isNotNull(location);

        assert.equal(location.parkingLotCount, 0);

        await manager.createLocationParkingLot(gunther, location, {
            position: new Vector(500, 500, 100),
            rotation: 90
        });

        assert.equal(location.parkingLotCount, 1);

        const parkingLot = Array.from(location.parkingLots)[0];

        assert.isAbove(parkingLot.id, 0);
        assert.deepEqual(parkingLot.position, new Vector(500, 500, 100));
        assert.equal(parkingLot.rotation, 90);

        await manager.removeLocationParkingLot(location, parkingLot);

        assert.equal(location.parkingLotCount, 0);
    });

    it('should be able to create houses given a location', async(assert) => {
        await manager.loadHousesFromDatabase();

        const gunther = server.playerManager.getById(0 /* Gunther */);
        gunther.identify();

        const location = await manager.findClosestLocation(gunther);
        assert.isTrue(location.isAvailable());

        await manager.createHouse(gunther, location, 1 /* interiorId */);

        assert.isFalse(location.isAvailable());

        assert.equal(location.settings.ownerId, gunther.userId);
        assert.equal(location.settings.ownerName, gunther.name);

        assert.equal(location.interior.interiorId, 1 /* interiorId */);

        // TODO: Verify that the entrance controller has been updated
    });

    it('should be able to remove houses from a given location', async(assert) => {
        await manager.loadHousesFromDatabase();

        const gunther = server.playerManager.getById(0 /* Gunther */);
        gunther.position = new Vector(500, 500, 500);
        gunther.identify();

        const location = await manager.findClosestLocation(gunther);
        assert.isFalse(location.isAvailable());

        await manager.removeLocation(location);

        assert.isFalse(location.isAvailable());

        // TODO: Verify that the entrance controller has been updated
    });

    // TODO: it('should respawn players who are inside a removed house')
});
