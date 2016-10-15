// Copyright 2016 Las Venturas Playground. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

const FightLocation = require('features/fights/fight_location.js');
const FightSettings = require('features/fights/fight_settings.js');

// Builder for the FightSettings object, which only stores immutable data and therefore isn't easy
// to work with. Default values for all settings are defined here.
class FightSettingsBuilder {
    constructor() {
        this.location_ = FightLocation.getById(1 /* LV FightClub */);
        this.weapons_ = new Map();

        this.health_ = 100;
        this.armour_ = 0;

        this.timeHours_ = 12;
        this.timeMinutes_ = 0;

        this.weather_ = 1;  // sunny

        this.teamDamagePolicy_ = FightSettings.TEAM_DAMAGE_POLICY_DEFAULT;
        this.visibilityPolicy_ = FightSettings.VISIBILITY_POLICY_VISIBLE;

        this.recording_ = false;
    }

    // Builds a new instance of the FightSettings object.
    build() {
        return new FightSettings({
            location: this.location_,
            weapons: this.weapons_,
            health: this.health_,
            armour: this.armour_,
            time: { hours: this.timeHours_, minutes: this.timeMinutes_ },
            weather: this.weather_,
            teamDamagePolicy: this.teamDamagePolicy_,
            visibilityPolicy: this.visibilityPolicy_,
            recording: this.recording_
        });
    }

    // Gets or sets the location at which the fight should take place.
    get location() { return this.location_; }
    set location(value) { this.location_ = value; }

    // Gets an iterator to the weapons that have been added for the fight.
    get weapons() { return this.weapons_.entries(); }

    // Adds the |weapon| to the fight, having |ammo| rounds of ammunition.
    addWeapon(weapon, ammo) { this.weapons_.set(weapon, ammo); }

    // Removes the |weapon| from the fight.
    removeWeapon(weapon) { this.weapons_.delete(weapon); }

    // Gets or sets the amount of health players should spawn with during the fight.
    get health() { return this.health_; }
    set health(value) { this.health_ = value; }

    // Gets or sets the amount of armour players should spawn with during the fight.
    get armour() { return this.armour_; }
    set armour(value) { this.armour_ = value; }

    // Gets or sets the time at which the fight should take place. The time has both hour and minute
    // components, both of which are configurable.
    get timeHours() { return this.timeHours_; }
    set timeHours(value) { this.timeHours_ = value; }

    get timeMinutes() { return this.timeMinutes_; }
    set timeMinutes(value) { this.timeMinutes_ = value; }

    // Gets or sets the weather that should be active during the match.
    get weather() { return this.weather_; }
    set weather(value) { this.weather_ = value; }

    // Gets or sets the team damage policy for team-oriented fights.
    get teamDamagePolicy() { return this.teamDamagePolicy_; }
    set teamDamagePolicy(value) { this.teamDamagePolicy_ = value; }

    // Gets or sets the visibility policy for players participating in the match.
    get visibilityPolicy() { return this.visibilityPolicy_; }
    set visibilityPolicy(value) { this.visibilityPolicy_ = value; }

    // Gets or sets whether the fight should be recorded for future viewing.
    get recording() { return this.recording_; }
    set recording(value) { this.recording_ = value; }
}

exports = FightSettingsBuilder;