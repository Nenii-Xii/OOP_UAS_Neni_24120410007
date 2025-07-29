// BAGIAN 1: DEFINISI KELAS-KELAS

class Person {
    constructor(personId, firstName, lastName, birthDate) {
        // Membuat kelas ini seolah-olah "abstract"
        if (this.constructor === Person) {
            throw new Error("Abstract class 'Person' tidak bisa diinstansiasi secara langsung.");
        }
        this._personId = personId;
        this._firstName = firstName;
        this._lastName = lastName;
        this._birthDate = new Date(birthDate);
    }
    getFullName() { return `${this._firstName} ${this._lastName}`; }
    getAge() {
        const diff_ms = Date.now() - this._birthDate.getTime();
        const age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
}

class Player extends Person {
    constructor(personId, firstName, lastName, birthDate, playerNumber, position) {
        super(personId, firstName, lastName, birthDate);
        this._playerNumber = playerNumber;
        this._position = position;
    }
    playMatch() { console.log(`ACTION: ${this.getFullName()} (#${this._playerNumber}) sedang bermain.`); }
}

class Coach extends Person {
    constructor(personId, firstName, lastName, birthDate, coachRole) {
        super(personId, firstName, lastName, birthDate);
        this._coachRole = coachRole;
    }
    conductTraining() { console.log(`ACTION: ${this.getFullName()} (${this._coachRole}) sedang memimpin latihan.`); }
}

class Staff extends Person {
    constructor(personId, firstName, lastName, birthDate, department, role) {
        super(personId, firstName, lastName, birthDate);
        this._department = department;
        this._role = role;
    }
    performDuty() { console.log(`ACTION: ${this.getFullName()} dari ${this._department} sedang bertugas.`); }
}

// Kelas Contract, Team, dan Club tidak perlu diubah sama sekali.
class Contract {
    constructor(contractId, person, startDate, endDate, salary) {
        this._contractId = contractId; this._person = person; this._startDate = new Date(startDate);
        this._endDate = new Date(endDate); this._salary = salary;
    }
    getContractDetails() { return `Kontrak ${this._contractId} untuk ${this._person.getFullName()} | Gaji: ${this._salary}`; }
}

class Team {
    constructor(teamId, name) { this._teamId = teamId; this._name = name; this._players = []; this._coaches = []; }
    addPlayer(player) { this._players.push(player); }
    addCoach(coach) { this._coaches.push(coach); }
    listRoster() {
        console.log(`\n--- Skuad Tim: ${this._name} ---`);
        console.log("Pelatih:");
        this._coaches.forEach(c => console.log(`  - ${c.getFullName()} (${c._coachRole})`));
        console.log("Pemain:");
        this._players.forEach(p => console.log(`  - #${p._playerNumber} ${p.getFullName()} (${p._position})`));
        console.log('----------------------------------');
    }
}

class Club {
    constructor(clubId, name, stadium) { this._clubId = clubId; this._name = name; this._stadium = stadium; this._teams = []; this._personnel = []; this._contracts = []; }
    addTeam(team) { this._teams.push(team); }
    hirePerson(person, contractDetails) {
        this._personnel.push(person);
        const newContract = new Contract(contractDetails.id, person, contractDetails.startDate, contractDetails.endDate, contractDetails.salary);
        this._contracts.push(newContract);
        console.log(`✅ ${person.getFullName()} berhasil direkrut oleh ${this._name}.`);
    }
    displayClubInfo() {
        console.log(`\n================================\nINFORMASI KLUB: ${this._name}\n================================`);
        console.log("\n📄 Personel Terdaftar:");
        this._personnel.forEach(p => console.log(`- ${p.getFullName()} (Usia: ${p.getAge()})`));
        console.log("\n📄 Kontrak Aktif:");
        this._contracts.forEach(c => console.log(`- ${c.getContractDetails()}`));
    }
}

// BAGIAN 2: FACTORY METHOD PATTERN

class PersonFactory {
    /**
     * Method static untuk membuat objek turunan dari Person.
     * @param {string} personType - Tipe orang yang akan dibuat ('player', 'coach', 'staff').
     * @param {object} options - Kumpulan data untuk membuat objek.
     * @returns {Person} Objek Player, Coach, atau Staff yang baru.
     */
    static createPerson(personType, options) {
        // Ekstrak properti umum dari 'options'
        const { personId, firstName, lastName, birthDate } = options;

        switch (personType.toLowerCase()) {
            case 'player':
                // Ambil properti spesifik untuk Player
                const { playerNumber, position } = options;
                return new Player(personId, firstName, lastName, birthDate, playerNumber, position);
            
            case 'coach':
                // Ambil properti spesifik untuk Coach
                const { coachRole } = options;
                return new Coach(personId, firstName, lastName, birthDate, coachRole);

            case 'staff':
                // Ambil properti spesifik untuk Staff
                const { department, role } = options;
                return new Staff(personId, firstName, lastName, birthDate, department, role);

            default:
                throw new Error(`Tipe person tidak valid: ${personType}`);
        }
    }
}

// BAGIAN 3: PROGRAM UTAMA

try {
    // --- PERUBAHAN UTAMA: Gunakan Factory untuk membuat objek ---
    console.log("--- Membuat objek individu menggunakan PersonFactory ---");

    const coachBima = PersonFactory.createPerson('coach', {
        personId: "C001", firstName: "Bima", lastName: "Sakti", birthDate: "1976-01-23",
        coachRole: "Head Coach"
    });

    const playerEgy = PersonFactory.createPerson('player', {
        personId: "P001", firstName: "Egy", lastName: "Maulana", birthDate: "2000-07-07",
        playerNumber: 10, position: "Winger"
    });

    const playerWitan = PersonFactory.createPerson('player', {
        personId: "P002", firstName: "Witan", lastName: "Sulaeman", birthDate: "2001-10-08",
        playerNumber: 8, position: "Midfielder"
    });

    const staffAdi = PersonFactory.createPerson('staff', {
        personId: "S001", firstName: "Adi", lastName: "Nugroho", birthDate: "1985-05-20",
        department: "Medical", role: "Physiotherapist"
    });
    
    console.log("Objek berhasil dibuat.\n");

    // Sisa dari program berjalan persis sama seperti sebelumnya.
    // Ini menunjukkan kekuatan Factory: proses internal bisa berubah tanpa
    // mengganggu kode yang menggunakan hasilnya.

    const u23Team = new Team("T01", "FC Cakrawala Muda (U-23)");
    u23Team.addCoach(coachBima);
    u23Team.addPlayer(playerEgy);
    u23Team.addPlayer(playerWitan);

    const fcCakrawala = new Club("FC-CKW", "FC Cakrawala", "Stadion Cakrawala Megah");
    fcCakrawala.addTeam(u23Team);

    fcCakrawala.hirePerson(coachBima, {id: "KTR-001", startDate: "2024-01-01", endDate: "2026-12-31", salary: "Rp 50.000.000"});
    fcCakrawala.hirePerson(playerEgy, {id: "KTR-002", startDate: "2024-07-01", endDate: "2028-06-30", salary: "Rp 30.000.000"});
    fcCakrawala.hirePerson(playerWitan, {id: "KTR-003", startDate: "2024-07-01", endDate: "2028-06-30", salary: "Rp 28.000.000"});
    fcCakrawala.hirePerson(staffAdi, {id: "KTR-004", startDate: "2023-02-01", endDate: "2025-01-31", salary: "Rp 15.000.000"});

    fcCakrawala.displayClubInfo();
    u23Team.listRoster();

} catch (error) {
    console.error("Terjadi kesalahan:", error.message);
}



