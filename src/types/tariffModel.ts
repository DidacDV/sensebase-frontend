export interface TariffBlueprint {
    id: number;
    name: string;
    description: string;
    owner: number;
    owner_email: string;
    board: number;
    board_name: string;

    // Contracted power
    contracted_power_p1: string;
    contracted_power_p2: string;
    contracted_power_p3: string;
    contracted_power_p4: string;
    contracted_power_p5: string;
    contracted_power_p6: string;

    // Peajes power
    peaje_power_p1: string;
    peaje_power_p2: string;
    peaje_power_p3: string;
    peaje_power_p4: string;
    peaje_power_p5: string;
    peaje_power_p6: string;

    // Cargos power
    cargo_power_p1: string;
    cargo_power_p2: string;
    cargo_power_p3: string;
    cargo_power_p4: string;
    cargo_power_p5: string;
    cargo_power_p6: string;

    // Peajes energy
    peaje_energy_p1: string;
    peaje_energy_p2: string;
    peaje_energy_p6: string;

    // Cargos energy
    cargo_energy_p1: string;
    cargo_energy_p2: string;
    cargo_energy_p6: string;

    // Fixed costs
    electricity_tax_percentage: string;
    social_bonus_financing_daily: string;
    meter_rental_daily: string;

    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateTariffBlueprintPayload {
    board_id: number;
    name: string;
    description?: string;

    contracted_power_p1: string;
    contracted_power_p2: string;
    contracted_power_p3: string;
    contracted_power_p4: string;
    contracted_power_p5: string;
    contracted_power_p6: string;

    peaje_power_p1: string;
    peaje_power_p2: string;
    peaje_power_p3: string;
    peaje_power_p4: string;
    peaje_power_p5: string;
    peaje_power_p6: string;

    cargo_power_p1: string;
    cargo_power_p2: string;
    cargo_power_p3: string;
    cargo_power_p4: string;
    cargo_power_p5: string;
    cargo_power_p6: string;

    peaje_energy_p1: string;
    peaje_energy_p2: string;
    peaje_energy_p6: string;

    cargo_energy_p1: string;
    cargo_energy_p2: string;
    cargo_energy_p6: string;

    electricity_tax_percentage?: string;
    social_bonus_financing_daily?: string;
    meter_rental_daily?: string;
}